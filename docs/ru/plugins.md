# Plugins

Plugins are installed with `client.use(plugin)` and can register hooks and expose APIs via namespaces.

## Built-in Plugins

- `metrics`
- `resolve-cache`
- `websocket-gateway`

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

