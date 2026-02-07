[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / LavalinkLoadResult

# Type Alias: LavalinkLoadResult

> **LavalinkLoadResult** = \{ `loadType`: `"track"`; `data`: [`LavalinkTrack`](../interfaces/LavalinkTrack.md); \} \| \{ `loadType`: `"playlist"`; `data`: [`LavalinkPlaylist`](../interfaces/LavalinkPlaylist.md); \} \| \{ `loadType`: `"search"`; `data`: [`LavalinkTrack`](../interfaces/LavalinkTrack.md)[]; \} \| \{ `loadType`: `"empty"`; `data`: `Record`\<`string`, `never`\>; \} \| \{ `loadType`: `"error"`; `data`: [`LavalinkLoadException`](../interfaces/LavalinkLoadException.md); \}

Defined in: [src/lavalink/types.ts:100](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/types.ts#L100)

Lavalink load result union.
