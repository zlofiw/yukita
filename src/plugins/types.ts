import type { Result } from '../shared/result';
import type { YukitaResolveModel, YukitaTrackModel } from '../shared/models';
import type { LavalinkResponse, LavalinkResponseError, RestRequestContext, RestResponseContext } from '../lavalink/responses';
import type { YukitaSan } from '../YukitaSan';

export interface PluginLogger {
  debug: (message: string, meta?: Record<string, unknown>) => void;
  info: (message: string, meta?: Record<string, unknown>) => void;
  warn: (message: string, meta?: Record<string, unknown>) => void;
  error: (message: string, meta?: Record<string, unknown>) => void;
}

export interface BeforeResolvePayload {
  contextId: string;
  query: string;
  preferredNodeId?: string;
  sourceHints?: string[];
  metadata?: Record<string, unknown>;
  shortCircuitResult?: YukitaResolveModel;
}

export interface BeforePlayPayload {
  contextId: string;
  track: YukitaTrackModel;
  metadata?: Record<string, unknown>;
}

export interface PluginNodeEvent {
  type: 'connected' | 'disconnected' | 'error' | 'stats';
  nodeId: string;
  payload: unknown;
}

export interface PluginPlayerEvent {
  type: 'created' | 'destroyed' | 'state';
  contextId: string;
  payload: unknown;
}

export interface PluginTrackEvent {
  type: 'started' | 'ended' | 'stuck' | 'exception';
  contextId: string;
  payload: unknown;
}

export interface PluginQueueEvent {
  type: 'updated';
  contextId: string;
  payload: unknown;
}

export interface PluginHooks {
  onInit?: () => void | Promise<void>;
  onShutdown?: () => void | Promise<void>;

  onNodeEvent?: (payload: PluginNodeEvent) => void | Promise<void>;
  onPlayerEvent?: (payload: PluginPlayerEvent) => void | Promise<void>;
  onTrackEvent?: (payload: PluginTrackEvent) => void | Promise<void>;
  onQueueEvent?: (payload: PluginQueueEvent) => void | Promise<void>;

  // High-level resolve/play hooks (not Lavalink-specific, but useful for caching/telemetry).
  beforeResolve?: (
    payload: BeforeResolvePayload
  ) => Promise<BeforeResolvePayload | Result<BeforeResolvePayload> | void> | BeforeResolvePayload | Result<BeforeResolvePayload> | void;
  afterResolve?: (
    request: BeforeResolvePayload,
    result: YukitaResolveModel
  ) => Promise<YukitaResolveModel | Result<YukitaResolveModel> | void> | YukitaResolveModel | Result<YukitaResolveModel> | void;
  beforePlay?: (
    payload: BeforePlayPayload
  ) => Promise<BeforePlayPayload | Result<BeforePlayPayload> | void> | BeforePlayPayload | Result<BeforePlayPayload> | void;
  afterPlay?: (payload: BeforePlayPayload) => Promise<Result<void> | void> | Result<void> | void;

  // REST middleware-style hooks.
  onRestRequest?: (ctx: RestRequestContext) => void | Promise<void>;
  onRestResponse?: <T>(ctx: RestResponseContext<T>, res: LavalinkResponse<T>) => void | Promise<void>;
  onRestError?: (ctx: RestRequestContext, error: LavalinkResponseError) => void | Promise<void>;
}

export interface PluginInitContext {
  coreVersion: string;
  logger: PluginLogger;
  client: YukitaSan;

  registerHooks: (hooks: PluginHooks) => void;

  extendApi: <TApi extends object>(namespace: string, api: TApi) => Result<void>;
}

export interface YukitaPlugin {
  name: string;
  version: string;
  compatibleRange?: string;
  init: (ctx: PluginInitContext) => Promise<void | Result<void>> | void | Result<void>;
}
