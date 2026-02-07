import { ok, type Result } from '../shared';
import type {
  BeforePlayPayload,
  BeforeResolvePayload,
  PluginHooks,
  PluginInitContext,
  PluginNodeEvent,
  PluginPlayerEvent,
  PluginQueueEvent,
  PluginTrackEvent,
  YukitaPlugin
} from './types';
import type { LavalinkResponse, RestRequestContext, RestResponseContext } from '../lavalink/responses';

export type MaybePromise<T> = T | Promise<T>;

export type HookFn<T> = (payload: T) => MaybePromise<void>;

export type RestRequestHook = (ctx: RestRequestContext) => MaybePromise<void>;
export type RestResponseHook = <T>(ctx: RestResponseContext<T>, res: LavalinkResponse<T>) => MaybePromise<void>;
export type RestErrorHook = (ctx: RestRequestContext, error: unknown) => MaybePromise<void>;

export interface DefinePluginContext {
  coreVersion: string;
  logger: PluginInitContext['logger'];
  client: PluginInitContext['client'];

  extendApi: PluginInitContext['extendApi'];

  hooks: {
    onInit: (handler: () => MaybePromise<void>) => void;
    onShutdown: (handler: () => MaybePromise<void>) => void;

    onNodeConnect: (handler: HookFn<PluginNodeEvent>) => void;
    onNodeReady: (handler: HookFn<PluginNodeEvent>) => void;
    onNodeDisconnect: (handler: HookFn<PluginNodeEvent>) => void;

    onPlayerCreate: (handler: HookFn<PluginPlayerEvent>) => void;
    onPlayerDestroy: (handler: HookFn<PluginPlayerEvent>) => void;

    onTrackStart: (handler: HookFn<PluginTrackEvent>) => void;
    onTrackEnd: (handler: HookFn<PluginTrackEvent>) => void;
    onTrackException: (handler: HookFn<PluginTrackEvent>) => void;
    onTrackStuck: (handler: HookFn<PluginTrackEvent>) => void;

    onQueueUpdated: (handler: HookFn<PluginQueueEvent>) => void;

    beforeResolve: (handler: NonNullable<PluginHooks['beforeResolve']>) => void;
    afterResolve: (handler: NonNullable<PluginHooks['afterResolve']>) => void;

    beforePlay: (handler: NonNullable<PluginHooks['beforePlay']>) => void;
    afterPlay: (handler: NonNullable<PluginHooks['afterPlay']>) => void;

    onRestRequest: (handler: RestRequestHook) => void;
    onRestResponse: (handler: RestResponseHook) => void;
    onRestError: (handler: RestErrorHook) => void;
  };
}

export function definePlugin(input: {
  name: string;
  version: string;
  compatibleRange?: string;
  setup: (ctx: DefinePluginContext) => MaybePromise<void | Result<void>>;
}): YukitaPlugin {
  const name = input.name;
  const version = input.version;

  const plugin: YukitaPlugin = {
    name,
    version,
    init: async (ctx: PluginInitContext) => {
      const onInit: Array<() => MaybePromise<void>> = [];
      const onShutdown: Array<() => MaybePromise<void>> = [];

      const onNodeConnect: HookFn<PluginNodeEvent>[] = [];
      const onNodeReady: HookFn<PluginNodeEvent>[] = [];
      const onNodeDisconnect: HookFn<PluginNodeEvent>[] = [];

      const onPlayerCreate: HookFn<PluginPlayerEvent>[] = [];
      const onPlayerDestroy: HookFn<PluginPlayerEvent>[] = [];

      const onTrackStart: HookFn<PluginTrackEvent>[] = [];
      const onTrackEnd: HookFn<PluginTrackEvent>[] = [];
      const onTrackException: HookFn<PluginTrackEvent>[] = [];
      const onTrackStuck: HookFn<PluginTrackEvent>[] = [];

      const onQueueUpdated: HookFn<PluginQueueEvent>[] = [];

      const beforeResolve: Array<NonNullable<PluginHooks['beforeResolve']>> = [];
      const afterResolve: Array<NonNullable<PluginHooks['afterResolve']>> = [];

      const beforePlay: Array<NonNullable<PluginHooks['beforePlay']>> = [];
      const afterPlay: Array<NonNullable<PluginHooks['afterPlay']>> = [];

      const restRequest: RestRequestHook[] = [];
      const restResponse: RestResponseHook[] = [];
      const restError: RestErrorHook[] = [];

      const defineCtx: DefinePluginContext = {
        coreVersion: ctx.coreVersion,
        logger: ctx.logger,
        client: ctx.client,
        extendApi: ctx.extendApi,
        hooks: {
          onInit: (handler) => {
            onInit.push(handler);
          },
          onShutdown: (handler) => {
            onShutdown.push(handler);
          },
          onNodeConnect: (handler) => {
            onNodeConnect.push(handler);
          },
          onNodeReady: (handler) => {
            onNodeReady.push(handler);
          },
          onNodeDisconnect: (handler) => {
            onNodeDisconnect.push(handler);
          },
          onPlayerCreate: (handler) => {
            onPlayerCreate.push(handler);
          },
          onPlayerDestroy: (handler) => {
            onPlayerDestroy.push(handler);
          },
          onTrackStart: (handler) => {
            onTrackStart.push(handler);
          },
          onTrackEnd: (handler) => {
            onTrackEnd.push(handler);
          },
          onTrackException: (handler) => {
            onTrackException.push(handler);
          },
          onTrackStuck: (handler) => {
            onTrackStuck.push(handler);
          },
          onQueueUpdated: (handler) => {
            onQueueUpdated.push(handler);
          },
          beforeResolve: (handler) => {
            beforeResolve.push(handler);
          },
          afterResolve: (handler) => {
            afterResolve.push(handler);
          },
          beforePlay: (handler) => {
            beforePlay.push(handler);
          },
          afterPlay: (handler) => {
            afterPlay.push(handler);
          },
          onRestRequest: (handler) => {
            restRequest.push(handler);
          },
          onRestResponse: (handler) => {
            restResponse.push(handler);
          },
          onRestError: (handler) => {
            restError.push(handler);
          }
        }
      };

      const setupResult = await input.setup(defineCtx);
      if (typeof setupResult !== 'undefined' && typeof setupResult === 'object' && 'ok' in setupResult && !setupResult.ok) {
        return setupResult;
      }

      const hooks: PluginHooks = {};

      if (onInit.length) {
        hooks.onInit = async () => {
          for (const handler of onInit) {
            await handler();
          }
        };
      }

      if (onShutdown.length) {
        hooks.onShutdown = async () => {
          for (const handler of onShutdown) {
            await handler();
          }
        };
      }

      if (onNodeConnect.length || onNodeReady.length || onNodeDisconnect.length) {
        hooks.onNodeEvent = async (payload) => {
          if (payload.type === 'connected') {
            for (const handler of onNodeConnect) {
              await handler(payload);
            }
            for (const handler of onNodeReady) {
              await handler(payload);
            }
          }
          if (payload.type === 'disconnected') {
            for (const handler of onNodeDisconnect) {
              await handler(payload);
            }
          }
        };
      }

      if (onPlayerCreate.length || onPlayerDestroy.length) {
        hooks.onPlayerEvent = async (payload) => {
          if (payload.type === 'created') {
            for (const handler of onPlayerCreate) {
              await handler(payload);
            }
          }
          if (payload.type === 'destroyed') {
            for (const handler of onPlayerDestroy) {
              await handler(payload);
            }
          }
        };
      }

      if (onTrackStart.length || onTrackEnd.length || onTrackException.length || onTrackStuck.length) {
        hooks.onTrackEvent = async (payload) => {
          if (payload.type === 'started') {
            for (const handler of onTrackStart) {
              await handler(payload);
            }
          }
          if (payload.type === 'ended') {
            for (const handler of onTrackEnd) {
              await handler(payload);
            }
          }
          if (payload.type === 'exception') {
            for (const handler of onTrackException) {
              await handler(payload);
            }
          }
          if (payload.type === 'stuck') {
            for (const handler of onTrackStuck) {
              await handler(payload);
            }
          }
        };
      }

      if (onQueueUpdated.length) {
        hooks.onQueueEvent = async (payload) => {
          if (payload.type === 'updated') {
            for (const handler of onQueueUpdated) {
              await handler(payload);
            }
          }
        };
      }

      if (beforeResolve.length) {
        hooks.beforeResolve = async (payload) => {
          let current = payload;
          for (const handler of beforeResolve) {
            const output = await handler(current);
            if (typeof output === 'undefined') {
              continue;
            }
            if (typeof output === 'object' && output && 'ok' in output) {
              return output;
            }
            current = output;
          }
          return current;
        };
      }

      if (afterResolve.length) {
        hooks.afterResolve = async (request, result) => {
          let current = result;
          for (const handler of afterResolve) {
            const output = await handler(request, current);
            if (typeof output === 'undefined') {
              continue;
            }
            if (typeof output === 'object' && output && 'ok' in output) {
              return output;
            }
            current = output;
          }
          return current;
        };
      }

      if (beforePlay.length) {
        hooks.beforePlay = async (payload) => {
          let current = payload;
          for (const handler of beforePlay) {
            const output = await handler(current);
            if (typeof output === 'undefined') {
              continue;
            }
            if (typeof output === 'object' && output && 'ok' in output) {
              return output;
            }
            current = output;
          }
          return current;
        };
      }

      if (afterPlay.length) {
        hooks.afterPlay = async (payload) => {
          for (const handler of afterPlay) {
            const output = await handler(payload);
            if (typeof output === 'object' && output && 'ok' in output && !output.ok) {
              return output;
            }
          }
        };
      }

      if (restRequest.length) {
        hooks.onRestRequest = async (requestCtx) => {
          for (const handler of restRequest) {
            await handler(requestCtx);
          }
        };
      }

      if (restResponse.length) {
        hooks.onRestResponse = async (responseCtx, res) => {
          for (const handler of restResponse) {
            await handler(responseCtx as any, res as any);
          }
        };
      }

      if (restError.length) {
        hooks.onRestError = async (requestCtx, error) => {
          for (const handler of restError) {
            await handler(requestCtx, error);
          }
        };
      }

      ctx.registerHooks(hooks);
      return ok(undefined);
    }
  };

  if (typeof input.compatibleRange !== 'undefined') {
    plugin.compatibleRange = input.compatibleRange;
  }

  return plugin;
}
