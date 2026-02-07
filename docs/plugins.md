# Plugins

Plugins are installed with `client.use(plugin)` and can register hooks and expose APIs via namespaces.

Recommendation: call `client.use(...)` before `client.start()` so plugins can hook into startup and REST middleware.

## Built-in Plugins

- `metrics`
- `resolve-cache`
- `websocket-gateway`

Built-ins are created via:

- `createMetricsPlugin()`
- `createResolveCachePlugin()`
- `createWebsocketGatewayPlugin(options)`

## definePlugin

```ts
import { definePlugin } from 'yukitasan';

const myPlugin = definePlugin({
  name: 'my-plugin',
  version: '1.0.0',
  setup: (ctx) => {
    ctx.hooks.onInit(() => {
      ctx.logger.info('client started');
    });

    ctx.hooks.onNodeReady((event) => {
      ctx.logger.info('node ready', { nodeId: event.nodeId });
    });
  }
});

await client.use(myPlugin);
```

## Hooks

Available hook families:

- lifecycle: `onInit`, `onShutdown`
- node: `onNodeConnect`, `onNodeReady`, `onNodeDisconnect`
- player: `onPlayerCreate`, `onPlayerDestroy`
- track: `onTrackStart`, `onTrackEnd`, `onTrackException`, `onTrackStuck`
- queue: `onQueueUpdated`
- resolve/play: `beforeResolve`, `afterResolve`, `beforePlay`, `afterPlay`
- REST: `onRestRequest`, `onRestResponse`, `onRestError`

## Extensions

Plugins can expose APIs:

```ts
ctx.extendApi('my', {
  ping: () => 'pong'
});

// later:
const ext = client.getExtension<{ ping: () => string }>('my');
if (ext.ok) console.log(ext.value.ping());
```

## Built-in: metrics

Extension namespace: `metrics`.

```ts
import { createMetricsPlugin } from 'yukitasan';
await client.use(createMetricsPlugin());

const metrics = client.getExtension<{ getSnapshot: () => unknown }>('metrics');
```

## Built-in: resolve-cache

Extension namespace: `resolveCache`.

```ts
import { createResolveCachePlugin } from 'yukitasan';
await client.use(createResolveCachePlugin({ ttlMs: 45_000 }));
```

## Built-in: websocket-gateway

Extension namespace: `websocketGateway`.

```ts
import { createWebsocketGatewayPlugin } from 'yukitasan';

await client.use(
  createWebsocketGatewayPlugin({
    port: 8080,
    path: '/yukitasan',
    auth: { mode: 'hmac', secret: 'change-me' }
  })
);
```
