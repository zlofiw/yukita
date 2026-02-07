[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / NodePoolEvents

# Interface: NodePoolEvents

Defined in: [src/lavalink/NodePool.ts:9](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/NodePool.ts#L9)

Node pool event map.

## Properties

### node.connected

> **node.connected**: `object`

Defined in: [src/lavalink/NodePool.ts:10](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/NodePool.ts#L10)

#### nodeId

> **nodeId**: `string`

#### resumed

> **resumed**: `boolean`

***

### node.disconnected

> **node.disconnected**: `object`

Defined in: [src/lavalink/NodePool.ts:11](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/NodePool.ts#L11)

#### nodeId

> **nodeId**: `string`

#### code

> **code**: `number`

#### reason

> **reason**: `string`

***

### node.error

> **node.error**: `object`

Defined in: [src/lavalink/NodePool.ts:12](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/NodePool.ts#L12)

#### nodeId

> **nodeId**: `string`

#### error

> **error**: `Error`

***

### node.stats

> **node.stats**: `object`

Defined in: [src/lavalink/NodePool.ts:13](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/NodePool.ts#L13)

#### nodeId

> **nodeId**: `string`

#### stats

> **stats**: [`LavalinkNodeStats`](LavalinkNodeStats.md)

***

### node.playerUpdate

> **node.playerUpdate**: `object`

Defined in: [src/lavalink/NodePool.ts:14](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/NodePool.ts#L14)

#### nodeId

> **nodeId**: `string`

#### payload

> **payload**: [`LavalinkPlayerUpdatePayload`](LavalinkPlayerUpdatePayload.md)

***

### node.playerEvent

> **node.playerEvent**: `object`

Defined in: [src/lavalink/NodePool.ts:15](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/NodePool.ts#L15)

#### nodeId

> **nodeId**: `string`

#### payload

> **payload**: [`LavalinkPlayerEvent`](../type-aliases/LavalinkPlayerEvent.md)

***

### node.raw

> **node.raw**: `object`

Defined in: [src/lavalink/NodePool.ts:16](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/NodePool.ts#L16)

#### nodeId

> **nodeId**: `string`

#### payload

> **payload**: `unknown`
