import { AsyncEventBus, YukitaError, YukitaErrorCode, err, ok, toYukitaError, type Result } from '@yukita/plugin-kit';
import { LavalinkRestClient } from './LavalinkRestClient';
import { LavalinkWsClient } from './LavalinkWsClient';
import type {
  LavalinkNodeConfig,
  LavalinkNodeStats,
  LavalinkPlayerEvent,
  LavalinkPlayerUpdatePayload,
  LavalinkReadyPayload
} from './types';

/**
 * Node state lifecycle.
 */
export type LavalinkNodeState = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'destroyed';

/**
 * Public events emitted by a node wrapper.
 */
export interface LavalinkNodeEvents {
  connected: { nodeId: string; resumed: boolean };
  disconnected: { nodeId: string; code: number; reason: string };
  error: { nodeId: string; error: Error };
  stats: { nodeId: string; stats: LavalinkNodeStats };
  playerUpdate: { nodeId: string; payload: LavalinkPlayerUpdatePayload };
  playerEvent: { nodeId: string; payload: LavalinkPlayerEvent };
  raw: { nodeId: string; payload: unknown };
}

/**
 * Combined REST + WS lavalink node client.
 */
export class LavalinkNode {
  public readonly id: string;
  public readonly config: LavalinkNodeConfig;
  public readonly rest: LavalinkRestClient;
  public readonly ws: LavalinkWsClient;
  public readonly events = new AsyncEventBus<LavalinkNodeEvents>();
  public state: LavalinkNodeState = 'idle';
  public stats: LavalinkNodeStats | null = null;
  public latencyMs: number | null = null;

  private healthTimer: NodeJS.Timeout | null = null;
  private lastReadyAt = 0;

  public constructor(config: LavalinkNodeConfig) {
    this.id = config.id;
    this.config = config;
    this.rest = new LavalinkRestClient(config);
    this.ws = new LavalinkWsClient(config);
    this.bindWsEvents();
  }

  /**
   * Last known session id from lavalink websocket.
   */
  public get sessionId(): string | null {
    return this.ws.sessionId;
  }

  /**
   * Node penalty score for load-balancing strategies.
   */
  public get penalty(): number {
    if (!this.stats) {
      return Number.MAX_SAFE_INTEGER;
    }

    let score = this.stats.players;
    score += Math.round(Math.pow(1.05, 100 * this.stats.cpu.systemLoad) * 10 - 10);
    if (this.stats.frameStats) {
      score += this.stats.frameStats.deficit;
      score += this.stats.frameStats.nulled * 2;
    }
    if (this.latencyMs !== null) {
      score += Math.round(this.latencyMs / 10);
    }
    return score;
  }

  /**
   * Opens node connection and waits for ready op.
   */
  public async connect(): Promise<Result<void>> {
    if (this.state === 'destroyed') {
      return err(
        new YukitaError({
          code: YukitaErrorCode.NODE_CONNECT_FAILED,
          message: 'Cannot connect destroyed node',
          meta: { nodeId: this.id }
        })
      );
    }

    this.state = 'connecting';
    const connectResult = await this.ws.connect();
    if (!connectResult.ok) {
      this.state = 'disconnected';
      return connectResult;
    }

    const readyTimeoutMs = this.config.readyTimeoutMs ?? 12_000;
    const readyResult = await this.ws.waitForReady(readyTimeoutMs);
    if (!readyResult.ok) {
      this.state = 'disconnected';
      return readyResult;
    }

    const shouldEnableResume = this.config.resumeSession ?? true;
    if (shouldEnableResume) {
      const updateSessionResult = await this.rest.updateSession({
        sessionId: readyResult.value.sessionId,
        resuming: true,
        timeoutMs: this.config.resumeTimeoutMs ?? 60_000
      });
      if (!updateSessionResult.ok) {
        await this.events.emit('error', {
          nodeId: this.id,
          error: updateSessionResult.error
        });
      }
    }

    this.state = 'connected';
    this.lastReadyAt = Date.now();
    this.startHealthChecks();
    return ok(undefined);
  }

  /**
   * Disconnects node.
   */
  public async disconnect(): Promise<Result<void>> {
    try {
      this.state = 'disconnected';
      this.stopHealthChecks();
      await this.ws.disconnect();
      return ok(undefined);
    } catch (error) {
      return err(
        toYukitaError(error, {
          code: YukitaErrorCode.NODE_DISCONNECTED,
          message: 'Failed to disconnect lavalink node',
          meta: { nodeId: this.id }
        })
      );
    }
  }

  /**
   * Destroys node and frees resources.
   */
  public async destroy(): Promise<void> {
    this.state = 'destroyed';
    this.stopHealthChecks();
    await this.ws.destroy();
    this.events.clear();
  }

  private bindWsEvents(): void {
    this.ws.events.on('ready', async ({ payload }) => {
      this.state = 'connected';
      this.lastReadyAt = Date.now();
      await this.events.emit('connected', {
        nodeId: this.id,
        resumed: payload.resumed
      });
    });

    this.ws.events.on('stats', async ({ payload }) => {
      this.stats = payload;
      this.latencyMs = Date.now() - this.lastReadyAt;
      await this.events.emit('stats', { nodeId: this.id, stats: payload });
    });

    this.ws.events.on('playerUpdate', async ({ payload }) => {
      await this.events.emit('playerUpdate', { nodeId: this.id, payload });
    });

    this.ws.events.on('playerEvent', async ({ payload }) => {
      await this.events.emit('playerEvent', { nodeId: this.id, payload });
    });

    this.ws.events.on('raw', async ({ payload }) => {
      await this.events.emit('raw', { nodeId: this.id, payload });
    });

    this.ws.events.on('disconnected', async ({ code, reason }) => {
      this.state = 'disconnected';
      this.stopHealthChecks();
      await this.events.emit('disconnected', {
        nodeId: this.id,
        code,
        reason
      });
    });

    this.ws.events.on('error', async ({ error }) => {
      await this.events.emit('error', { nodeId: this.id, error });
    });
  }

  private startHealthChecks(): void {
    this.stopHealthChecks();
    const interval = this.config.healthCheckIntervalMs ?? 15_000;
    this.healthTimer = setInterval(() => {
      void this.runHealthCheck();
    }, interval);
  }

  private stopHealthChecks(): void {
    if (this.healthTimer) {
      clearInterval(this.healthTimer);
      this.healthTimer = null;
    }
  }

  private async runHealthCheck(): Promise<void> {
    if (this.state !== 'connected') {
      return;
    }

    const startedAt = Date.now();
    const stats = await this.rest.getStats();
    if (!stats.ok) {
      await this.events.emit('error', { nodeId: this.id, error: stats.error });
      return;
    }

    this.stats = stats.value;
    this.latencyMs = Date.now() - startedAt;
    await this.events.emit('stats', { nodeId: this.id, stats: stats.value });
  }
}
