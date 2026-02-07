[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / ResolveCachePlugin

# Class: ResolveCachePlugin

Defined in: [src/plugins/resolve-cache.ts:32](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/resolve-cache.ts#L32)

Resolve cache plugin using before/after resolve hooks.

## Implements

- [`YukitaPlugin`](../interfaces/YukitaPlugin.md)

## Constructors

### Constructor

> **new ResolveCachePlugin**(`options?`): `ResolveCachePlugin`

Defined in: [src/plugins/resolve-cache.ts:44](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/resolve-cache.ts#L44)

#### Parameters

##### options?

[`ResolveCachePluginOptions`](../interfaces/ResolveCachePluginOptions.md) = `{}`

#### Returns

`ResolveCachePlugin`

## Properties

### name

> `readonly` **name**: `"resolve-cache"` = `'resolve-cache'`

Defined in: [src/plugins/resolve-cache.ts:33](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/resolve-cache.ts#L33)

#### Implementation of

[`YukitaPlugin`](../interfaces/YukitaPlugin.md).[`name`](../interfaces/YukitaPlugin.md#name)

***

### version

> `readonly` **version**: `"0.1.0"` = `CORE_VERSION`

Defined in: [src/plugins/resolve-cache.ts:34](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/resolve-cache.ts#L34)

#### Implementation of

[`YukitaPlugin`](../interfaces/YukitaPlugin.md).[`version`](../interfaces/YukitaPlugin.md#version)

***

### compatibleRange

> `readonly` **compatibleRange**: `"^0.1.0"` = `CORE_COMPATIBLE_RANGE`

Defined in: [src/plugins/resolve-cache.ts:35](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/resolve-cache.ts#L35)

#### Implementation of

[`YukitaPlugin`](../interfaces/YukitaPlugin.md).[`compatibleRange`](../interfaces/YukitaPlugin.md#compatiblerange)

## Methods

### init()

> **init**(`ctx`): [`Result`](../type-aliases/Result.md)\<`undefined`\>

Defined in: [src/plugins/resolve-cache.ts:50](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/resolve-cache.ts#L50)

#### Parameters

##### ctx

[`PluginInitContext`](../interfaces/PluginInitContext.md)

#### Returns

[`Result`](../type-aliases/Result.md)\<`undefined`\>

#### Implementation of

[`YukitaPlugin`](../interfaces/YukitaPlugin.md).[`init`](../interfaces/YukitaPlugin.md#init)
