[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / YukitaSan

# Class: YukitaSan

Defined in: [src/YukitaSan.ts:51](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L51)

Main orchestration class for nodes, players, resolve and plugins.

## Constructors

### Constructor

> **new YukitaSan**(`options`): `YukitaSan`

Defined in: [src/YukitaSan.ts:65](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L65)

#### Parameters

##### options

[`YukitaSanOptions`](../interfaces/YukitaSanOptions.md)

#### Returns

`YukitaSan`

## Properties

### nodePool

> `readonly` **nodePool**: [`NodePool`](NodePool.md)

Defined in: [src/YukitaSan.ts:52](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L52)

***

### connector

> `readonly` **connector**: [`Connector`](../interfaces/Connector.md) \| `null`

Defined in: [src/YukitaSan.ts:53](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L53)

***

### events

> `readonly` **events**: [`AsyncEventBus`](AsyncEventBus.md)\<[`YukitaSanEvents`](../interfaces/YukitaSanEvents.md)\>

Defined in: [src/YukitaSan.ts:54](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L54)

***

### extensions

> `readonly` **extensions**: [`ExtensionsMap`](../type-aliases/ExtensionsMap.md)

Defined in: [src/YukitaSan.ts:55](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L55)

***

### plugins

> `readonly` **plugins**: `Map`\<`string`, [`YukitaPlugin`](../interfaces/YukitaPlugin.md)\>

Defined in: [src/YukitaSan.ts:56](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L56)

## Methods

### start()

> **start**(): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/YukitaSan.ts:80](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L80)

Starts node connections.

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### shutdown()

> **shutdown**(): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/YukitaSan.ts:107](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L107)

Gracefully stops client and all nodes.

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### on()

> **on**\<`TKey`\>(`event`, `listener`): () => `void`

Defined in: [src/YukitaSan.ts:155](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L155)

Registers listener and returns unsubscribe function.

#### Type Parameters

##### TKey

`TKey` *extends* keyof [`YukitaSanEvents`](../interfaces/YukitaSanEvents.md)

#### Parameters

##### event

`TKey`

##### listener

(`payload`) => `void` \| `Promise`\<`void`\>

#### Returns

> (): `void`

##### Returns

`void`

***

### use()

> **use**(`plugin`): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/YukitaSan.ts:165](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L165)

Installs plugin with compatibility check.

#### Parameters

##### plugin

[`YukitaPlugin`](../interfaces/YukitaPlugin.md)

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### getExtension()

> **getExtension**\<`TApi`\>(`namespace`): [`Result`](../type-aliases/Result.md)\<`TApi`\>

Defined in: [src/YukitaSan.ts:231](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L231)

Retrieves plugin extension namespace.

#### Type Parameters

##### TApi

`TApi` *extends* `object`

#### Parameters

##### namespace

`string`

#### Returns

[`Result`](../type-aliases/Result.md)\<`TApi`\>

***

### createPlayer()

> **createPlayer**(`contextId`, `input`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`YukitaPlayer`](YukitaPlayer.md)\>\>

Defined in: [src/YukitaSan.ts:248](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L248)

Creates player for context.

#### Parameters

##### contextId

`string`

##### input

[`CreatePlayerOptions`](../interfaces/CreatePlayerOptions.md)

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`YukitaPlayer`](YukitaPlayer.md)\>\>

***

### getPlayer()

> **getPlayer**(`contextId`): [`Result`](../type-aliases/Result.md)\<[`YukitaPlayer`](YukitaPlayer.md)\>

Defined in: [src/YukitaSan.ts:286](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L286)

Gets player by context id.

#### Parameters

##### contextId

`string`

#### Returns

[`Result`](../type-aliases/Result.md)\<[`YukitaPlayer`](YukitaPlayer.md)\>

***

### listPlayers()

> **listPlayers**(): [`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)[]

Defined in: [src/YukitaSan.ts:303](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L303)

Returns snapshots of all known players.

#### Returns

[`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)[]

***

### destroyPlayer()

> **destroyPlayer**(`contextId`): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/YukitaSan.ts:310](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L310)

Destroys player by context id.

#### Parameters

##### contextId

`string`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### resolve()

> **resolve**(`contextId`, `query`, `options?`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`ResolveOutput`](../interfaces/ResolveOutput.md)\>\>

Defined in: [src/YukitaSan.ts:335](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L335)

Resolves query/url through selected node.

#### Parameters

##### contextId

`string`

##### query

`string`

##### options?

[`ResolveOptions`](../interfaces/ResolveOptions.md) = `{}`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`ResolveOutput`](../interfaces/ResolveOutput.md)\>\>

***

### play()

> **play**(`contextId`, `input`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)\>\>

Defined in: [src/YukitaSan.ts:453](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L453)

Resolves and starts playback or uses provided track.

#### Parameters

##### contextId

`string`

##### input

[`PlayInput`](../interfaces/PlayInput.md)

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)\>\>

***

### queueAdd()

> **queueAdd**(`contextId`, `input`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)\>\>

Defined in: [src/YukitaSan.ts:536](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L536)

Adds query/track to queue.

#### Parameters

##### contextId

`string`

##### input

[`PlayInput`](../interfaces/PlayInput.md)

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)\>\>

***

### pause()

> **pause**(`contextId`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)\>\>

Defined in: [src/YukitaSan.ts:595](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L595)

Pauses current player.

#### Parameters

##### contextId

`string`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)\>\>

***

### resume()

> **resume**(`contextId`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)\>\>

Defined in: [src/YukitaSan.ts:602](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L602)

Resumes current player.

#### Parameters

##### contextId

`string`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)\>\>

***

### stop()

> **stop**(`contextId`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)\>\>

Defined in: [src/YukitaSan.ts:609](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L609)

Stops current player.

#### Parameters

##### contextId

`string`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)\>\>

***

### seek()

> **seek**(`contextId`, `positionMs`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)\>\>

Defined in: [src/YukitaSan.ts:616](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L616)

Seeks current track.

#### Parameters

##### contextId

`string`

##### positionMs

`number`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)\>\>

***

### setVolume()

> **setVolume**(`contextId`, `volume`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)\>\>

Defined in: [src/YukitaSan.ts:623](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L623)

Sets player volume.

#### Parameters

##### contextId

`string`

##### volume

`number`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)\>\>

***

### applyFilters()

> **applyFilters**(`contextId`, `filters`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)\>\>

Defined in: [src/YukitaSan.ts:630](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L630)

Applies player filters.

#### Parameters

##### contextId

`string`

##### filters

[`LavalinkFilters`](../interfaces/LavalinkFilters.md)

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)\>\>

***

### clearFilters()

> **clearFilters**(`contextId`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)\>\>

Defined in: [src/YukitaSan.ts:637](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L637)

Clears player filters.

#### Parameters

##### contextId

`string`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)\>\>

***

### queueRemove()

> **queueRemove**(`contextId`, `index`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)\>\>

Defined in: [src/YukitaSan.ts:644](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L644)

Removes queue track.

#### Parameters

##### contextId

`string`

##### index

`number`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)\>\>

***

### queueMove()

> **queueMove**(`contextId`, `fromIndex`, `toIndex`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)\>\>

Defined in: [src/YukitaSan.ts:651](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L651)

Moves queue track.

#### Parameters

##### contextId

`string`

##### fromIndex

`number`

##### toIndex

`number`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)\>\>

***

### queueClear()

> **queueClear**(`contextId`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)\>\>

Defined in: [src/YukitaSan.ts:658](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L658)

Clears queue.

#### Parameters

##### contextId

`string`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)\>\>

***

### queueShuffle()

> **queueShuffle**(`contextId`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)\>\>

Defined in: [src/YukitaSan.ts:665](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L665)

Shuffles queue.

#### Parameters

##### contextId

`string`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)\>\>

***

### applyVoiceStateUpdate()

> **applyVoiceStateUpdate**(`input`): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/YukitaSan.ts:672](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L672)

Applies voice state updates from external connector.

#### Parameters

##### input

[`VoiceStateUpdate`](../interfaces/VoiceStateUpdate.md)

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### applyVoiceServerUpdate()

> **applyVoiceServerUpdate**(`input`): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/YukitaSan.ts:691](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L691)

Applies voice server updates from external connector.

#### Parameters

##### input

[`VoiceServerUpdate`](../interfaces/VoiceServerUpdate.md)

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### emitOrdered()

> **emitOrdered**\<`TKey`\>(`contextId`, `event`, `payload`): `Promise`\<`void`\>

Defined in: [src/YukitaSan.ts:708](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L708)

Emits event ordered per context id.

#### Type Parameters

##### TKey

`TKey` *extends* keyof [`YukitaSanEvents`](../interfaces/YukitaSanEvents.md)

#### Parameters

##### contextId

`string`

##### event

`TKey`

##### payload

[`YukitaSanEvents`](../interfaces/YukitaSanEvents.md)\[`TKey`\]

#### Returns

`Promise`\<`void`\>

***

### runBeforePlay()

> **runBeforePlay**(`payload`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`BeforePlayPayload`](../interfaces/BeforePlayPayload.md)\>\>

Defined in: [src/YukitaSan.ts:733](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L733)

Runs before-play plugin hooks.

#### Parameters

##### payload

[`BeforePlayPayload`](../interfaces/BeforePlayPayload.md)

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`BeforePlayPayload`](../interfaces/BeforePlayPayload.md)\>\>

***

### runAfterPlay()

> **runAfterPlay**(`payload`): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/YukitaSan.ts:753](https://github.com/zlofiw/yukita/blob/main/src/YukitaSan.ts#L753)

Runs after-play plugin hooks.

#### Parameters

##### payload

[`BeforePlayPayload`](../interfaces/BeforePlayPayload.md)

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>
