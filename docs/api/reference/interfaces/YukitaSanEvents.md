[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / YukitaSanEvents

# Interface: YukitaSanEvents

Defined in: [src/types.ts:145](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/types.ts#L145)

Public core event map.

## Properties

### node.connected

> **node.connected**: `object`

Defined in: [src/types.ts:146](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/types.ts#L146)

#### nodeId

> **nodeId**: `string`

#### resumed

> **resumed**: `boolean`

***

### node.disconnected

> **node.disconnected**: `object`

Defined in: [src/types.ts:147](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/types.ts#L147)

#### nodeId

> **nodeId**: `string`

#### code

> **code**: `number`

#### reason

> **reason**: `string`

***

### node.error

> **node.error**: `object`

Defined in: [src/types.ts:148](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/types.ts#L148)

#### nodeId

> **nodeId**: `string`

#### error

> **error**: `Error`

***

### node.stats

> **node.stats**: `object`

Defined in: [src/types.ts:149](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/types.ts#L149)

#### nodeId

> **nodeId**: `string`

#### stats

> **stats**: [`LavalinkNodeStats`](LavalinkNodeStats.md)

***

### player.created

> **player.created**: `object`

Defined in: [src/types.ts:150](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/types.ts#L150)

#### contextId

> **contextId**: `string`

#### snapshot

> **snapshot**: [`PlayerSnapshot`](PlayerSnapshot.md)

***

### player.destroyed

> **player.destroyed**: `object`

Defined in: [src/types.ts:151](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/types.ts#L151)

#### contextId

> **contextId**: `string`

#### snapshot

> **snapshot**: [`PlayerSnapshot`](PlayerSnapshot.md)

***

### player.state

> **player.state**: `object`

Defined in: [src/types.ts:152](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/types.ts#L152)

#### contextId

> **contextId**: `string`

#### snapshot

> **snapshot**: [`PlayerSnapshot`](PlayerSnapshot.md)

#### reason

> **reason**: `string`

***

### track.started

> **track.started**: `object`

Defined in: [src/types.ts:153](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/types.ts#L153)

#### contextId

> **contextId**: `string`

#### track

> **track**: [`YukitaTrackModel`](YukitaTrackModel.md)

#### nodeId

> **nodeId**: `string`

***

### track.ended

> **track.ended**: `object`

Defined in: [src/types.ts:154](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/types.ts#L154)

#### contextId

> **contextId**: `string`

#### track

> **track**: [`YukitaTrackModel`](YukitaTrackModel.md)

#### reason

> **reason**: `string`

#### nodeId

> **nodeId**: `string`

***

### track.stuck

> **track.stuck**: `object`

Defined in: [src/types.ts:155](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/types.ts#L155)

#### contextId

> **contextId**: `string`

#### payload

> **payload**: [`LavalinkPlayerEvent`](../type-aliases/LavalinkPlayerEvent.md)

#### nodeId

> **nodeId**: `string`

***

### track.exception

> **track.exception**: `object`

Defined in: [src/types.ts:156](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/types.ts#L156)

#### contextId

> **contextId**: `string`

#### payload

> **payload**: [`LavalinkPlayerEvent`](../type-aliases/LavalinkPlayerEvent.md)

#### nodeId

> **nodeId**: `string`

***

### queue.updated

> **queue.updated**: `object`

Defined in: [src/types.ts:157](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/types.ts#L157)

#### contextId

> **contextId**: `string`

#### queue

> **queue**: [`YukitaTrackModel`](YukitaTrackModel.md)[]

#### reason

> **reason**: [`QueueUpdateReason`](../type-aliases/QueueUpdateReason.md)

***

### resolve.completed

> **resolve.completed**: `object`

Defined in: [src/types.ts:158](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/types.ts#L158)

#### contextId

> **contextId**: `string`

#### query

> **query**: `string`

#### output

> **output**: [`ResolveOutput`](ResolveOutput.md)

***

### resolve.failed

> **resolve.failed**: `object`

Defined in: [src/types.ts:159](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/types.ts#L159)

#### contextId

> **contextId**: `string`

#### query

> **query**: `string`

#### error

> **error**: `Error`
