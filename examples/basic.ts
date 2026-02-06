import { YukitaClient } from '../packages/core/src';
import { MetricsPlugin } from '../packages/plugins/metrics/src';
import { ResolveCachePlugin } from '../packages/plugins/resolve-cache/src';

async function main(): Promise<void> {
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

  try {
    const started = await client.start();
    if (!started.ok) {
      console.error('failed to start client', started.error);
      return;
    }

    await client.use(new MetricsPlugin());
    await client.use(new ResolveCachePlugin());

    const created = await client.createPlayer('example:guild', {
      guildId: 'example-guild-id',
      shardId: 0
    });
    if (!created.ok) {
      console.error('failed to create player', created.error);
      return;
    }

    const played = await client.play('example:guild', {
      query: 'ytsearch:deadmau5 strobe',
      sourceHints: ['youtube']
    });
    console.log('play result', played);

    const metrics = client.getExtension<{ getSnapshot: () => unknown }>('metrics');
    console.log('metrics extension', metrics.ok ? metrics.value.getSnapshot() : metrics.error);
  } finally {
    await client.shutdown();
  }
}

void main();
