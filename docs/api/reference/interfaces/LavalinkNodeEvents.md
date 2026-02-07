[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / LavalinkNodeEvents

# Interface: LavalinkNodeEvents

Defined in: [src/lavalink/LavalinkNode.ts:20](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkNode.ts#L20)

Public events emitted by a node wrapper.

## Properties

### connected

> **connected**: `object`

Defined in: [src/lavalink/LavalinkNode.ts:21](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkNode.ts#L21)

#### nodeId

> **nodeId**: `string`

#### resumed

> **resumed**: `boolean`

***

### disconnected

> **disconnected**: `object`

Defined in: [src/lavalink/LavalinkNode.ts:22](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkNode.ts#L22)

#### nodeId

> **nodeId**: `string`

#### code

> **code**: `number`

#### reason

> **reason**: `string`

***

### error

> **error**: `object`

Defined in: [src/lavalink/LavalinkNode.ts:23](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkNode.ts#L23)

#### nodeId

> **nodeId**: `string`

#### error

> **error**: `Error`

***

### stats

> **stats**: `object`

Defined in: [src/lavalink/LavalinkNode.ts:24](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkNode.ts#L24)

#### nodeId

> **nodeId**: `string`

#### stats

> **stats**: [`LavalinkNodeStats`](LavalinkNodeStats.md)

***

### playerUpdate

> **playerUpdate**: `object`

Defined in: [src/lavalink/LavalinkNode.ts:25](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkNode.ts#L25)

#### nodeId

> **nodeId**: `string`

#### payload

> **payload**: [`LavalinkPlayerUpdatePayload`](LavalinkPlayerUpdatePayload.md)

***

### playerEvent

> **playerEvent**: `object`

Defined in: [src/lavalink/LavalinkNode.ts:26](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkNode.ts#L26)

#### nodeId

> **nodeId**: `string`

#### payload

> **payload**: [`LavalinkPlayerEvent`](../type-aliases/LavalinkPlayerEvent.md)

***

### raw

> **raw**: `object`

Defined in: [src/lavalink/LavalinkNode.ts:27](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkNode.ts#L27)

#### nodeId

> **nodeId**: `string`

#### payload

> **payload**: `unknown`
