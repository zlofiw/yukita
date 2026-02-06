import type { Result } from './result';
import type { YukitaResolveModel, YukitaTrackModel } from './models';

/**
 * Payload for before-resolve hook.
 */
export interface BeforeResolvePayload {
  contextId: string;
  query: string;
  preferredNodeId?: string;
  sourceHints?: string[];
  metadata?: Record<string, unknown>;
  shortCircuitResult?: YukitaResolveModel;
}

/**
 * Payload for before-play hook.
 */
export interface BeforePlayPayload {
  contextId: string;
  track: YukitaTrackModel;
  metadata?: Record<string, unknown>;
}

/**
 * Plugin-facing node event payload.
 */
export interface PluginNodeEvent {
  type: 'connected' | 'disconnected' | 'error' | 'stats';
  nodeId: string;
  payload: unknown;
}

/**
 * Plugin-facing player event payload.
 */
export interface PluginPlayerEvent {
  type: 'created' | 'destroyed' | 'state';
  contextId: string;
  payload: unknown;
}

/**
 * Plugin-facing track event payload.
 */
export interface PluginTrackEvent {
  type: 'started' | 'ended' | 'stuck' | 'exception';
  contextId: string;
  payload: unknown;
}

/**
 * Plugin-facing queue event payload.
 */
export interface PluginQueueEvent {
  type: 'updated';
  contextId: string;
  payload: unknown;
}

/**
 * Hook set that plugins can register through `init(ctx)`.
 */
export interface PluginHooks {
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
  onNodeEvent?: (payload: PluginNodeEvent) => Promise<void> | void;
  onPlayerEvent?: (payload: PluginPlayerEvent) => Promise<void> | void;
  onTrackEvent?: (payload: PluginTrackEvent) => Promise<void> | void;
  onQueueEvent?: (payload: PluginQueueEvent) => Promise<void> | void;
}

/**
 * Minimal logger contract exposed to plugins.
 */
export interface PluginLogger {
  debug: (message: string, meta?: Record<string, unknown>) => void;
  info: (message: string, meta?: Record<string, unknown>) => void;
  warn: (message: string, meta?: Record<string, unknown>) => void;
  error: (message: string, meta?: Record<string, unknown>) => void;
}

/**
 * Plugin init context.
 */
export interface PluginInitContext {
  coreVersion: string;
  registerHooks: (hooks: PluginHooks) => void;
  extendApi: <TApi extends object>(namespace: string, api: TApi) => Result<void>;
  logger: PluginLogger;
}

/**
 * Plugin contract used by `client.use(plugin)`.
 */
export interface YukitaPlugin {
  name: string;
  version: string;
  compatibleRange: string;
  init: (ctx: PluginInitContext) => Promise<void | Result<void>> | void | Result<void>;
}
