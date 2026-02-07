import {
  YukitaError,
  YukitaErrorCode,
  err,
  ok,
  type Result,
  type YukitaTrackModel
} from '../shared';
import type { BeforePlayPayload } from '../plugins/types';
import type { LavalinkFilters, LavalinkPlayerEvent, LavalinkPlayerUpdatePayload } from './types';
import { PlayerQueue } from './PlayerQueue';
import type { PlaybackTelemetry, PlayerSnapshot, PlayerVoiceState, RepeatMode } from '../types';
import type { YukitaSan } from '../YukitaSan';

/**
 * Playback operation options.
 */
export interface PlayTrackOptions {
  noReplace?: boolean;
  startPositionMs?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Playback unit scoped to single `contextId`.
 */
export class YukitaPlayer {
  public readonly contextId: string;
  public readonly guildId: string;
  public readonly queue = new PlayerQueue();
  public readonly voice: PlayerVoiceState;

  private readonly client: YukitaSan;
  private nodeId: string;
  private currentTrack: YukitaTrackModel | null = null;
  private paused = false;
  private volume = 100;
  private positionMs = 0;
  private pingMs = -1;
  private filters: LavalinkFilters = {};
  private destroyed = false;

  public constructor(input: {
    client: YukitaSan;
    contextId: string;
    guildId: string;
    shardId: number;
    nodeId: string;
    initialChannelId?: string;
  }) {
    this.client = input.client;
    this.contextId = input.contextId;
    this.guildId = input.guildId;
    this.nodeId = input.nodeId;
    this.voice = {
      contextId: input.contextId,
      guildId: input.guildId,
      channelId: input.initialChannelId ?? null,
      sessionId: null,
      token: null,
      endpoint: null,
      shardId: input.shardId,
      connected: false
    };
  }

  /**
   * Returns immutable snapshot of player state.
   */
  public snapshot(): PlayerSnapshot {
    return {
      contextId: this.contextId,
      guildId: this.guildId,
      nodeId: this.nodeId,
      current: this.currentTrack,
      queue: [...this.queue.value],
      paused: this.paused,
      volume: this.volume,
      positionMs: this.positionMs,
      repeatMode: this.queue.repeat,
      filters: { ...this.filters },
      voice: { ...this.voice }
    };
  }

  /**
   * Current node id of this player.
   */
  public get currentNodeId(): string {
    return this.nodeId;
  }

  /**
   * Requests Discord voice join/move via connector (Opcode 4).
   */
  public async connect(channelId: string, options: { selfMute?: boolean; selfDeaf?: boolean } = {}): Promise<Result<void>> {
    if (!this.client.connector) {
      return err(
        new YukitaError({
          code: YukitaErrorCode.INVALID_ARGUMENT,
          message: 'No connector configured on client',
          meta: { contextId: this.contextId, guildId: this.guildId }
        })
      );
    }

    const payload = {
      op: 4,
      d: {
        guild_id: this.guildId,
        channel_id: channelId,
        self_mute: options.selfMute ?? false,
        self_deaf: options.selfDeaf ?? true
      }
    };

    try {
      await this.client.connector.sendPacket(this.guildId, payload);
      return ok(undefined);
    } catch (error) {
      return err(
        new YukitaError({
          code: YukitaErrorCode.INTERNAL_ERROR,
          message: 'Failed to send voice state update packet',
          meta: { contextId: this.contextId, guildId: this.guildId },
          cause: error
        })
      );
    }
  }

  /**
   * Requests Discord voice leave via connector (Opcode 4).
   */
  public async disconnect(options: { selfMute?: boolean; selfDeaf?: boolean } = {}): Promise<Result<void>> {
    if (!this.client.connector) {
      return err(
        new YukitaError({
          code: YukitaErrorCode.INVALID_ARGUMENT,
          message: 'No connector configured on client',
          meta: { contextId: this.contextId, guildId: this.guildId }
        })
      );
    }

    const payload = {
      op: 4,
      d: {
        guild_id: this.guildId,
        channel_id: null,
        self_mute: options.selfMute ?? false,
        self_deaf: options.selfDeaf ?? false
      }
    };

    try {
      await this.client.connector.sendPacket(this.guildId, payload);
      return ok(undefined);
    } catch (error) {
      return err(
        new YukitaError({
          code: YukitaErrorCode.INTERNAL_ERROR,
          message: 'Failed to send voice state update packet',
          meta: { contextId: this.contextId, guildId: this.guildId },
          cause: error
        })
      );
    }
  }

  /**
   * Updates player voice state from connector.
   */
  public async applyVoiceState(input: {
    channelId: string | null;
    sessionId: string;
    shardId: number;
  }): Promise<Result<void>> {
    this.voice.channelId = input.channelId;
    this.voice.sessionId = input.sessionId;
    this.voice.shardId = input.shardId;
    this.voice.connected = Boolean(input.channelId);

    const syncResult = await this.syncVoiceState();
    if (!syncResult.ok) {
      return syncResult;
    }

    await this.client.emitOrdered(this.contextId, 'player.state', {
      contextId: this.contextId,
      snapshot: this.snapshot(),
      reason: 'voice-state'
    });
    return ok(undefined);
  }

  /**
   * Updates player voice server payload from connector.
   */
  public async applyVoiceServer(input: { token: string; endpoint: string }): Promise<Result<void>> {
    this.voice.token = input.token;
    this.voice.endpoint = input.endpoint;
    const syncResult = await this.syncVoiceState();
    if (!syncResult.ok) {
      return syncResult;
    }
    return ok(undefined);
  }

  /**
   * Adds tracks to queue.
   */
  public async addToQueue(track: YukitaTrackModel | YukitaTrackModel[]): Promise<Result<number>> {
    const result = this.queue.add(track);
    if (!result.ok) {
      return result;
    }
    await this.client.emitOrdered(this.contextId, 'queue.updated', {
      contextId: this.contextId,
      queue: [...this.queue.value],
      reason: 'add'
    });
    return result;
  }

  /**
   * Removes track from queue by index.
   */
  public async removeFromQueue(index: number): Promise<Result<YukitaTrackModel>> {
    const result = this.queue.remove(index);
    if (!result.ok) {
      return result;
    }
    await this.client.emitOrdered(this.contextId, 'queue.updated', {
      contextId: this.contextId,
      queue: [...this.queue.value],
      reason: 'remove'
    });
    return result;
  }

  /**
   * Moves queue item.
   */
  public async moveQueue(fromIndex: number, toIndex: number): Promise<Result<void>> {
    const result = this.queue.move(fromIndex, toIndex);
    if (!result.ok) {
      return result;
    }
    await this.client.emitOrdered(this.contextId, 'queue.updated', {
      contextId: this.contextId,
      queue: [...this.queue.value],
      reason: 'move'
    });
    return ok(undefined);
  }

  /**
   * Clears queue.
   */
  public async clearQueue(): Promise<Result<void>> {
    this.queue.clear();
    await this.client.emitOrdered(this.contextId, 'queue.updated', {
      contextId: this.contextId,
      queue: [...this.queue.value],
      reason: 'clear'
    });
    return ok(undefined);
  }

  /**
   * Shuffles queue.
   */
  public async shuffleQueue(): Promise<Result<void>> {
    this.queue.shuffle();
    await this.client.emitOrdered(this.contextId, 'queue.updated', {
      contextId: this.contextId,
      queue: [...this.queue.value],
      reason: 'shuffle'
    });
    return ok(undefined);
  }

  /**
   * Sets repeat mode.
   */
  public async setRepeatMode(mode: RepeatMode): Promise<Result<void>> {
    this.queue.setRepeat(mode);
    await this.client.emitOrdered(this.contextId, 'queue.updated', {
      contextId: this.contextId,
      queue: [...this.queue.value],
      reason: 'repeat-mode'
    });
    return ok(undefined);
  }

  /**
   * Plays explicit track.
   */
  public async playTrack(track: YukitaTrackModel, options: PlayTrackOptions = {}): Promise<Result<void>> {
    if (this.destroyed) {
      return err(
        new YukitaError({
          code: YukitaErrorCode.PLAYER_OPERATION_FAILED,
          message: 'Cannot use destroyed player',
          meta: { contextId: this.contextId }
        })
      );
    }

    const beforePlayPayload: BeforePlayPayload = {
      contextId: this.contextId,
      track
    };
    if (typeof options.metadata !== 'undefined') {
      beforePlayPayload.metadata = options.metadata;
    }

    const hookResult = await this.client.runBeforePlay(beforePlayPayload);
    if (!hookResult.ok) {
      return hookResult;
    }

    const operation = await this.updateRemote(
      {
        track: {
          encoded: hookResult.value.track.encoded
        },
        position: options.startPositionMs ?? 0,
        paused: false
      },
      options.noReplace ?? false
    );
    if (!operation.ok) {
      return operation;
    }

    this.currentTrack = hookResult.value.track;
    this.paused = false;
    this.positionMs = options.startPositionMs ?? 0;
    await this.client.emitOrdered(this.contextId, 'player.state', {
      contextId: this.contextId,
      snapshot: this.snapshot(),
      reason: 'play'
    });
    const afterPlayPayload: BeforePlayPayload = {
      contextId: this.contextId,
      track: hookResult.value.track
    };
    if (typeof options.metadata !== 'undefined') {
      afterPlayPayload.metadata = options.metadata;
    }
    await this.client.runAfterPlay(afterPlayPayload);
    return ok(undefined);
  }

  /**
   * Plays next queue item according to repeat mode.
   */
  public async playNext(): Promise<Result<YukitaTrackModel | null>> {
    const next = this.queue.next(this.currentTrack);
    await this.client.emitOrdered(this.contextId, 'queue.updated', {
      contextId: this.contextId,
      queue: [...this.queue.value],
      reason: 'advance'
    });

    if (!next) {
      this.currentTrack = null;
      await this.stop();
      return ok(null);
    }

    const playResult = await this.playTrack(next, { noReplace: false });
    if (!playResult.ok) {
      return playResult;
    }
    return ok(next);
  }

  /**
   * Pauses playback.
   */
  public async pause(): Promise<Result<void>> {
    const result = await this.updateRemote({ paused: true });
    if (!result.ok) {
      return result;
    }
    this.paused = true;
    await this.client.emitOrdered(this.contextId, 'player.state', {
      contextId: this.contextId,
      snapshot: this.snapshot(),
      reason: 'pause'
    });
    return ok(undefined);
  }

  /**
   * Resumes playback.
   */
  public async resume(): Promise<Result<void>> {
    const result = await this.updateRemote({ paused: false });
    if (!result.ok) {
      return result;
    }
    this.paused = false;
    await this.client.emitOrdered(this.contextId, 'player.state', {
      contextId: this.contextId,
      snapshot: this.snapshot(),
      reason: 'resume'
    });
    return ok(undefined);
  }

  /**
   * Stops playback.
   */
  public async stop(): Promise<Result<void>> {
    const result = await this.updateRemote({
      track: {
        encoded: null
      }
    });
    if (!result.ok) {
      return result;
    }
    this.currentTrack = null;
    this.positionMs = 0;
    this.paused = false;
    await this.client.emitOrdered(this.contextId, 'player.state', {
      contextId: this.contextId,
      snapshot: this.snapshot(),
      reason: 'stop'
    });
    return ok(undefined);
  }

  /**
   * Seeks current track.
   */
  public async seek(positionMs: number): Promise<Result<void>> {
    const result = await this.updateRemote({ position: positionMs });
    if (!result.ok) {
      return result;
    }
    this.positionMs = positionMs;
    await this.client.emitOrdered(this.contextId, 'player.state', {
      contextId: this.contextId,
      snapshot: this.snapshot(),
      reason: 'seek'
    });
    return ok(undefined);
  }

  /**
   * Sets output volume.
   */
  public async setVolume(volume: number): Promise<Result<void>> {
    const result = await this.updateRemote({ volume });
    if (!result.ok) {
      return result;
    }
    this.volume = volume;
    await this.client.emitOrdered(this.contextId, 'player.state', {
      contextId: this.contextId,
      snapshot: this.snapshot(),
      reason: 'volume'
    });
    return ok(undefined);
  }

  /**
   * Applies filter payload.
   */
  public async applyFilters(filters: LavalinkFilters): Promise<Result<void>> {
    const result = await this.updateRemote({ filters });
    if (!result.ok) {
      return result;
    }
    this.filters = { ...this.filters, ...filters };
    await this.client.emitOrdered(this.contextId, 'player.state', {
      contextId: this.contextId,
      snapshot: this.snapshot(),
      reason: 'filters'
    });
    return ok(undefined);
  }

  /**
   * Clears active filters.
   */
  public async clearFilters(): Promise<Result<void>> {
    const result = await this.updateRemote({ filters: {} });
    if (!result.ok) {
      return result;
    }
    this.filters = {};
    await this.client.emitOrdered(this.contextId, 'player.state', {
      contextId: this.contextId,
      snapshot: this.snapshot(),
      reason: 'filters-clear'
    });
    return ok(undefined);
  }

  /**
   * Handles player telemetry from node events.
   */
  public async onPlayerUpdate(payload: LavalinkPlayerUpdatePayload): Promise<Result<PlaybackTelemetry>> {
    this.positionMs = payload.state.position;
    this.pingMs = payload.state.ping;
    const telemetry: PlaybackTelemetry = {
      positionMs: this.positionMs,
      pingMs: this.pingMs,
      connected: payload.state.connected,
      raw: payload
    };

    await this.client.emitOrdered(this.contextId, 'player.state', {
      contextId: this.contextId,
      snapshot: this.snapshot(),
      reason: 'telemetry'
    });
    return ok(telemetry);
  }

  /**
   * Handles track-related lavalink events.
   */
  public async onPlayerEvent(payload: LavalinkPlayerEvent): Promise<Result<void>> {
    switch (payload.type) {
      case 'TrackStartEvent': {
        const track = this.mapTrack(payload.track);
        this.currentTrack = track;
        await this.client.emitOrdered(this.contextId, 'track.started', {
          contextId: this.contextId,
          track,
          nodeId: this.nodeId
        });
        break;
      }
      case 'TrackEndEvent': {
        const track = this.currentTrack ?? this.mapTrack(payload.track);
        await this.client.emitOrdered(this.contextId, 'track.ended', {
          contextId: this.contextId,
          track,
          reason: payload.reason,
          nodeId: this.nodeId
        });

        if (payload.reason !== 'replaced') {
          const nextResult = await this.playNext();
          if (!nextResult.ok) {
            return nextResult;
          }
        }
        break;
      }
      case 'TrackStuckEvent':
        await this.client.emitOrdered(this.contextId, 'track.stuck', {
          contextId: this.contextId,
          payload,
          nodeId: this.nodeId
        });
        break;
      case 'TrackExceptionEvent':
        await this.client.emitOrdered(this.contextId, 'track.exception', {
          contextId: this.contextId,
          payload,
          nodeId: this.nodeId
        });
        break;
      case 'WebSocketClosedEvent':
        await this.client.emitOrdered(this.contextId, 'player.state', {
          contextId: this.contextId,
          snapshot: this.snapshot(),
          reason: `ws-closed:${payload.code}`
        });
        break;
      default:
        break;
    }

    return ok(undefined);
  }

  /**
   * Moves player state to another node after failover.
   */
  public async migrateToNode(targetNodeId: string): Promise<Result<void>> {
    if (targetNodeId === this.nodeId) {
      return ok(undefined);
    }

    const previousNodeId = this.nodeId;
    this.nodeId = targetNodeId;
    const voiceResult = await this.syncVoiceState();
    if (!voiceResult.ok) {
      this.nodeId = previousNodeId;
      return voiceResult;
    }

    if (this.currentTrack) {
      const replayResult = await this.updateRemote({
        track: {
          encoded: this.currentTrack.encoded
        },
        position: this.positionMs,
        paused: this.paused,
        volume: this.volume,
        filters: this.filters
      });
      if (!replayResult.ok) {
        this.nodeId = previousNodeId;
        return replayResult;
      }
    }

    await this.client.emitOrdered(this.contextId, 'player.state', {
      contextId: this.contextId,
      snapshot: this.snapshot(),
      reason: 'failover'
    });

    return ok(undefined);
  }

  /**
   * Re-sends current voice/track state to the current node (used after resume=false reconnects).
   */
  public async resync(): Promise<Result<void>> {
    const voiceResult = await this.syncVoiceState();
    if (!voiceResult.ok) {
      return voiceResult;
    }

    if (this.currentTrack) {
      const replayResult = await this.updateRemote({
        track: {
          encoded: this.currentTrack.encoded
        },
        position: this.positionMs,
        paused: this.paused,
        volume: this.volume,
        filters: this.filters
      });
      if (!replayResult.ok) {
        return replayResult;
      }
    }

    await this.client.emitOrdered(this.contextId, 'player.state', {
      contextId: this.contextId,
      snapshot: this.snapshot(),
      reason: 'resync'
    });

    return ok(undefined);
  }

  /**
   * Destroys player on remote node and releases resources.
   */
  public async destroy(): Promise<Result<void>> {
    if (this.destroyed) {
      return ok(undefined);
    }

    const node = this.client.nodePool.getNode(this.nodeId);
    if (node?.sessionId) {
      const destroyResult = await node.rest.destroyPlayer({
        sessionId: node.sessionId,
        guildId: this.guildId
      });
      if (!destroyResult.ok) {
        const status = destroyResult.error.details?.status;
        const isAlreadyAbsent = status === 400 || status === 404;
        if (!isAlreadyAbsent) {
          return err(
            new YukitaError({
              code: YukitaErrorCode.NODE_REST_FAILED,
              message: destroyResult.error.message,
              meta: {
                ...(destroyResult.error.details ?? {}),
                requestId: destroyResult.meta.requestId,
                endpoint: destroyResult.meta.endpoint,
                contextId: this.contextId,
                nodeId: this.nodeId
              },
              cause: destroyResult.error.cause
            })
          );
        }
      }
    }

    this.destroyed = true;
    this.queue.clear();
    return ok(undefined);
  }

  private async syncVoiceState(): Promise<Result<void>> {
    if (!this.voice.sessionId || !this.voice.token || !this.voice.endpoint) {
      return ok(undefined);
    }

    const update = await this.updateRemote({
      voice: {
        sessionId: this.voice.sessionId,
        token: this.voice.token,
        endpoint: this.voice.endpoint
      }
    });
    if (!update.ok) {
      return update;
    }

    this.voice.connected = true;
    return ok(undefined);
  }

  private async updateRemote(payload: {
    track?: { encoded?: string | null; identifier?: string; userData?: unknown };
    position?: number;
    endTime?: number;
    volume?: number;
    paused?: boolean;
    filters?: LavalinkFilters;
    voice?: { token: string; endpoint: string; sessionId: string };
  }, noReplace = false): Promise<Result<void>> {
    const node = this.client.nodePool.getNode(this.nodeId);
    if (!node || node.state !== 'connected' || !node.sessionId) {
      return err(
        new YukitaError({
          code: YukitaErrorCode.NODE_UNAVAILABLE,
          message: 'Player node is not connected',
          meta: { nodeId: this.nodeId, contextId: this.contextId }
        })
      );
    }

    const result = await node.rest.updatePlayer({
      sessionId: node.sessionId,
      guildId: this.guildId,
      payload,
      noReplace
    });
    if (!result.ok) {
      return err(
        new YukitaError({
          code: YukitaErrorCode.PLAYER_UPDATE_FAILED,
          message: result.error.message,
          meta: {
            ...(result.error.details ?? {}),
            requestId: result.meta.requestId,
            endpoint: result.meta.endpoint,
            contextId: this.contextId,
            nodeId: this.nodeId
          },
          cause: result.error.cause
        })
      );
    }
    return ok(undefined);
  }

  private mapTrack(rawTrack: {
    encoded: string;
    info: {
      identifier: string;
      title: string;
      author: string;
      length: number;
      sourceName: string;
      uri?: string;
      artworkUrl?: string;
      isStream: boolean;
      isSeekable: boolean;
      position: number;
    };
    pluginInfo?: unknown;
  }): YukitaTrackModel {
    const track: YukitaTrackModel = {
      encoded: rawTrack.encoded,
      identifier: rawTrack.info.identifier,
      title: rawTrack.info.title,
      author: rawTrack.info.author,
      lengthMs: rawTrack.info.length,
      sourceName: rawTrack.info.sourceName,
      isStream: rawTrack.info.isStream,
      isSeekable: rawTrack.info.isSeekable,
      positionMs: rawTrack.info.position
    };
    if (typeof rawTrack.info.uri !== 'undefined') {
      track.uri = rawTrack.info.uri;
    }
    if (typeof rawTrack.info.artworkUrl !== 'undefined') {
      track.artworkUrl = rawTrack.info.artworkUrl;
    }
    if (typeof rawTrack.pluginInfo !== 'undefined') {
      track.pluginInfo = rawTrack.pluginInfo;
    }
    return track;
  }
}
