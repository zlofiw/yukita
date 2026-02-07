import { definePlugin, YukitaSan, type RestRequestContext } from '../../src';

const RestLogger = definePlugin({
  name: 'rest-logger',
  version: '1.0.0',
  setup: (ctx) => {
    ctx.hooks.onRestRequest((req: RestRequestContext) => {
      // Attach extra meta that will be carried into LavalinkResponse.meta.
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

const client = new YukitaSan({
  nodes: [
    {
      id: 'main',
      host: '127.0.0.1',
      port: 2333,
      password: 'youshallnotpass',
      userId: '123456789012345678'
    }
  ]
});

await client.use(RestLogger);
await client.start();

const node = client.nodePool.getNode('main');
if (node) {
  const res = await node.rest.getStats();
  console.log(res);
}

await client.shutdown();

