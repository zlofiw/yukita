[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / LavalinkTrackExceptionEvent

# Interface: LavalinkTrackExceptionEvent

Defined in: [src/lavalink/types.ts:210](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/types.ts#L210)

Lavalink track exception event payload.

## Properties

### op

> **op**: `"event"`

Defined in: [src/lavalink/types.ts:211](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/types.ts#L211)

***

### type

> **type**: `"TrackExceptionEvent"`

Defined in: [src/lavalink/types.ts:212](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/types.ts#L212)

***

### guildId

> **guildId**: `string`

Defined in: [src/lavalink/types.ts:213](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/types.ts#L213)

***

### track

> **track**: [`LavalinkTrack`](LavalinkTrack.md)

Defined in: [src/lavalink/types.ts:214](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/types.ts#L214)

***

### exception

> **exception**: `object`

Defined in: [src/lavalink/types.ts:215](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/types.ts#L215)

#### message

> **message**: `string`

#### severity

> **severity**: `"common"` \| `"suspicious"` \| `"fault"`

#### cause

> **cause**: `string`
