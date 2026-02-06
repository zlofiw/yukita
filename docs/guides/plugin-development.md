# Plugin Development

This guide shows how to build and register a custom YukiTa plugin.

## 1. Plugin Contract

A plugin provides metadata and an `init(ctx)` function:

```ts
import type { Result, YukitaPlugin, PluginInitContext } from '@yukita/plugin-kit';

export class ExamplePlugin implements YukitaPlugin {
  public readonly name = 'example-plugin';
  public readonly version = '1.0.0';
  public readonly compatibleRange = '^1.0.0';

  public async init(ctx: PluginInitContext): Promise<void | Result<void>> {
    // register hooks
    // expose extension api
  }
}
```

## 2. Register Hooks

```ts
ctx.registerHooks({
  beforeResolve: async (payload) => {
    if (!payload.query.trim()) {
      return {
        ok: false,
        error: new YukitaError({
          code: YukitaErrorCode.INVALID_ARGUMENT,
          message: 'Query must not be empty'
        })
      };
    }
    return payload;
  },
  afterResolve: async (request, result) => {
    ctx.logger.debug('Resolved query', {
      contextId: request.contextId,
      query: request.query,
      kind: result.kind
    });
    return result;
  },
  onTrackEvent: (event) => {
    if (event.type === 'started') {
      ctx.logger.info('Track started', {
        contextId: event.contextId
      });
    }
  }
});
```

## 3. Expose Extension API

```ts
let resolveCount = 0;

ctx.registerHooks({
  afterResolve: async (_request, result) => {
    if (result.kind === 'tracks' || result.kind === 'playlist') {
      resolveCount += 1;
    }
    return result;
  }
});

ctx.extendApi('example', {
  getResolveCount: () => resolveCount,
  reset: () => {
    resolveCount = 0;
  }
});
```

## 4. Full Example

```ts
import {
  YukitaError,
  YukitaErrorCode,
  ok,
  type PluginInitContext,
  type Result,
  type YukitaPlugin
} from '@yukita/plugin-kit';

export class ExamplePlugin implements YukitaPlugin {
  public readonly name = 'example-plugin';
  public readonly version = '1.0.0';
  public readonly compatibleRange = '^1.0.0';

  public async init(ctx: PluginInitContext): Promise<void | Result<void>> {
    let resolveCount = 0;

    ctx.registerHooks({
      beforeResolve: (payload) => {
        if (!payload.query.trim()) {
          return {
            ok: false,
            error: new YukitaError({
              code: YukitaErrorCode.INVALID_ARGUMENT,
              message: 'Query must not be empty'
            })
          };
        }
        return payload;
      },
      afterResolve: (_request, result) => {
        if (result.kind === 'tracks' || result.kind === 'playlist') {
          resolveCount += 1;
        }
        return result;
      }
    });

    const extension = ctx.extendApi('example', {
      getResolveCount: () => resolveCount
    });
    if (!extension.ok) {
      return extension;
    }

    return ok(undefined);
  }
}
```

## 5. Install Plugin

```ts
const installed = await client.use(new ExamplePlugin());
if (!installed.ok) {
  throw installed.error;
}

const extension = client.getExtension<{ getResolveCount: () => number }>('example');
if (!extension.ok) {
  throw extension.error;
}

console.log(extension.value.getResolveCount());
```

## Notes

- Do not mutate core classes or prototypes.
- Use `extendApi(namespace, api)` for controlled feature exposure.
- Keep plugin state isolated and deterministic.
- Return `Result` errors with stable `YukitaError.code` values.