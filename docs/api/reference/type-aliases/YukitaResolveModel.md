[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / YukitaResolveModel

# Type Alias: YukitaResolveModel

> **YukitaResolveModel** = \{ `kind`: `"tracks"`; `tracks`: [`YukitaTrackModel`](../interfaces/YukitaTrackModel.md)[]; \} \| \{ `kind`: `"playlist"`; `playlist`: [`YukitaPlaylistModel`](../interfaces/YukitaPlaylistModel.md); \} \| \{ `kind`: `"noMatches"`; \} \| \{ `kind`: `"loadFailed"`; `message`: `string`; `severity`: `"common"` \| `"suspicious"` \| `"fault"`; `cause?`: `string`; \}

Defined in: [src/shared/models.ts:32](https://github.com/zlofiw/yukita/blob/main/src/shared/models.ts#L32)

Normalized resolve output contract.
