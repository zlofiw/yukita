import { describe, expect, it } from 'vitest';
import { PlayerQueue } from '../../src/PlayerQueue';

function makeTrack(id: string) {
  return {
    encoded: id,
    identifier: id,
    title: id,
    author: 'author',
    lengthMs: 10_000,
    sourceName: 'test',
    isStream: false,
    isSeekable: true,
    positionMs: 0
  };
}

describe('PlayerQueue', () => {
  it('adds, removes and moves tracks', () => {
    const queue = new PlayerQueue();
    const add = queue.add([makeTrack('a'), makeTrack('b'), makeTrack('c')]);
    expect(add.ok).toBe(true);
    expect(queue.value.map((item) => item.identifier)).toEqual(['a', 'b', 'c']);

    const move = queue.move(2, 0);
    expect(move.ok).toBe(true);
    expect(queue.value.map((item) => item.identifier)).toEqual(['c', 'a', 'b']);

    const removed = queue.remove(1);
    expect(removed.ok).toBe(true);
    if (removed.ok) {
      expect(removed.value.identifier).toBe('a');
    }
    expect(queue.value.map((item) => item.identifier)).toEqual(['c', 'b']);
  });

  it('supports repeat modes', () => {
    const queue = new PlayerQueue();
    queue.add([makeTrack('a'), makeTrack('b')]);

    queue.setRepeat('track');
    const repeatTrack = queue.next(makeTrack('current'));
    expect(repeatTrack?.identifier).toBe('current');

    queue.setRepeat('none');
    expect(queue.next(null)?.identifier).toBe('a');

    queue.setRepeat('queue');
    expect(queue.next(makeTrack('x'))?.identifier).toBe('b');
    expect(queue.value.map((item) => item.identifier)).toEqual(['x']);
  });

  it('returns range error for invalid indexes', () => {
    const queue = new PlayerQueue();
    queue.add(makeTrack('a'));
    const result = queue.remove(5);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('QUEUE_OUT_OF_RANGE');
    }
  });
});
