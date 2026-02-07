export { YukitaSan } from './YukitaSan';
export { CORE_COMPATIBLE_RANGE, CORE_VERSION } from './version';

export { AsyncEventBus, YukitaError, YukitaErrorCode, err, ok, toYukitaError } from './shared';
export type { Result, YukitaPlaylistModel, YukitaResolveModel, YukitaTrackModel } from './shared';

export { NodePool } from './lavalink/NodePool';
export { LavalinkNode } from './lavalink/LavalinkNode';
export type { LavalinkNodeEvents, LavalinkNodeState } from './lavalink/LavalinkNode';
export { LavalinkRestClient } from './lavalink/LavalinkRestClient';
export { LavalinkWsClient } from './lavalink/LavalinkWsClient';
export { mapLoadResult } from './lavalink/codec';
export type {
  LavalinkCpuStats,
  LavalinkFilters,
  LavalinkFrameStats,
  LavalinkLoadException,
  LavalinkLoadResult,
  LavalinkMemoryStats,
  LavalinkNodeConfig,
  LavalinkNodeStats,
  LavalinkPlayer,
  LavalinkPlayerState,
  LavalinkPlayerEvent,
  LavalinkPlayerUpdatePayload,
  LavalinkPlaylist,
  LavalinkReadyPayload,
  LavalinkRestErrorPayload,
  LavalinkRoutePlannerStatus,
  LavalinkSession,
  LavalinkTrack,
  LavalinkTrackInfo,
  LavalinkUpdatePlayer,
  LavalinkVoiceState,
  LavalinkWsMessage,
  ProtocolTrackModel,
  ResolverEnvelope,
  RetryPolicy
} from './lavalink/types';
export type {
  LavalinkResponse,
  LavalinkResponseError,
  LavalinkResponseMeta,
  RestRequestContext,
  RestResponseContext
} from './lavalink/responses';

export { YukitaPlayer } from './lavalink/Player';
export { PlayerQueue } from './lavalink/PlayerQueue';

export type {
  CreatePlayerOptions,
  ExtensionsMap,
  NodeSelectionRequest,
  NodeSelectionStrategy,
  PlaybackTelemetry,
  PlayerSnapshot,
  PlayerVoiceState,
  PlayInput,
  PluginBootOptions,
  QueueUpdateReason,
  RepeatMode,
  ResolveOptions,
  ResolveOutput,
  VoiceServerUpdate,
  VoiceStateUpdate,
  YukitaClientOptions,
  YukitaCoreEvents
} from './types';

export { DiscordVoiceConnector, DiscordVoiceMapper } from './connectors';
export { DiscordJSConnector } from './connectors';
export type { Connector } from './connectors';
export type {
  DiscordConnectorOptions,
  DiscordGatewaySender,
  DiscordVoiceServerUpdate,
  DiscordVoiceStateCommand,
  DiscordVoiceStateUpdate
} from './connectors';

export type { BeforePlayPayload, BeforeResolvePayload, PluginHooks, PluginInitContext, PluginLogger, YukitaPlugin } from './plugins/types';
export { definePlugin } from './plugins/definePlugin';
export { MetricsPlugin, createMetricsPlugin } from './plugins/metrics';
export { ResolveCachePlugin, createResolveCachePlugin } from './plugins/resolve-cache';
export { WebsocketGatewayPlugin, createWebsocketGatewayPlugin } from './plugins/websocket-gateway';

export { YukitaGatewayServer, createGatewayHmacToken } from './gateway';
export type {
  GatewayAuthMode,
  GatewayAuthOptions,
  GatewayClaims,
  GatewayCommandHandler,
  GatewayCommandRegistration,
  GatewayCommandMap,
  GatewayEnvelope,
  GatewayOutboundTransform,
  GatewayOp,
  GatewayRateLimitOptions,
  GatewayRole,
  GatewayServerOptions,
  GatewaySessionInfo
} from './gateway';
