# Рецепттер

## Кастом түйін таңдау

```ts
const node = client.nodePool.select({ strategy: 'least-load' });
```

Кастом функция:

```ts
const client = new YukitaSan({
  nodes: [...],
  selectionStrategy: (nodes) => nodes.sort((a, b) => a.penalty - b.penalty)[0] ?? null
});
```

## Кастом REST шақыру

```ts
const node = client.nodePool.getNode('main');
if (!node) throw new Error('missing node');

const res = await node.rest.raw({ method: 'GET', path: '/stats' });
```

## Metrics плагинін қосу

```ts
import { createMetricsPlugin } from 'yukitasan';

await client.use(createMetricsPlugin());
```

## REST логтау (type-safe middleware)

```ts
import { definePlugin } from 'yukitasan';

const RestLogger = definePlugin({
  name: 'rest-logger',
  version: '1.0.0',
  setup: (ctx) => {
    ctx.hooks.onRestRequest((req) => {
      req.meta.plugin = 'rest-logger';
      ctx.logger.debug('REST request', {
        endpoint: req.endpoint,
        requestId: req.requestId,
        nodeId: req.nodeId,
        attempt: req.attempt
      });
    });
  }
});

await client.use(RestLogger);
```

## Gateway: кастом topic + команда

Gateway плагині жариялайтын `websocketGateway` namespace-ін қолданыңыз.

```ts
import { definePlugin, ok, type GatewayRole, type YukitaGatewayServer } from 'yukitasan';

type WebsocketGatewayExtension = { server: YukitaGatewayServer };

const CustomGateway = definePlugin({
  name: 'custom-gateway',
  version: '1.0.0',
  setup: (ctx) => {
    const gateway = ctx.client.getExtension<WebsocketGatewayExtension>('websocketGateway');
    if (!gateway.ok) return;

    gateway.value.server.publish('custom', 'custom.hello', { message: 'Hello from plugin', ts: Date.now() });

    gateway.value.server.registerCommand('custom.ping', {
      requiredRoles: ['web:read', 'admin'] satisfies GatewayRole[],
      handler: async () => ok({ pong: true, ts: Date.now() })
    });
  }
});

await client.use(CustomGateway);
```
