import type { YukitaResolveModel, YukitaTrackModel } from '@yukita/plugin-kit';
import { YukitaError, YukitaErrorCode, err, ok, type Result } from '@yukita/plugin-kit';
import type { LavalinkLoadResult, LavalinkTrack, ResolverEnvelope } from './types';

function mapTrack(track: LavalinkTrack): YukitaTrackModel {
  const payload: YukitaTrackModel = {
    encoded: track.encoded,
    identifier: track.info.identifier,
    title: track.info.title,
    author: track.info.author,
    lengthMs: track.info.length,
    sourceName: track.info.sourceName,
    isStream: track.info.isStream,
    isSeekable: track.info.isSeekable,
    positionMs: track.info.position
  };
  if (typeof track.info.uri !== 'undefined') {
    payload.uri = track.info.uri;
  }
  if (typeof track.info.artworkUrl !== 'undefined') {
    payload.artworkUrl = track.info.artworkUrl;
  }
  if (typeof track.pluginInfo !== 'undefined') {
    payload.pluginInfo = track.pluginInfo;
  }
  return payload;
}

/**
 * Converts lavalink `/loadtracks` response into YukiTa normalized model.
 */
export function mapLoadResult(payload: LavalinkLoadResult): Result<ResolverEnvelope> {
  try {
    let result: YukitaResolveModel;
    switch (payload.loadType) {
      case 'track':
        result = {
          kind: 'tracks',
          tracks: [mapTrack(payload.data)]
        };
        break;
      case 'search':
        result = {
          kind: 'tracks',
          tracks: payload.data.map(mapTrack)
        };
        break;
      case 'playlist':
        result = {
          kind: 'playlist',
          playlist: {
            name: payload.data.info.name,
            tracks: payload.data.tracks.map(mapTrack),
            selectedTrack: payload.data.info.selectedTrack,
            pluginInfo: payload.data.pluginInfo
          }
        };
        break;
      case 'empty':
        result = { kind: 'noMatches' };
        break;
      case 'error':
        result = {
          kind: 'loadFailed',
          message: payload.data.message,
          severity: payload.data.severity,
          cause: payload.data.cause
        };
        break;
      default:
        return err(
          new YukitaError({
            code: YukitaErrorCode.RESOLVE_FAILED,
            message: 'Unsupported lavalink load type',
            meta: {
              loadType: (payload as { loadType?: unknown }).loadType
            }
          })
        );
    }

    return ok({ result, raw: payload });
  } catch (error) {
    return err(
      new YukitaError({
        code: YukitaErrorCode.RESOLVE_FAILED,
        message: 'Failed to map lavalink load result',
        cause: error
      })
    );
  }
}
