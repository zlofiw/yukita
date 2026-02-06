/**
 * Base normalized track model.
 */
export interface YukitaTrackModel {
  encoded: string;
  identifier: string;
  title: string;
  author: string;
  lengthMs: number;
  sourceName: string;
  uri?: string;
  artworkUrl?: string;
  isStream: boolean;
  isSeekable: boolean;
  positionMs: number;
  pluginInfo?: unknown;
}

/**
 * Base normalized playlist model.
 */
export interface YukitaPlaylistModel {
  name: string;
  tracks: YukitaTrackModel[];
  selectedTrack: number;
  pluginInfo?: unknown;
}

/**
 * Normalized resolve output contract.
 */
export type YukitaResolveModel =
  | {
      kind: 'tracks';
      tracks: YukitaTrackModel[];
    }
  | {
      kind: 'playlist';
      playlist: YukitaPlaylistModel;
    }
  | {
      kind: 'noMatches';
    }
  | {
      kind: 'loadFailed';
      message: string;
      severity: 'common' | 'suspicious' | 'fault';
      cause?: string;
    };
