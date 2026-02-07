[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / YukitaPlugin

# Interface: YukitaPlugin

Defined in: [src/plugins/types.ts:90](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/types.ts#L90)

## Properties

### name

> **name**: `string`

Defined in: [src/plugins/types.ts:91](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/types.ts#L91)

***

### version

> **version**: `string`

Defined in: [src/plugins/types.ts:92](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/types.ts#L92)

***

### compatibleRange?

> `optional` **compatibleRange**: `string`

Defined in: [src/plugins/types.ts:93](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/types.ts#L93)

***

### init()

> **init**: (`ctx`) => `void` \| [`Result`](../type-aliases/Result.md)\<`void`\> \| `Promise`\<void \| Result\<void\>\>

Defined in: [src/plugins/types.ts:94](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/types.ts#L94)

#### Parameters

##### ctx

[`PluginInitContext`](PluginInitContext.md)

#### Returns

`void` \| [`Result`](../type-aliases/Result.md)\<`void`\> \| `Promise`\<void \| Result\<void\>\>
