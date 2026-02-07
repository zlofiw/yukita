import WebSocket, { type RawData } from 'ws';
import { AsyncEventBus, YukitaError, YukitaErrorCode, err, ok, type Result } from '../shared';
import { DEFAULT_RETRY_POLICY, buildBackoffDelay } from './backoff';
import { CORE_VERSION } from '../version';
import type {
  LavalinkNodeConfig,
  LavalinkNodeStats,
  LavalinkPlayerEvent,
  LavalinkPlayerUpdatePayload,
  LavalinkReadyPayload,
  LavalinkWsMessage,
  RetryPolicy
} from './types';

/**
 * WS events emitted by lavalink websocket client.
 */
export interface LavalinkWsEvents {
  connected: { nodeId: string };
  disconnected: { nodeId: string; code: number; reason: string };
  error: { nodeId: string; error: Error };
  ready: { nodeId: string; payload: LavalinkReadyPayload };
  stats: { nodeId: string; payload: LavalinkNodeStats };
  playerUpdate: { nodeId: string; payload: LavalinkPlayerUpdatePayload };
  playerEvent: { nodeId: string; payload: LavalinkPlayerEvent };
  raw: { nodeId: string; payload: LavalinkWsMessage };
}

/**
 * Lavalink websocket client with reconnect/backoff support.
 */
export class LavalinkWsClient {
  public readonly events = new AsyncEventBus<LavalinkWsEvents>();

  private readonly config: LavalinkNodeConfig;
  private readonly retryPolicy: RetryPolicy;
  private socket: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private destroyed = false;
  private manualDisconnect = false;
  private readyWaiters: Array<(result: Result<LavalinkReadyPayload>) => void> = [];
  private currentSessionId: string | null = null;

  public constructor(config: LavalinkNodeConfig) {
    this.config = config;
    this.retryPolicy = {
      ...DEFAULT_RETRY_POLICY,
      ...(config.retryPolicy ?? {})
    };
  }

  /**
   * Last known session id.
   */
  public get sessionId(): string | null {
    return this.currentSessionId;
  }

  /**
   * Opens websocket connection.
   */
  public async connect(): Promise<Result<void>> {
    if (this.destroyed) {
      return err(
        new YukitaError({
          code: YukitaErrorCode.NODE_WS_FAILED,
          message: 'Cannot connect destroyed websocket client',
          meta: { nodeId: this.config.id }
        })
      );
    }

    this.manualDisconnect = false;
    return this.openSocket();
  }

  /**
   * Waits for lavalink ready payload.
   */
  public async waitForReady(timeoutMs: number): Promise<Result<LavalinkReadyPayload>> {
    return new Promise<Result<LavalinkReadyPayload>>((resolve) => {
      const timer = setTimeout(() => {
        resolve(
          err(
            new YukitaError({
              code: YukitaErrorCode.TIMEOUT,
              message: 'Timed out waiting for Lavalink ready payload',
              meta: {
                nodeId: this.config.id,
                timeoutMs
              }
            })
          )
        );
      }, timeoutMs);

      this.readyWaiters.push((result) => {
        clearTimeout(timer);
        resolve(result);
      });
    });
  }

  /**
   * Closes websocket and disables reconnect.
   */
  public async disconnect(): Promise<void> {
    this.manualDisconnect = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (!this.socket) {
      return;
    }

    await new Promise<void>((resolve) => {
      const socket = this.socket;
      if (!socket) {
        resolve();
        return;
      }
      socket.once('close', () => resolve());
      socket.close(1000, 'manual disconnect');
    });
    this.socket = null;
  }

  /**
   * Destroys websocket client and all listeners.
   */
  public async destroy(): Promise<void> {
    this.destroyed = true;
    await this.disconnect();
    this.events.clear();
    while (this.readyWaiters.length) {
      const waiter = this.readyWaiters.shift();
      waiter?.(
        err(
          new YukitaError({
            code: YukitaErrorCode.NODE_WS_FAILED,
            message: 'Websocket client destroyed before ready',
            meta: { nodeId: this.config.id }
          })
        )
      );
    }
  }

  private async openSocket(): Promise<Result<void>> {
    const scheme = this.config.secure ? 'wss' : 'ws';
    const wsVersion = this.config.wsVersion ?? 4;
    const url = `${scheme}://${this.config.host}:${this.config.port}/v${wsVersion}/websocket`;

    try {
      const headers: Record<string, string> = {
        Authorization: this.config.password,
        'User-Id': this.config.userId,
        'Client-Name': this.config.clientName ?? `YukitaSan/${CORE_VERSION}`
      };

      if (this.currentSessionId) {
        headers['Session-Id'] = this.currentSessionId;
      }

      const socket = new WebSocket(url, { headers });
      this.socket = socket;

      socket.once('open', () => {
        this.reconnectAttempts = 0;
        void this.events.emit('connected', { nodeId: this.config.id });
      });

      socket.on('message', (chunk: RawData) => {
        void this.handleMessage(chunk.toString());
      });

      socket.on('close', (code: number, reason: Buffer) => {
        const reasonText = reason.toString('utf8');
        void this.events.emit('disconnected', {
          nodeId: this.config.id,
          code,
          reason: reasonText
        });
        this.failReadyWaiters(
          new YukitaError({
            code: YukitaErrorCode.NODE_DISCONNECTED,
            message: 'Lavalink websocket disconnected before ready',
            meta: { nodeId: this.config.id, code, reason: reasonText }
          })
        );
        if (!this.manualDisconnect && !this.destroyed) {
          this.scheduleReconnect();
        }
      });

      socket.on('error', (error: Error) => {
        void this.events.emit('error', { nodeId: this.config.id, error });
      });

      return ok(undefined);
    } catch (error) {
      return err(
        new YukitaError({
          code: YukitaErrorCode.NODE_WS_FAILED,
          message: 'Failed to open lavalink websocket',
          cause: error,
          meta: { nodeId: this.config.id }
        })
      );
    }
  }

  private async handleMessage(message: string): Promise<void> {
    let parsed: LavalinkWsMessage;
    try {
      parsed = JSON.parse(message) as LavalinkWsMessage;
    } catch (error) {
      await this.events.emit('error', {
        nodeId: this.config.id,
        error: new YukitaError({
          code: YukitaErrorCode.NODE_WS_FAILED,
          message: 'Received invalid JSON from lavalink websocket',
          cause: error
        })
      });
      return;
    }

    await this.events.emit('raw', { nodeId: this.config.id, payload: parsed });
    switch (parsed.op) {
      case 'ready': {
        this.currentSessionId = parsed.sessionId;
        await this.events.emit('ready', { nodeId: this.config.id, payload: parsed });
        this.resolveReadyWaiters(ok(parsed));
        break;
      }
      case 'stats':
        await this.events.emit('stats', { nodeId: this.config.id, payload: parsed });
        break;
      case 'playerUpdate':
        await this.events.emit('playerUpdate', { nodeId: this.config.id, payload: parsed });
        break;
      case 'event':
        await this.events.emit('playerEvent', { nodeId: this.config.id, payload: parsed });
        break;
      default:
        await this.events.emit('error', {
          nodeId: this.config.id,
          error: new YukitaError({
            code: YukitaErrorCode.NODE_WS_FAILED,
            message: 'Unknown websocket operation received',
            meta: { payload: parsed }
          })
        });
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer || this.destroyed || this.manualDisconnect) {
      return;
    }

    if (this.reconnectAttempts >= this.retryPolicy.maxRetries) {
      void this.events.emit('error', {
        nodeId: this.config.id,
        error: new YukitaError({
          code: YukitaErrorCode.NODE_CONNECT_FAILED,
          message: 'Reconnect attempts exhausted',
          meta: { nodeId: this.config.id, attempts: this.reconnectAttempts }
        })
      });
      return;
    }

    const delay = buildBackoffDelay(this.reconnectAttempts, this.retryPolicy);
    this.reconnectAttempts += 1;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      void this.openSocket();
    }, delay);
  }

  private resolveReadyWaiters(result: Result<LavalinkReadyPayload>): void {
    while (this.readyWaiters.length) {
      const waiter = this.readyWaiters.shift();
      waiter?.(result);
    }
  }

  private failReadyWaiters(error: YukitaError): void {
    this.resolveReadyWaiters(err(error));
  }
}
