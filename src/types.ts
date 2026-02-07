import type {
  PluginLogger,
  YukitaPlugin,
} from './plugins/types';
import type { YukitaResolveModel, YukitaTrackModel } from './shared';
import type {
  LavalinkFilters,
  LavalinkNodeConfig,
  LavalinkNodeStats,
  LavalinkPlayerEvent,
  LavalinkPlayerUpdatePayload
} from './lavalink/types';
import type { LavalinkNode } from './lavalink/LavalinkNode';
import type { Connector } from './connectors/Connector';

/**
 * Node selection strategy.
 */
export type NodeSelectionStrategy =
  | 'penalty'
  | 'least-load'
  | 'latency'
  | 'round-robin'
  | ((
      nodes: readonly LavalinkNode[],
      request: NodeSelectionRequest
    ) => LavalinkNode | null | undefined);

/**
 * Repeat mode for queue behavior.
 */
export type RepeatMode = 'none' | 'track' | 'queue';

/**
 * Client-level options.
 */
export interface YukitaSanOptions {
  nodes: LavalinkNodeConfig[];
  selectionStrategy?: NodeSelectionStrategy;
  logger?: Partial<PluginLogger>;
  connector?: Connector;
}

/**
 * @deprecated Use `YukitaSanOptions`.
 */
export type YukitaClientOptions = YukitaSanOptions;

/**
 * Resolve operation options.
 */
export interface ResolveOptions {
  preferredNodeId?: string;
  sourceHints?: string[];
  metadata?: Record<string, unknown>;
}

/**
 * Resolve output envelope from core.
 */
export interface ResolveOutput {
  nodeId: string;
  result: YukitaResolveModel;
}

/**
 * Player create options.
 */
export interface CreatePlayerOptions {
  nodeId?: string;
  shardId: number;
  guildId: string;
  initialChannelId?: string;
}

/**
 * Voice state update from connectors.
 */
export interface VoiceStateUpdate {
  contextId: string;
  guildId: string;
  channelId: string | null;
  sessionId: string;
  shardId: number;
  selfMute?: boolean;
  selfDeaf?: boolean;
}

/**
 * Voice server update from connectors.
 */
export interface VoiceServerUpdate {
  contextId: string;
  guildId: string;
  token: string;
  endpoint: string;
}

/**
 * Internal voice connection state.
 */
export interface PlayerVoiceState {
  contextId: string;
  guildId: string;
  channelId: string | null;
  sessionId: string | null;
  token: string | null;
  endpoint: string | null;
  shardId: number;
  connected: boolean;
}

/**
 * Queue change reason values.
 */
export type QueueUpdateReason =
  | 'add'
  | 'remove'
  | 'move'
  | 'clear'
  | 'shuffle'
  | 'advance'
  | 'repeat-mode';

/**
 * Player snapshot returned by state methods and events.
 */
export interface PlayerSnapshot {
  contextId: string;
  guildId: string;
  nodeId: string;
  current: YukitaTrackModel | null;
  queue: YukitaTrackModel[];
  paused: boolean;
  volume: number;
  positionMs: number;
  repeatMode: RepeatMode;
  filters: LavalinkFilters;
  voice: PlayerVoiceState;
}

/**
 * Public core event map.
 */
export interface YukitaSanEvents {
  'node.connected': { nodeId: string; resumed: boolean };
  'node.disconnected': { nodeId: string; code: number; reason: string };
  'node.error': { nodeId: string; error: Error };
  'node.stats': { nodeId: string; stats: LavalinkNodeStats };
  'player.created': { contextId: string; snapshot: PlayerSnapshot };
  'player.destroyed': { contextId: string; snapshot: PlayerSnapshot };
  'player.state': { contextId: string; snapshot: PlayerSnapshot; reason: string };
  'track.started': { contextId: string; track: YukitaTrackModel; nodeId: string };
  'track.ended': { contextId: string; track: YukitaTrackModel; reason: string; nodeId: string };
  'track.stuck': { contextId: string; payload: LavalinkPlayerEvent; nodeId: string };
  'track.exception': { contextId: string; payload: LavalinkPlayerEvent; nodeId: string };
  'queue.updated': { contextId: string; queue: YukitaTrackModel[]; reason: QueueUpdateReason };
  'resolve.completed': { contextId: string; query: string; output: ResolveOutput };
  'resolve.failed': { contextId: string; query: string; error: Error };
}

/**
 * @deprecated Use `YukitaSanEvents`.
 */
export type YukitaCoreEvents = YukitaSanEvents;

/**
 * Plugin list initialization options.
 */
export interface PluginBootOptions {
  plugins?: YukitaPlugin[];
}

/**
 * Commands accepted by `YukitaSan.play`.
 */
export interface PlayInput {
  query?: string;
  track?: YukitaTrackModel;
  metadata?: Record<string, unknown>;
  sourceHints?: string[];
  preferredNodeId?: string;
}

/**
 * Namespace map for plugin API extensions.
 */
export type ExtensionsMap = Map<string, object>;

/**
 * Structured node selection request.
 */
export interface NodeSelectionRequest {
  preferredNodeId?: string;
  strategy?: NodeSelectionStrategy;
  excludeNodeIds?: string[];
}

/**
 * Playback state propagated from lavalink updates.
 */
export interface PlaybackTelemetry {
  positionMs: number;
  pingMs: number;
  connected: boolean;
  raw: LavalinkPlayerUpdatePayload;
}
