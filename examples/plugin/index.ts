import {
  createWebsocketGatewayPlugin,
  definePlugin,
  ok,
  YukitaSan,
  type GatewayRole,
  type RestRequestContext,
  type YukitaGatewayServer
} from '../../src';

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

type WebsocketGatewayExtension = {
  server: YukitaGatewayServer;
};

const GatewayCustomTopic = definePlugin({
  name: 'gateway-custom-topic',
  version: '1.0.0',
  setup: (ctx) => {
    const gateway = ctx.client.getExtension<WebsocketGatewayExtension>('websocketGateway');
    if (!gateway.ok) {
      ctx.logger.warn('Gateway extension is not available (install websocket-gateway plugin first)');
      return;
    }

    // Custom topic example: clients can `subscribe` to `custom` and receive this event.
    gateway.value.server.publish('custom', 'custom.hello', {
      message: 'Hello from plugin',
      ts: Date.now()
    });

    // Custom command example: clients can `cmd` { t: 'custom.ping' }.
    gateway.value.server.registerCommand('custom.ping', {
      requiredRoles: ['web:read', 'admin'] satisfies GatewayRole[],
      handler: async () => ok({ pong: true, ts: Date.now() })
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

await client.use(
  createWebsocketGatewayPlugin({
    port: 8080,
    path: '/yukitasan',
    auth: {
      mode: 'hmac',
      secret: process.env.GATEWAY_SECRET ?? 'change-me'
    }
  })
);

await client.use(RestLogger);
await client.use(GatewayCustomTopic);
await client.start();

const node = client.nodePool.getNode('main');
if (node) {
  const res = await node.rest.getStats();
  console.log(res);
}

await client.shutdown();
