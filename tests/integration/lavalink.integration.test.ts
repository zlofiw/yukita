import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { YukitaSan } from '../../src';

const runIntegration = process.env.RUN_INTEGRATION === '1';
const describeIf = runIntegration ? describe : describe.skip;

const host = process.env.LAVALINK_HOST ?? '127.0.0.1';
const port = Number(process.env.LAVALINK_PORT ?? '2333');
const password = process.env.LAVALINK_PASSWORD ?? 'youshallnotpass';
const userId = process.env.LAVALINK_USER_ID ?? '123456789012345678';

async function waitForLavalinkReady(timeoutMs = 60_000): Promise<void> {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(`http://${host}:${port}/v4/stats`, {
        headers: {
          Authorization: password,
          'User-Id': userId,
          'Client-Name': 'YukiTa/Integration'
        }
      });
      if (response.ok) {
        return;
      }
    } catch {
      // ignore until timeout
    }

    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 1_000);
    });
  }

  throw new Error(`Lavalink was not ready in ${timeoutMs}ms`);
}

describeIf('core + lavalink integration', () => {
  const client = new YukitaSan({
    nodes: [
      {
        id: 'integration',
        host,
        port,
        password,
        userId
      }
    ]
  });

  beforeAll(async () => {
    await waitForLavalinkReady();
    const started = await client.start();
    expect(started.ok).toBe(true);
  }, 90_000);

  afterAll(async () => {
    await client.shutdown();
  }, 20_000);

  it('connects and resolves tracks', async () => {
    const resolved = await client.resolve('ctx:integration', 'ytsearch:never gonna give you up');
    expect(resolved.ok).toBe(true);
    if (resolved.ok) {
      expect(['tracks', 'playlist', 'noMatches', 'loadFailed']).toContain(resolved.value.result.kind);
    }
  });

  it('runs player flow and emits events', async () => {
    const guildId = '111111111111111111';
    const seen: string[] = [];
    const unsubs = [
      client.on('player.created', () => {
        seen.push('player.created');
      }),
      client.on('resolve.completed', () => {
        seen.push('resolve.completed');
      }),
      client.on('player.state', () => {
        seen.push('player.state');
      })
    ];

    try {
      const created = await client.createPlayer('ctx:integration-play', {
        guildId,
        shardId: 0
      });
      expect(created.ok).toBe(true);

      const resolved = await client.resolve('ctx:integration-play', 'ytsearch:daft punk around the world');
      expect(resolved.ok).toBe(true);

      expect(seen).toContain('player.created');
      expect(seen).toContain('resolve.completed');

      // REST smoke for player endpoints (does not require real Discord voice state).
      const node = client.nodePool.getNode('integration');
      expect(node).toBeTruthy();
      if (node?.sessionId) {
        const updated = await node.rest.updatePlayer({
          sessionId: node.sessionId,
          guildId,
          payload: {
            paused: true,
            volume: 42
          }
        });
        expect(updated.ok).toBe(true);

        const fetched = await node.rest.getPlayer({ sessionId: node.sessionId, guildId });
        expect(fetched.ok).toBe(true);
      }
    } finally {
      const destroyed = await client.destroyPlayer('ctx:integration-play');
      if (!destroyed.ok) {
        expect(['PLAYER_NOT_FOUND', 'NODE_REST_FAILED']).toContain(destroyed.error.code);
      }

      for (const unsubscribe of unsubs) {
        unsubscribe();
      }
    }
  });
});
