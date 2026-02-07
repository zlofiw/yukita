import type { YukitaResolveModel, YukitaTrackModel } from '../shared';

/**
 * Retry policy for REST/WS operations.
 */
export interface RetryPolicy {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  jitterRatio: number;
}

/**
 * Lavalink node connection config.
 */
export interface LavalinkNodeConfig {
  id: string;
  host: string;
  port: number;
  secure?: boolean;
  password: string;
  userId: string;
  clientName?: string;
  restVersion?: number;
  wsVersion?: number;
  requestTimeoutMs?: number;
  /**
   * REST max in-flight requests (rate-limit friendly).
   * Defaults to `4`.
   */
  restConcurrency?: number;
  readyTimeoutMs?: number;
  healthCheckIntervalMs?: number;
  /**
   * Enables REST session resume configuration after websocket ready.
   * Defaults to `true`.
   */
  resumeSession?: boolean;
  /**
   * Lavalink resume timeout in milliseconds for `updateSession`.
   * Defaults to `60_000`.
   */
  resumeTimeoutMs?: number;
  retryPolicy?: Partial<RetryPolicy>;
  group?: string;
}

/**
 * Lavalink track info from REST responses.
 */
export interface LavalinkTrackInfo {
  identifier: string;
  isSeekable: boolean;
  author: string;
  length: number;
  isStream: boolean;
  position: number;
  title: string;
  uri?: string;
  artworkUrl?: string;
  isrc?: string;
  sourceName: string;
}

/**
 * Lavalink track model.
 */
export interface LavalinkTrack {
  encoded: string;
  info: LavalinkTrackInfo;
  pluginInfo?: unknown;
  userData?: unknown;
}

/**
 * Lavalink playlist model.
 */
export interface LavalinkPlaylist {
  encoded: string;
  info: {
    name: string;
    selectedTrack: number;
  };
  pluginInfo?: unknown;
  tracks: LavalinkTrack[];
}

/**
 * Lavalink load failure payload.
 */
export interface LavalinkLoadException {
  message: string;
  severity: 'common' | 'suspicious' | 'fault';
  cause: string;
}

/**
 * Lavalink load result union.
 */
export type LavalinkLoadResult =
  | {
      loadType: 'track';
      data: LavalinkTrack;
    }
  | {
      loadType: 'playlist';
      data: LavalinkPlaylist;
    }
  | {
      loadType: 'search';
      data: LavalinkTrack[];
    }
  | {
      loadType: 'empty';
      data: Record<string, never>;
    }
  | {
      loadType: 'error';
      data: LavalinkLoadException;
    };

/**
 * Lavalink memory stats.
 */
export interface LavalinkMemoryStats {
  reservable: number;
  used: number;
  free: number;
  allocated: number;
}

/**
 * Lavalink frame stats.
 */
export interface LavalinkFrameStats {
  sent: number;
  deficit: number;
  nulled: number;
}

/**
 * Lavalink cpu stats.
 */
export interface LavalinkCpuStats {
  cores: number;
  systemLoad: number;
  lavalinkLoad: number;
}

/**
 * Lavalink node stats payload.
 */
export interface LavalinkNodeStats {
  op: 'stats';
  players: number;
  playingPlayers: number;
  memory: LavalinkMemoryStats;
  frameStats: LavalinkFrameStats | null;
  cpu: LavalinkCpuStats;
  uptime: number;
}

/**
 * Lavalink ready payload.
 */
export interface LavalinkReadyPayload {
  op: 'ready';
  resumed: boolean;
  sessionId: string;
}

/**
 * Lavalink player update payload.
 */
export interface LavalinkPlayerUpdatePayload {
  op: 'playerUpdate';
  guildId: string;
  state: {
    connected: boolean;
    position: number;
    time: number;
    ping: number;
  };
}

/**
 * Lavalink track started event payload.
 */
export interface LavalinkTrackStartEvent {
  op: 'event';
  type: 'TrackStartEvent';
  guildId: string;
  track: LavalinkTrack;
}

/**
 * Lavalink track ended event payload.
 */
export interface LavalinkTrackEndEvent {
  op: 'event';
  type: 'TrackEndEvent';
  guildId: string;
  track: LavalinkTrack;
  reason: 'finished' | 'loadFailed' | 'stopped' | 'replaced' | 'cleanup';
}

/**
 * Lavalink track exception event payload.
 */
export interface LavalinkTrackExceptionEvent {
  op: 'event';
  type: 'TrackExceptionEvent';
  guildId: string;
  track: LavalinkTrack;
  exception: {
    message: string;
    severity: 'common' | 'suspicious' | 'fault';
    cause: string;
  };
}

/**
 * Lavalink track stuck event payload.
 */
export interface LavalinkTrackStuckEvent {
  op: 'event';
  type: 'TrackStuckEvent';
  guildId: string;
  track: LavalinkTrack;
  thresholdMs: number;
}

/**
 * Lavalink websocket closed event payload.
 */
export interface LavalinkWebSocketClosedEvent {
  op: 'event';
  type: 'WebSocketClosedEvent';
  guildId: string;
  code: number;
  byRemote: boolean;
  reason: string;
}

/**
 * Lavalink event union.
 */
export type LavalinkPlayerEvent =
  | LavalinkTrackStartEvent
  | LavalinkTrackEndEvent
  | LavalinkTrackExceptionEvent
  | LavalinkTrackStuckEvent
  | LavalinkWebSocketClosedEvent;

/**
 * Lavalink ws message union.
 */
export type LavalinkWsMessage =
  | LavalinkReadyPayload
  | LavalinkNodeStats
  | LavalinkPlayerUpdatePayload
  | LavalinkPlayerEvent;

/**
 * Voice state payload used in player updates.
 */
export interface LavalinkVoiceState {
  token: string;
  endpoint: string;
  sessionId: string;
}

/**
 * Supported lavalink filter payload.
 */
export interface LavalinkFilters {
  volume?: number;
  equalizer?: Array<{ band: number; gain: number }>;
  karaoke?: Record<string, number | undefined> | null;
  timescale?: Record<string, number | undefined> | null;
  tremolo?: Record<string, number | undefined> | null;
  vibrato?: Record<string, number | undefined> | null;
  rotation?: Record<string, number | undefined> | null;
  distortion?: Record<string, number | undefined> | null;
  channelMix?: Record<string, number | undefined> | null;
  lowPass?: Record<string, number | undefined> | null;
}

/**
 * Lavalink player update body.
 */
export interface LavalinkUpdatePlayer {
  track?: {
    encoded?: string | null;
    identifier?: string;
    userData?: unknown;
  };
  position?: number;
  endTime?: number;
  volume?: number;
  paused?: boolean;
  filters?: LavalinkFilters;
  voice?: LavalinkVoiceState;
}

/**
 * Lavalink REST session model.
 */
export interface LavalinkSession {
  resuming: boolean;
  /**
   * Timeout in seconds.
   */
  timeout: number;
}

/**
 * Lavalink REST player state model.
 */
export interface LavalinkPlayerState {
  time: number;
  position: number;
  connected: boolean;
  ping: number;
}

/**
 * Lavalink REST player model.
 */
export interface LavalinkPlayer {
  guildId: string;
  track: LavalinkTrack | null;
  volume: number;
  paused: boolean;
  state: LavalinkPlayerState;
  voice: LavalinkVoiceState;
  filters: Record<string, unknown>;
}

/**
 * RoutePlanner status response from REST API.
 */
export interface LavalinkRoutePlannerStatus {
  class: string | null;
  details: Record<string, unknown> | null;
}

/**
 * REST error response shape from Lavalink.
 */
export interface LavalinkRestErrorPayload {
  timestamp: number;
  status: number;
  error: string;
  trace?: string;
  message: string;
  path: string;
}

/**
 * Normalized resolve envelope returned by protocol package.
 */
export interface ResolverEnvelope {
  result: YukitaResolveModel;
  raw: LavalinkLoadResult;
}

/**
 * Track model with raw lavalink payload attached.
 */
export interface ProtocolTrackModel extends YukitaTrackModel {
  raw: LavalinkTrack;
}
