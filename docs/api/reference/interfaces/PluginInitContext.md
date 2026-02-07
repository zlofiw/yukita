[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / PluginInitContext

# Interface: PluginInitContext

Defined in: [src/plugins/types.ts:80](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/types.ts#L80)

## Properties

### coreVersion

> **coreVersion**: `string`

Defined in: [src/plugins/types.ts:81](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/types.ts#L81)

***

### logger

> **logger**: [`PluginLogger`](PluginLogger.md)

Defined in: [src/plugins/types.ts:82](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/types.ts#L82)

***

### client

> **client**: [`YukitaSan`](../classes/YukitaSan.md)

Defined in: [src/plugins/types.ts:83](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/types.ts#L83)

***

### registerHooks()

> **registerHooks**: (`hooks`) => `void`

Defined in: [src/plugins/types.ts:85](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/types.ts#L85)

#### Parameters

##### hooks

[`PluginHooks`](PluginHooks.md)

#### Returns

`void`

***

### extendApi()

> **extendApi**: \<`TApi`\>(`namespace`, `api`) => [`Result`](../type-aliases/Result.md)\<`void`\>

Defined in: [src/plugins/types.ts:87](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/types.ts#L87)

#### Type Parameters

##### TApi

`TApi` *extends* `object`

#### Parameters

##### namespace

`string`

##### api

`TApi`

#### Returns

[`Result`](../type-aliases/Result.md)\<`void`\>
