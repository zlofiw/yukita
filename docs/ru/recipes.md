# Recipes

## Custom Node Selection

```ts
const node = client.nodePool.select({ strategy: 'least-load' });
```

## Custom REST Call

```ts
const node = client.nodePool.getNode('main');
if (!node) throw new Error('missing node');

const res = await node.rest.raw({ method: 'GET', path: '/stats' });
```

## Enable Metrics Plugin

```ts
import { createMetricsPlugin } from 'yukitasan';

await client.use(createMetricsPlugin());
```

