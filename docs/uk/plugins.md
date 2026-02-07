# Плагіни

Плагіни встановлюються через `client.use(plugin)`: вони можуть реєструвати хуки та публікувати API через namespaces.

Рекомендація: викликайте `client.use(...)` до `client.start()`, щоб плагіни встигли підключитися до старту та REST middleware.

## Вбудовані плагіни

- `metrics`
- `resolve-cache`
- `websocket-gateway`

Вбудовані плагіни створюються так:

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

Доступні сімейства хуків:

- lifecycle: `onInit`, `onShutdown`
- node: `onNodeConnect`, `onNodeReady`, `onNodeDisconnect`
- player: `onPlayerCreate`, `onPlayerDestroy`
- track: `onTrackStart`, `onTrackEnd`, `onTrackException`, `onTrackStuck`
- queue: `onQueueUpdated`
- resolve/play: `beforeResolve`, `afterResolve`, `beforePlay`, `afterPlay`
- REST: `onRestRequest`, `onRestResponse`, `onRestError`

## Extensions

Плагіни можуть публікувати API:

```ts
ctx.extendApi('my', {
  ping: () => 'pong'
});

// пізніше:
const ext = client.getExtension<{ ping: () => string }>('my');
if (ext.ok) console.log(ext.value.ping());
```

## Вбудований: metrics

Namespace: `metrics`.

```ts
import { createMetricsPlugin } from 'yukitasan';
await client.use(createMetricsPlugin());

const metrics = client.getExtension<{ getSnapshot: () => unknown }>('metrics');
```

## Вбудований: resolve-cache

Namespace: `resolveCache`.

```ts
import { createResolveCachePlugin } from 'yukitasan';
await client.use(createResolveCachePlugin({ ttlMs: 45_000 }));
```

## Вбудований: websocket-gateway

Namespace: `websocketGateway`.

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
