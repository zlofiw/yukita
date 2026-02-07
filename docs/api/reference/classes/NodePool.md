[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / NodePool

# Class: NodePool

Defined in: [src/lavalink/NodePool.ts:22](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/NodePool.ts#L22)

Multi-node manager with selection and failover helpers.

## Constructors

### Constructor

> **new NodePool**(`input`): `NodePool`

Defined in: [src/lavalink/NodePool.ts:28](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/NodePool.ts#L28)

#### Parameters

##### input

###### nodes

[`LavalinkNodeConfig`](../interfaces/LavalinkNodeConfig.md)[]

###### strategy

[`NodeSelectionStrategy`](../type-aliases/NodeSelectionStrategy.md)

#### Returns

`NodePool`

## Properties

### events

> `readonly` **events**: [`AsyncEventBus`](AsyncEventBus.md)\<[`NodePoolEvents`](../interfaces/NodePoolEvents.md)\>

Defined in: [src/lavalink/NodePool.ts:23](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/NodePool.ts#L23)

## Methods

### setStrategy()

> **setStrategy**(`strategy`): `void`

Defined in: [src/lavalink/NodePool.ts:40](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/NodePool.ts#L40)

Sets default selection strategy.

#### Parameters

##### strategy

[`NodeSelectionStrategy`](../type-aliases/NodeSelectionStrategy.md)

#### Returns

`void`

***

### listNodes()

> **listNodes**(): [`LavalinkNode`](LavalinkNode.md)[]

Defined in: [src/lavalink/NodePool.ts:47](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/NodePool.ts#L47)

Returns shallow copy of all nodes.

#### Returns

[`LavalinkNode`](LavalinkNode.md)[]

***

### getNode()

> **getNode**(`nodeId`): [`LavalinkNode`](LavalinkNode.md) \| `undefined`

Defined in: [src/lavalink/NodePool.ts:54](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/NodePool.ts#L54)

Gets node by id.

#### Parameters

##### nodeId

`string`

#### Returns

[`LavalinkNode`](LavalinkNode.md) \| `undefined`

***

### connectAll()

> **connectAll**(): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/lavalink/NodePool.ts:61](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/NodePool.ts#L61)

Connects all configured nodes.

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### addNode()

> **addNode**(`config`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`LavalinkNode`](LavalinkNode.md)\>\>

Defined in: [src/lavalink/NodePool.ts:81](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/NodePool.ts#L81)

Adds node at runtime.

#### Parameters

##### config

[`LavalinkNodeConfig`](../interfaces/LavalinkNodeConfig.md)

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`LavalinkNode`](LavalinkNode.md)\>\>

***

### removeNode()

> **removeNode**(`nodeId`): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/lavalink/NodePool.ts:105](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/NodePool.ts#L105)

Removes and destroys node.

#### Parameters

##### nodeId

`string`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### select()

> **select**(`input?`): [`Result`](../type-aliases/Result.md)\<[`LavalinkNode`](LavalinkNode.md)\>

Defined in: [src/lavalink/NodePool.ts:125](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/NodePool.ts#L125)

Selects best available node.

#### Parameters

##### input?

[`NodeSelectionRequest`](../interfaces/NodeSelectionRequest.md) = `{}`

#### Returns

[`Result`](../type-aliases/Result.md)\<[`LavalinkNode`](LavalinkNode.md)\>

***

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [src/lavalink/NodePool.ts:217](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/NodePool.ts#L217)

Destroys all nodes and clears listeners.

#### Returns

`Promise`\<`void`\>
