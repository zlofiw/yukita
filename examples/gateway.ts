import { YukitaClient } from '../packages/core/src';
import { YukitaGatewayServer, createGatewayHmacToken } from '../packages/gateway/src';

async function main(): Promise<void> {
  const secret = process.env.GATEWAY_SECRET ?? 'dev-secret';
  const keepAlive = process.env.GATEWAY_EXAMPLE_KEEP_ALIVE === '1';
  const client = new YukitaClient({
    nodes: [
      {
        id: 'main',
        host: process.env.LAVALINK_HOST ?? '127.0.0.1',
        port: Number(process.env.LAVALINK_PORT ?? '2333'),
        password: process.env.LAVALINK_PASSWORD ?? 'youshallnotpass',
        userId: process.env.LAVALINK_USER_ID ?? '123456789012345678'
      }
    ]
  });

  const started = await client.start();
  if (!started.ok) {
    console.error('failed to start client', started.error);
    await client.shutdown();
    return;
  }

  const gateway = new YukitaGatewayServer(client, {
    port: Number(process.env.GATEWAY_PORT ?? '8080'),
    path: '/yukita',
    auth: {
      mode: 'hmac',
      secret
    },
    allowedOrigins: ['http://localhost:3000']
  });

  const gatewayStart = await gateway.start();
  if (!gatewayStart.ok) {
    console.error('failed to start gateway', gatewayStart.error);
    await client.shutdown();
    return;
  }

  const token = createGatewayHmacToken(
    {
      sub: 'local-bot',
      roles: ['admin'],
      exp: Math.floor(Date.now() / 1000) + 3600
    },
    secret
  );
  console.log('gateway token', token);
  console.log('gateway ready at ws://localhost:8080/yukita?token=...');

  if (keepAlive) {
    return;
  }

  await new Promise<void>((resolve) => {
    setTimeout(() => resolve(), 3_000);
  });
  await gateway.stop();
  await client.shutdown();
}

void main();
