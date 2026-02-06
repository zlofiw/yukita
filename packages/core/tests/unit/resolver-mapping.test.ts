import { describe, expect, it } from 'vitest';
import { mapLoadResult } from '@yukita/protocol';

describe('mapLoadResult', () => {
  it('maps playlist payload', () => {
    const result = mapLoadResult({
      loadType: 'playlist',
      data: {
        encoded: 'encoded-playlist',
        info: {
          name: 'playlist',
          selectedTrack: 0
        },
        tracks: [
          {
            encoded: 'track-1',
            info: {
              identifier: 'id-1',
              isSeekable: true,
              author: 'author',
              length: 123,
              isStream: false,
              position: 0,
              title: 'title',
              sourceName: 'youtube'
            }
          }
        ]
      }
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.result.kind).toBe('playlist');
      if (result.value.result.kind === 'playlist') {
        expect(result.value.result.playlist.tracks[0]?.encoded).toBe('track-1');
      }
    }
  });

  it('maps error payload to loadFailed model', () => {
    const result = mapLoadResult({
      loadType: 'error',
      data: {
        message: 'failed',
        severity: 'fault',
        cause: 'cause'
      }
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.result.kind).toBe('loadFailed');
    }
  });
});
