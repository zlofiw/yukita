[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / LavalinkRestClientHooks

# Interface: LavalinkRestClientHooks

Defined in: [src/lavalink/LavalinkRestClient.ts:22](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkRestClient.ts#L22)

## Properties

### onRequest()?

> `optional` **onRequest**: (`ctx`) => `void` \| `Promise`\<`void`\>

Defined in: [src/lavalink/LavalinkRestClient.ts:23](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkRestClient.ts#L23)

#### Parameters

##### ctx

[`RestRequestContext`](RestRequestContext.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onResponse()?

> `optional` **onResponse**: \<`T`\>(`ctx`, `res`) => `void` \| `Promise`\<`void`\>

Defined in: [src/lavalink/LavalinkRestClient.ts:24](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkRestClient.ts#L24)

#### Type Parameters

##### T

`T`

#### Parameters

##### ctx

[`RestResponseContext`](RestResponseContext.md)\<`T`\>

##### res

[`LavalinkResponse`](../type-aliases/LavalinkResponse.md)\<`T`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onError()?

> `optional` **onError**: (`ctx`, `error`) => `void` \| `Promise`\<`void`\>

Defined in: [src/lavalink/LavalinkRestClient.ts:25](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/LavalinkRestClient.ts#L25)

#### Parameters

##### ctx

[`RestRequestContext`](RestRequestContext.md)

##### error

[`LavalinkResponseError`](LavalinkResponseError.md)

#### Returns

`void` \| `Promise`\<`void`\>
