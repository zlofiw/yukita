[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / YukitaPlayer

# Class: YukitaPlayer

Defined in: [src/lavalink/Player.ts:27](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L27)

Playback unit scoped to single `contextId`.

## Constructors

### Constructor

> **new YukitaPlayer**(`input`): `YukitaPlayer`

Defined in: [src/lavalink/Player.ts:43](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L43)

#### Parameters

##### input

###### client

[`YukitaSan`](YukitaSan.md)

###### contextId

`string`

###### guildId

`string`

###### shardId

`number`

###### nodeId

`string`

###### initialChannelId?

`string`

#### Returns

`YukitaPlayer`

## Properties

### contextId

> `readonly` **contextId**: `string`

Defined in: [src/lavalink/Player.ts:28](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L28)

***

### guildId

> `readonly` **guildId**: `string`

Defined in: [src/lavalink/Player.ts:29](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L29)

***

### queue

> `readonly` **queue**: [`PlayerQueue`](PlayerQueue.md)

Defined in: [src/lavalink/Player.ts:30](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L30)

***

### voice

> `readonly` **voice**: [`PlayerVoiceState`](../interfaces/PlayerVoiceState.md)

Defined in: [src/lavalink/Player.ts:31](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L31)

## Accessors

### currentNodeId

#### Get Signature

> **get** **currentNodeId**(): `string`

Defined in: [src/lavalink/Player.ts:89](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L89)

Current node id of this player.

##### Returns

`string`

## Methods

### snapshot()

> **snapshot**(): [`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)

Defined in: [src/lavalink/Player.ts:70](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L70)

Returns immutable snapshot of player state.

#### Returns

[`PlayerSnapshot`](../interfaces/PlayerSnapshot.md)

***

### connect()

> **connect**(`channelId`, `options?`): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/lavalink/Player.ts:96](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L96)

Requests Discord voice join/move via connector (Opcode 4).

#### Parameters

##### channelId

`string`

##### options?

###### selfMute?

`boolean`

###### selfDeaf?

`boolean`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### disconnect()

> **disconnect**(`options?`): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/lavalink/Player.ts:135](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L135)

Requests Discord voice leave via connector (Opcode 4).

#### Parameters

##### options?

###### selfMute?

`boolean`

###### selfDeaf?

`boolean`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### applyVoiceState()

> **applyVoiceState**(`input`): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/lavalink/Player.ts:174](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L174)

Updates player voice state from connector.

#### Parameters

##### input

###### channelId

`string` \| `null`

###### sessionId

`string`

###### shardId

`number`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### applyVoiceServer()

> **applyVoiceServer**(`input`): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/lavalink/Player.ts:200](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L200)

Updates player voice server payload from connector.

#### Parameters

##### input

###### token

`string`

###### endpoint

`string`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### addToQueue()

> **addToQueue**(`track`): `Promise`\<[`Result`](../type-aliases/Result.md)\<`number`\>\>

Defined in: [src/lavalink/Player.ts:213](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L213)

Adds tracks to queue.

#### Parameters

##### track

[`YukitaTrackModel`](../interfaces/YukitaTrackModel.md) | [`YukitaTrackModel`](../interfaces/YukitaTrackModel.md)[]

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`number`\>\>

***

### removeFromQueue()

> **removeFromQueue**(`index`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`YukitaTrackModel`](../interfaces/YukitaTrackModel.md)\>\>

Defined in: [src/lavalink/Player.ts:229](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L229)

Removes track from queue by index.

#### Parameters

##### index

`number`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`YukitaTrackModel`](../interfaces/YukitaTrackModel.md)\>\>

***

### moveQueue()

> **moveQueue**(`fromIndex`, `toIndex`): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/lavalink/Player.ts:245](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L245)

Moves queue item.

#### Parameters

##### fromIndex

`number`

##### toIndex

`number`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### clearQueue()

> **clearQueue**(): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/lavalink/Player.ts:261](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L261)

Clears queue.

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### shuffleQueue()

> **shuffleQueue**(): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/lavalink/Player.ts:274](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L274)

Shuffles queue.

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### setRepeatMode()

> **setRepeatMode**(`mode`): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/lavalink/Player.ts:287](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L287)

Sets repeat mode.

#### Parameters

##### mode

[`RepeatMode`](../type-aliases/RepeatMode.md)

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### playTrack()

> **playTrack**(`track`, `options?`): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/lavalink/Player.ts:300](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L300)

Plays explicit track.

#### Parameters

##### track

[`YukitaTrackModel`](../interfaces/YukitaTrackModel.md)

##### options?

[`PlayTrackOptions`](../interfaces/PlayTrackOptions.md) = `{}`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### playNext()

> **playNext**(): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`YukitaTrackModel`](../interfaces/YukitaTrackModel.md) \| `null`\>\>

Defined in: [src/lavalink/Player.ts:360](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L360)

Plays next queue item according to repeat mode.

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`YukitaTrackModel`](../interfaces/YukitaTrackModel.md) \| `null`\>\>

***

### pause()

> **pause**(): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/lavalink/Player.ts:384](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L384)

Pauses playback.

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### resume()

> **resume**(): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/lavalink/Player.ts:401](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L401)

Resumes playback.

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### stop()

> **stop**(): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/lavalink/Player.ts:418](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L418)

Stops playback.

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### seek()

> **seek**(`positionMs`): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/lavalink/Player.ts:441](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L441)

Seeks current track.

#### Parameters

##### positionMs

`number`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### setVolume()

> **setVolume**(`volume`): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/lavalink/Player.ts:458](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L458)

Sets output volume.

#### Parameters

##### volume

`number`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### applyFilters()

> **applyFilters**(`filters`): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/lavalink/Player.ts:475](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L475)

Applies filter payload.

#### Parameters

##### filters

[`LavalinkFilters`](../interfaces/LavalinkFilters.md)

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### clearFilters()

> **clearFilters**(): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/lavalink/Player.ts:492](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L492)

Clears active filters.

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### onPlayerUpdate()

> **onPlayerUpdate**(`payload`): `Promise`\<[`Result`](../type-aliases/Result.md)\<[`PlaybackTelemetry`](../interfaces/PlaybackTelemetry.md)\>\>

Defined in: [src/lavalink/Player.ts:509](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L509)

Handles player telemetry from node events.

#### Parameters

##### payload

[`LavalinkPlayerUpdatePayload`](../interfaces/LavalinkPlayerUpdatePayload.md)

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<[`PlaybackTelemetry`](../interfaces/PlaybackTelemetry.md)\>\>

***

### onPlayerEvent()

> **onPlayerEvent**(`payload`): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/lavalink/Player.ts:530](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L530)

Handles track-related lavalink events.

#### Parameters

##### payload

[`LavalinkPlayerEvent`](../type-aliases/LavalinkPlayerEvent.md)

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### migrateToNode()

> **migrateToNode**(`targetNodeId`): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/lavalink/Player.ts:590](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L590)

Moves player state to another node after failover.

#### Parameters

##### targetNodeId

`string`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### resync()

> **resync**(): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/lavalink/Player.ts:631](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L631)

Re-sends current voice/track state to the current node (used after resume=false reconnects).

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### destroy()

> **destroy**(): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/lavalink/Player.ts:664](https://github.com/zlofiw/yukita/blob/main/src/lavalink/Player.ts#L664)

Destroys player on remote node and releases resources.

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>
