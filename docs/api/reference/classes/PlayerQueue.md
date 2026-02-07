[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / PlayerQueue

# Class: PlayerQueue

Defined in: [src/lavalink/PlayerQueue.ts:7](https://github.com/zlofiw/yukita/blob/main/src/lavalink/PlayerQueue.ts#L7)

Queue model with repeat and mutation operations.

## Constructors

### Constructor

> **new PlayerQueue**(): `PlayerQueue`

#### Returns

`PlayerQueue`

## Accessors

### value

#### Get Signature

> **get** **value**(): readonly [`YukitaTrackModel`](../interfaces/YukitaTrackModel.md)[]

Defined in: [src/lavalink/PlayerQueue.ts:14](https://github.com/zlofiw/yukita/blob/main/src/lavalink/PlayerQueue.ts#L14)

Returns readonly queue items.

##### Returns

readonly [`YukitaTrackModel`](../interfaces/YukitaTrackModel.md)[]

***

### repeat

#### Get Signature

> **get** **repeat**(): [`RepeatMode`](../type-aliases/RepeatMode.md)

Defined in: [src/lavalink/PlayerQueue.ts:21](https://github.com/zlofiw/yukita/blob/main/src/lavalink/PlayerQueue.ts#L21)

Returns current repeat mode.

##### Returns

[`RepeatMode`](../type-aliases/RepeatMode.md)

## Methods

### setRepeat()

> **setRepeat**(`mode`): `void`

Defined in: [src/lavalink/PlayerQueue.ts:28](https://github.com/zlofiw/yukita/blob/main/src/lavalink/PlayerQueue.ts#L28)

Sets repeat mode.

#### Parameters

##### mode

[`RepeatMode`](../type-aliases/RepeatMode.md)

#### Returns

`void`

***

### add()

> **add**(`track`): [`Result`](../type-aliases/Result.md)\<`number`\>

Defined in: [src/lavalink/PlayerQueue.ts:35](https://github.com/zlofiw/yukita/blob/main/src/lavalink/PlayerQueue.ts#L35)

Adds one or more tracks.

#### Parameters

##### track

[`YukitaTrackModel`](../interfaces/YukitaTrackModel.md) | [`YukitaTrackModel`](../interfaces/YukitaTrackModel.md)[]

#### Returns

[`Result`](../type-aliases/Result.md)\<`number`\>

***

### remove()

> **remove**(`index`): [`Result`](../type-aliases/Result.md)\<[`YukitaTrackModel`](../interfaces/YukitaTrackModel.md)\>

Defined in: [src/lavalink/PlayerQueue.ts:44](https://github.com/zlofiw/yukita/blob/main/src/lavalink/PlayerQueue.ts#L44)

Removes track by index.

#### Parameters

##### index

`number`

#### Returns

[`Result`](../type-aliases/Result.md)\<[`YukitaTrackModel`](../interfaces/YukitaTrackModel.md)\>

***

### move()

> **move**(`fromIndex`, `toIndex`): [`Result`](../type-aliases/Result.md)\<`void`\>

Defined in: [src/lavalink/PlayerQueue.ts:65](https://github.com/zlofiw/yukita/blob/main/src/lavalink/PlayerQueue.ts#L65)

Moves track from index to index.

#### Parameters

##### fromIndex

`number`

##### toIndex

`number`

#### Returns

[`Result`](../type-aliases/Result.md)\<`void`\>

***

### clear()

> **clear**(): `void`

Defined in: [src/lavalink/PlayerQueue.ts:93](https://github.com/zlofiw/yukita/blob/main/src/lavalink/PlayerQueue.ts#L93)

Clears queue.

#### Returns

`void`

***

### shuffle()

> **shuffle**(): `void`

Defined in: [src/lavalink/PlayerQueue.ts:100](https://github.com/zlofiw/yukita/blob/main/src/lavalink/PlayerQueue.ts#L100)

Shuffles queue in-place.

#### Returns

`void`

***

### next()

> **next**(`current`): [`YukitaTrackModel`](../interfaces/YukitaTrackModel.md) \| `null`

Defined in: [src/lavalink/PlayerQueue.ts:110](https://github.com/zlofiw/yukita/blob/main/src/lavalink/PlayerQueue.ts#L110)

Consumes next track based on repeat mode.

#### Parameters

##### current

[`YukitaTrackModel`](../interfaces/YukitaTrackModel.md) | `null`

#### Returns

[`YukitaTrackModel`](../interfaces/YukitaTrackModel.md) \| `null`
