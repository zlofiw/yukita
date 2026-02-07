[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / LavalinkNode

# Class: LavalinkNode

Defined in: [src/lavalink/LavalinkNode.ts:33](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkNode.ts#L33)

Combined REST + WS lavalink node client.

## Constructors

### Constructor

> **new LavalinkNode**(`config`): `LavalinkNode`

Defined in: [src/lavalink/LavalinkNode.ts:46](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkNode.ts#L46)

#### Parameters

##### config

[`LavalinkNodeConfig`](../interfaces/LavalinkNodeConfig.md)

#### Returns

`LavalinkNode`

## Properties

### id

> `readonly` **id**: `string`

Defined in: [src/lavalink/LavalinkNode.ts:34](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkNode.ts#L34)

***

### config

> `readonly` **config**: [`LavalinkNodeConfig`](../interfaces/LavalinkNodeConfig.md)

Defined in: [src/lavalink/LavalinkNode.ts:35](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkNode.ts#L35)

***

### rest

> `readonly` **rest**: [`LavalinkRestClient`](LavalinkRestClient.md)

Defined in: [src/lavalink/LavalinkNode.ts:36](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkNode.ts#L36)

***

### ws

> `readonly` **ws**: [`LavalinkWsClient`](LavalinkWsClient.md)

Defined in: [src/lavalink/LavalinkNode.ts:37](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkNode.ts#L37)

***

### events

> `readonly` **events**: [`AsyncEventBus`](AsyncEventBus.md)\<[`LavalinkNodeEvents`](../interfaces/LavalinkNodeEvents.md)\>

Defined in: [src/lavalink/LavalinkNode.ts:38](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkNode.ts#L38)

***

### state

> **state**: [`LavalinkNodeState`](../type-aliases/LavalinkNodeState.md) = `'idle'`

Defined in: [src/lavalink/LavalinkNode.ts:39](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkNode.ts#L39)

***

### stats

> **stats**: [`LavalinkNodeStats`](../interfaces/LavalinkNodeStats.md) \| `null` = `null`

Defined in: [src/lavalink/LavalinkNode.ts:40](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkNode.ts#L40)

***

### latencyMs

> **latencyMs**: `number` \| `null` = `null`

Defined in: [src/lavalink/LavalinkNode.ts:41](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkNode.ts#L41)

## Accessors

### sessionId

#### Get Signature

> **get** **sessionId**(): `string` \| `null`

Defined in: [src/lavalink/LavalinkNode.ts:57](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkNode.ts#L57)

Last known session id from lavalink websocket.

##### Returns

`string` \| `null`

***

### penalty

#### Get Signature

> **get** **penalty**(): `number`

Defined in: [src/lavalink/LavalinkNode.ts:64](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkNode.ts#L64)

Node penalty score for load-balancing strategies.

##### Returns

`number`

## Methods

### connect()

> **connect**(): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/lavalink/LavalinkNode.ts:84](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkNode.ts#L84)

Opens node connection and waits for ready op.

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### disconnect()

> **disconnect**(): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/lavalink/LavalinkNode.ts:141](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkNode.ts#L141)

Disconnects node.

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [src/lavalink/LavalinkNode.ts:161](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkNode.ts#L161)

Destroys node and frees resources.

#### Returns

`Promise`\<`void`\>
