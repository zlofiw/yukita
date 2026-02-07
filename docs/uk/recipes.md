# Рецепти

## Кастомний вибір ноди

```ts
const node = client.nodePool.select({ strategy: 'least-load' });
```

Кастомна функція:

```ts
const client = new YukitaSan({
  nodes: [...],
  selectionStrategy: (nodes) => nodes.sort((a, b) => a.penalty - b.penalty)[0] ?? null
});
```

## Кастомний REST виклик

```ts
const node = client.nodePool.getNode('main');
if (!node) throw new Error('missing node');

const res = await node.rest.raw({ method: 'GET', path: '/stats' });
```

## Увімкнути metrics plugin

```ts
import { createMetricsPlugin } from 'yukitasan';

await client.use(createMetricsPlugin());
```

## REST-логування (type-safe middleware)

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

## Gateway: кастомний topic + команда

Використовуй namespace `websocketGateway`, який публікує gateway-плагін.

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
