[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / PluginHooks

# Interface: PluginHooks

Defined in: [src/plugins/types.ts:52](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/types.ts#L52)

## Properties

### onInit()?

> `optional` **onInit**: () => `void` \| `Promise`\<`void`\>

Defined in: [src/plugins/types.ts:53](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/types.ts#L53)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onShutdown()?

> `optional` **onShutdown**: () => `void` \| `Promise`\<`void`\>

Defined in: [src/plugins/types.ts:54](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/types.ts#L54)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onNodeEvent()?

> `optional` **onNodeEvent**: (`payload`) => `void` \| `Promise`\<`void`\>

Defined in: [src/plugins/types.ts:56](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/types.ts#L56)

#### Parameters

##### payload

[`PluginNodeEvent`](PluginNodeEvent.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onPlayerEvent()?

> `optional` **onPlayerEvent**: (`payload`) => `void` \| `Promise`\<`void`\>

Defined in: [src/plugins/types.ts:57](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/types.ts#L57)

#### Parameters

##### payload

[`PluginPlayerEvent`](PluginPlayerEvent.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onTrackEvent()?

> `optional` **onTrackEvent**: (`payload`) => `void` \| `Promise`\<`void`\>

Defined in: [src/plugins/types.ts:58](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/types.ts#L58)

#### Parameters

##### payload

[`PluginTrackEvent`](PluginTrackEvent.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onQueueEvent()?

> `optional` **onQueueEvent**: (`payload`) => `void` \| `Promise`\<`void`\>

Defined in: [src/plugins/types.ts:59](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/types.ts#L59)

#### Parameters

##### payload

[`PluginQueueEvent`](PluginQueueEvent.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### beforeResolve()?

> `optional` **beforeResolve**: (`payload`) => `void` \| [`BeforeResolvePayload`](BeforeResolvePayload.md) \| [`Result`](../type-aliases/Result.md)\<[`BeforeResolvePayload`](BeforeResolvePayload.md)\> \| `Promise`\<void \| BeforeResolvePayload \| Result\<BeforeResolvePayload\>\>

Defined in: [src/plugins/types.ts:62](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/types.ts#L62)

#### Parameters

##### payload

[`BeforeResolvePayload`](BeforeResolvePayload.md)

#### Returns

`void` \| [`BeforeResolvePayload`](BeforeResolvePayload.md) \| [`Result`](../type-aliases/Result.md)\<[`BeforeResolvePayload`](BeforeResolvePayload.md)\> \| `Promise`\<void \| BeforeResolvePayload \| Result\<BeforeResolvePayload\>\>

***

### afterResolve()?

> `optional` **afterResolve**: (`request`, `result`) => `void` \| [`YukitaResolveModel`](../type-aliases/YukitaResolveModel.md) \| [`Result`](../type-aliases/Result.md)\<[`YukitaResolveModel`](../type-aliases/YukitaResolveModel.md)\> \| `Promise`\<void \| YukitaResolveModel \| Result\<YukitaResolveModel\>\>

Defined in: [src/plugins/types.ts:65](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/types.ts#L65)

#### Parameters

##### request

[`BeforeResolvePayload`](BeforeResolvePayload.md)

##### result

[`YukitaResolveModel`](../type-aliases/YukitaResolveModel.md)

#### Returns

`void` \| [`YukitaResolveModel`](../type-aliases/YukitaResolveModel.md) \| [`Result`](../type-aliases/Result.md)\<[`YukitaResolveModel`](../type-aliases/YukitaResolveModel.md)\> \| `Promise`\<void \| YukitaResolveModel \| Result\<YukitaResolveModel\>\>

***

### beforePlay()?

> `optional` **beforePlay**: (`payload`) => `void` \| [`BeforePlayPayload`](BeforePlayPayload.md) \| [`Result`](../type-aliases/Result.md)\<[`BeforePlayPayload`](BeforePlayPayload.md)\> \| `Promise`\<void \| BeforePlayPayload \| Result\<BeforePlayPayload\>\>

Defined in: [src/plugins/types.ts:69](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/types.ts#L69)

#### Parameters

##### payload

[`BeforePlayPayload`](BeforePlayPayload.md)

#### Returns

`void` \| [`BeforePlayPayload`](BeforePlayPayload.md) \| [`Result`](../type-aliases/Result.md)\<[`BeforePlayPayload`](BeforePlayPayload.md)\> \| `Promise`\<void \| BeforePlayPayload \| Result\<BeforePlayPayload\>\>

***

### afterPlay()?

> `optional` **afterPlay**: (`payload`) => `void` \| [`Result`](../type-aliases/Result.md)\<`void`\> \| `Promise`\<void \| Result\<void\>\>

Defined in: [src/plugins/types.ts:72](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/types.ts#L72)

#### Parameters

##### payload

[`BeforePlayPayload`](BeforePlayPayload.md)

#### Returns

`void` \| [`Result`](../type-aliases/Result.md)\<`void`\> \| `Promise`\<void \| Result\<void\>\>

***

### onRestRequest()?

> `optional` **onRestRequest**: (`ctx`) => `void` \| `Promise`\<`void`\>

Defined in: [src/plugins/types.ts:75](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/types.ts#L75)

#### Parameters

##### ctx

[`RestRequestContext`](RestRequestContext.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onRestResponse()?

> `optional` **onRestResponse**: \<`T`\>(`ctx`, `res`) => `void` \| `Promise`\<`void`\>

Defined in: [src/plugins/types.ts:76](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/types.ts#L76)

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

### onRestError()?

> `optional` **onRestError**: (`ctx`, `error`) => `void` \| `Promise`\<`void`\>

Defined in: [src/plugins/types.ts:77](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/types.ts#L77)

#### Parameters

##### ctx

[`RestRequestContext`](RestRequestContext.md)

##### error

[`LavalinkResponseError`](LavalinkResponseError.md)

#### Returns

`void` \| `Promise`\<`void`\>
