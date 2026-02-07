[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / LavalinkWsClient

# Class: LavalinkWsClient

Defined in: [src/lavalink/LavalinkWsClient.ts:32](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkWsClient.ts#L32)

Lavalink websocket client with reconnect/backoff support.

## Constructors

### Constructor

> **new LavalinkWsClient**(`config`): `LavalinkWsClient`

Defined in: [src/lavalink/LavalinkWsClient.ts:45](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkWsClient.ts#L45)

#### Parameters

##### config

[`LavalinkNodeConfig`](../interfaces/LavalinkNodeConfig.md)

#### Returns

`LavalinkWsClient`

## Properties

### events

> `readonly` **events**: [`AsyncEventBus`](AsyncEventBus.md)\<[`LavalinkWsEvents`](../interfaces/LavalinkWsEvents.md)\>

Defined in: [src/lavalink/LavalinkWsClient.ts:33](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkWsClient.ts#L33)

## Accessors

### sessionId

#### Get Signature

> **get** **sessionId**(): `string` \| `null`

Defined in: [src/lavalink/LavalinkWsClient.ts:56](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkWsClient.ts#L56)

Last known session id.

##### Returns

`string` \| `null`

## Methods

### connect()

> **connect**(): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/lavalink/LavalinkWsClient.ts:63](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkWsClient.ts#L63)

Opens websocket connection.

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### waitForReady()

> **waitForReady**(`timeoutMs`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`LavalinkReadyPayload`](../interfaces/LavalinkReadyPayload.md)\>\>

Defined in: [src/lavalink/LavalinkWsClient.ts:81](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkWsClient.ts#L81)

Waits for lavalink ready payload.

#### Parameters

##### timeoutMs

`number`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`LavalinkReadyPayload`](../interfaces/LavalinkReadyPayload.md)\>\>

***

### disconnect()

> **disconnect**(): `Promise`\<`void`\>

Defined in: [src/lavalink/LavalinkWsClient.ts:108](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkWsClient.ts#L108)

Closes websocket and disables reconnect.

#### Returns

`Promise`\<`void`\>

***

### destroy()

> **destroy**(): `Promise`\<`void`\>

Defined in: [src/lavalink/LavalinkWsClient.ts:134](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkWsClient.ts#L134)

Destroys websocket client and all listeners.

#### Returns

`Promise`\<`void`\>
