# Плагины

Плагины устанавливаются через `client.use(plugin)`: они могут регистрировать хуки и публиковать API через namespaces.

Рекомендация: вызывать `client.use(...)` до `client.start()`, чтобы плагины успели подключиться к старту и REST middleware.

## Встроенные плагины

- `metrics`
- `resolve-cache`
- `websocket-gateway`

Встроенные плагины создаются так:

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

Доступные семейства хуков:

- lifecycle: `onInit`, `onShutdown`
- node: `onNodeConnect`, `onNodeReady`, `onNodeDisconnect`
- player: `onPlayerCreate`, `onPlayerDestroy`
- track: `onTrackStart`, `onTrackEnd`, `onTrackException`, `onTrackStuck`
- queue: `onQueueUpdated`
- resolve/play: `beforeResolve`, `afterResolve`, `beforePlay`, `afterPlay`
- REST: `onRestRequest`, `onRestResponse`, `onRestError`

## Extensions

Плагины могут публиковать API:

```ts
ctx.extendApi('my', {
  ping: () => 'pong'
});

// позже:
const ext = client.getExtension<{ ping: () => string }>('my');
if (ext.ok) console.log(ext.value.ping());
```

## Встроенный: metrics

Namespace: `metrics`.

```ts
import { createMetricsPlugin } from 'yukitasan';
await client.use(createMetricsPlugin());

const metrics = client.getExtension<{ getSnapshot: () => unknown }>('metrics');
```

## Встроенный: resolve-cache

Namespace: `resolveCache`.

```ts
import { createResolveCachePlugin } from 'yukitasan';
await client.use(createResolveCachePlugin({ ttlMs: 45_000 }));
```

## Встроенный: websocket-gateway

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
