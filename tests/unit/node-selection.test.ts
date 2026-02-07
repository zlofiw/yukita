import { describe, expect, it } from 'vitest';
import { NodePool } from '../../src';

const baseNode = {
  host: '127.0.0.1',
  port: 2333,
  password: 'pass',
  userId: 'bot'
};

describe('NodePool selection strategies', () => {
  it('selects by penalty', () => {
    const pool = new NodePool({
      nodes: [
        { ...baseNode, id: 'a' },
        { ...baseNode, id: 'b' },
        { ...baseNode, id: 'c' }
      ],
      strategy: 'penalty'
    });

    for (const node of pool.listNodes()) {
      node.state = 'connected';
    }

    const a = pool.getNode('a')!;
    const b = pool.getNode('b')!;
    const c = pool.getNode('c')!;
    a.stats = {
      op: 'stats',
      players: 10,
      playingPlayers: 10,
      cpu: { cores: 4, systemLoad: 0.8, lavalinkLoad: 0.5 },
      memory: { allocated: 1, free: 1, reservable: 1, used: 1 },
      frameStats: { sent: 0, deficit: 10, nulled: 10 },
      uptime: 1
    };
    b.stats = {
      op: 'stats',
      players: 1,
      playingPlayers: 1,
      cpu: { cores: 4, systemLoad: 0.1, lavalinkLoad: 0.05 },
      memory: { allocated: 1, free: 1, reservable: 1, used: 1 },
      frameStats: { sent: 0, deficit: 0, nulled: 0 },
      uptime: 1
    };
    c.stats = {
      op: 'stats',
      players: 2,
      playingPlayers: 2,
      cpu: { cores: 4, systemLoad: 0.2, lavalinkLoad: 0.1 },
      memory: { allocated: 1, free: 1, reservable: 1, used: 1 },
      frameStats: { sent: 0, deficit: 0, nulled: 0 },
      uptime: 1
    };

    const result = pool.select();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.id).toBe('b');
    }
  });

  it('selects by round-robin', () => {
    const pool = new NodePool({
      nodes: [{ ...baseNode, id: 'a' }, { ...baseNode, id: 'b' }],
      strategy: 'round-robin'
    });

    for (const node of pool.listNodes()) {
      node.state = 'connected';
      node.stats = {
        op: 'stats',
        players: 0,
        playingPlayers: 0,
        cpu: { cores: 4, systemLoad: 0.1, lavalinkLoad: 0.1 },
        memory: { allocated: 1, free: 1, reservable: 1, used: 1 },
        frameStats: { sent: 0, deficit: 0, nulled: 0 },
        uptime: 1
      };
    }

    const first = pool.select();
    const second = pool.select();
    if (first.ok && second.ok) {
      expect(first.value.id).not.toBe(second.value.id);
    }
  });
});
