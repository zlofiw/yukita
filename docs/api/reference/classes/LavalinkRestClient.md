[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / LavalinkRestClient

# Class: LavalinkRestClient

Defined in: [src/lavalink/LavalinkRestClient.ts:34](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkRestClient.ts#L34)

REST client for Lavalink v4.

- `/v4/*` endpoints: baseUrl
- `/version` endpoint: rootUrl (unprefixed)

## Constructors

### Constructor

> **new LavalinkRestClient**(`config`): `LavalinkRestClient`

Defined in: [src/lavalink/LavalinkRestClient.ts:47](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkRestClient.ts#L47)

#### Parameters

##### config

[`LavalinkNodeConfig`](../interfaces/LavalinkNodeConfig.md)

#### Returns

`LavalinkRestClient`

## Methods

### setHooks()

> **setHooks**(`hooks`): `void`

Defined in: [src/lavalink/LavalinkRestClient.ts:61](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkRestClient.ts#L61)

#### Parameters

##### hooks

[`LavalinkRestClientHooks`](../interfaces/LavalinkRestClientHooks.md) | `null`

#### Returns

`void`

***

### getVersion()

> **getVersion**(): `Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<`string`\>\>

Defined in: [src/lavalink/LavalinkRestClient.ts:68](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkRestClient.ts#L68)

`/version` (unprefixed) - returns Lavalink version string.

#### Returns

`Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<`string`\>\>

***

### getInfo()

> **getInfo**(): `Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<[`JsonValue`](../type-aliases/JsonValue.md)\>\>

Defined in: [src/lavalink/LavalinkRestClient.ts:81](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkRestClient.ts#L81)

`/v4/info`

#### Returns

`Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<[`JsonValue`](../type-aliases/JsonValue.md)\>\>

***

### getStats()

> **getStats**(): `Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<[`LavalinkNodeStats`](../interfaces/LavalinkNodeStats.md)\>\>

Defined in: [src/lavalink/LavalinkRestClient.ts:92](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkRestClient.ts#L92)

`/v4/stats`

#### Returns

`Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<[`LavalinkNodeStats`](../interfaces/LavalinkNodeStats.md)\>\>

***

### resolve()

> **resolve**(`identifier`): `Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<[`LavalinkLoadResult`](../type-aliases/LavalinkLoadResult.md)\>\>

Defined in: [src/lavalink/LavalinkRestClient.ts:103](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkRestClient.ts#L103)

`/v4/loadtracks`

#### Parameters

##### identifier

`string`

#### Returns

`Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<[`LavalinkLoadResult`](../type-aliases/LavalinkLoadResult.md)\>\>

***

### decodeTrack()

> **decodeTrack**(`encodedTrack`): `Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<[`LavalinkTrack`](../interfaces/LavalinkTrack.md)\>\>

Defined in: [src/lavalink/LavalinkRestClient.ts:114](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkRestClient.ts#L114)

`/v4/decodetrack`

#### Parameters

##### encodedTrack

`string`

#### Returns

`Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<[`LavalinkTrack`](../interfaces/LavalinkTrack.md)\>\>

***

### decodeTracks()

> **decodeTracks**(`encodedTracks`): `Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<[`LavalinkTrack`](../interfaces/LavalinkTrack.md)[]\>\>

Defined in: [src/lavalink/LavalinkRestClient.ts:125](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkRestClient.ts#L125)

`/v4/decodetracks`

#### Parameters

##### encodedTracks

`string`[]

#### Returns

`Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<[`LavalinkTrack`](../interfaces/LavalinkTrack.md)[]\>\>

***

### updatePlayer()

> **updatePlayer**(`input`): `Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<[`LavalinkPlayer`](../interfaces/LavalinkPlayer.md)\>\>

Defined in: [src/lavalink/LavalinkRestClient.ts:140](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkRestClient.ts#L140)

`/v4/sessions/{sessionId}/players/{guildId}`

#### Parameters

##### input

###### sessionId

`string`

###### guildId

`string`

###### noReplace?

`boolean`

###### payload

[`LavalinkUpdatePlayer`](../interfaces/LavalinkUpdatePlayer.md)

#### Returns

`Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<[`LavalinkPlayer`](../interfaces/LavalinkPlayer.md)\>\>

***

### getPlayers()

> **getPlayers**(`sessionId`): `Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<[`LavalinkPlayer`](../interfaces/LavalinkPlayer.md)[]\>\>

Defined in: [src/lavalink/LavalinkRestClient.ts:162](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkRestClient.ts#L162)

`/v4/sessions/{sessionId}/players`

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<[`LavalinkPlayer`](../interfaces/LavalinkPlayer.md)[]\>\>

***

### getPlayer()

> **getPlayer**(`input`): `Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<[`LavalinkPlayer`](../interfaces/LavalinkPlayer.md)\>\>

Defined in: [src/lavalink/LavalinkRestClient.ts:173](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkRestClient.ts#L173)

`/v4/sessions/{sessionId}/players/{guildId}`

#### Parameters

##### input

###### sessionId

`string`

###### guildId

`string`

#### Returns

`Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<[`LavalinkPlayer`](../interfaces/LavalinkPlayer.md)\>\>

***

### destroyPlayer()

> **destroyPlayer**(`input`): `Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<`void`\>\>

Defined in: [src/lavalink/LavalinkRestClient.ts:184](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkRestClient.ts#L184)

`/v4/sessions/{sessionId}/players/{guildId}`

#### Parameters

##### input

###### sessionId

`string`

###### guildId

`string`

#### Returns

`Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<`void`\>\>

***

### updateSession()

> **updateSession**(`input`): `Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<[`LavalinkSession`](../interfaces/LavalinkSession.md)\>\>

Defined in: [src/lavalink/LavalinkRestClient.ts:196](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkRestClient.ts#L196)

`/v4/sessions/{sessionId}`

#### Parameters

##### input

###### sessionId

`string`

###### resuming

`boolean`

###### timeoutMs

`number`

#### Returns

`Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<[`LavalinkSession`](../interfaces/LavalinkSession.md)\>\>

***

### getRoutePlannerStatus()

> **getRoutePlannerStatus**(): `Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<[`LavalinkRoutePlannerStatus`](../interfaces/LavalinkRoutePlannerStatus.md) \| `null`\>\>

Defined in: [src/lavalink/LavalinkRestClient.ts:219](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkRestClient.ts#L219)

`/v4/routeplanner/status`

#### Returns

`Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<[`LavalinkRoutePlannerStatus`](../interfaces/LavalinkRoutePlannerStatus.md) \| `null`\>\>

***

### unmarkFailedAddress()

> **unmarkFailedAddress**(`address`): `Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<`void`\>\>

Defined in: [src/lavalink/LavalinkRestClient.ts:234](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkRestClient.ts#L234)

`/v4/routeplanner/free/address`

#### Parameters

##### address

`string`

#### Returns

`Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<`void`\>\>

***

### unmarkAllFailedAddresses()

> **unmarkAllFailedAddresses**(): `Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<`void`\>\>

Defined in: [src/lavalink/LavalinkRestClient.ts:250](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkRestClient.ts#L250)

`/v4/routeplanner/free/all`

#### Returns

`Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<`void`\>\>

***

### raw()

> **raw**\<`T`\>(`input`): `Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<`T`\>\>

Defined in: [src/lavalink/LavalinkRestClient.ts:262](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkRestClient.ts#L262)

Low-level request helper for full REST coverage (escape hatch).

#### Type Parameters

##### T

`T` = [`JsonValue`](../type-aliases/JsonValue.md)

#### Parameters

##### input

###### path

`string`

###### method

`string`

###### headers?

`Record`\<`string`, `string`\>

###### body?

`string`

###### expect?

[`RequestExpectation`](../type-aliases/RequestExpectation.md)

###### idempotent?

`boolean`

#### Returns

`Promise`\<[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<`T`\>\>
