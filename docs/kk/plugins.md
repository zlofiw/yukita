# Плагиндер

Плагиндер `client.use(plugin)` арқылы орнатылады: олар хуктарды тіркей алады және namespaces арқылы API жариялай алады.

Ұсыныс: `client.use(...)`-ты `client.start()` алдында шақырыңыз, сонда плагиндер іске қосылу және REST middleware-ге қосыла алады.

## Кірістірілген плагиндер

- `metrics`
- `resolve-cache`
- `websocket-gateway`

Кірістірілген плагиндер мыналар арқылы жасалады:

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

Қолжетімді хук топтары:

- lifecycle: `onInit`, `onShutdown`
- node: `onNodeConnect`, `onNodeReady`, `onNodeDisconnect`
- player: `onPlayerCreate`, `onPlayerDestroy`
- track: `onTrackStart`, `onTrackEnd`, `onTrackException`, `onTrackStuck`
- queue: `onQueueUpdated`
- resolve/play: `beforeResolve`, `afterResolve`, `beforePlay`, `afterPlay`
- REST: `onRestRequest`, `onRestResponse`, `onRestError`

## Extensions

Плагиндер API жариялай алады:

```ts
ctx.extendApi('my', {
  ping: () => 'pong'
});

// кейін:
const ext = client.getExtension<{ ping: () => string }>('my');
if (ext.ok) console.log(ext.value.ping());
```

## Кірістірілген: metrics

Namespace: `metrics`.

```ts
import { createMetricsPlugin } from 'yukitasan';
await client.use(createMetricsPlugin());

const metrics = client.getExtension<{ getSnapshot: () => unknown }>('metrics');
```

## Кірістірілген: resolve-cache

Namespace: `resolveCache`.

```ts
import { createResolveCachePlugin } from 'yukitasan';
await client.use(createResolveCachePlugin({ ttlMs: 45_000 }));
```

## Кірістірілген: websocket-gateway

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
