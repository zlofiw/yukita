[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / MetricsPlugin

# Class: MetricsPlugin

Defined in: [src/plugins/metrics.ts:28](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/metrics.ts#L28)

Reference plugin that tracks operation counters.

## Implements

- [`YukitaPlugin`](../interfaces/YukitaPlugin.md)

## Constructors

### Constructor

> **new MetricsPlugin**(`options?`): `MetricsPlugin`

Defined in: [src/plugins/metrics.ts:43](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/metrics.ts#L43)

#### Parameters

##### options?

[`MetricsPluginOptions`](../interfaces/MetricsPluginOptions.md) = `{}`

#### Returns

`MetricsPlugin`

## Properties

### name

> `readonly` **name**: `"metrics"` = `'metrics'`

Defined in: [src/plugins/metrics.ts:29](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/metrics.ts#L29)

#### Implementation of

[`YukitaPlugin`](../interfaces/YukitaPlugin.md).[`name`](../interfaces/YukitaPlugin.md#name)

***

### version

> `readonly` **version**: `"0.1.0"` = `CORE_VERSION`

Defined in: [src/plugins/metrics.ts:30](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/metrics.ts#L30)

#### Implementation of

[`YukitaPlugin`](../interfaces/YukitaPlugin.md).[`version`](../interfaces/YukitaPlugin.md#version)

***

### compatibleRange

> `readonly` **compatibleRange**: `"^0.1.0"` = `CORE_COMPATIBLE_RANGE`

Defined in: [src/plugins/metrics.ts:31](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/metrics.ts#L31)

#### Implementation of

[`YukitaPlugin`](../interfaces/YukitaPlugin.md).[`compatibleRange`](../interfaces/YukitaPlugin.md#compatiblerange)

## Methods

### init()

> **init**(`ctx`): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/plugins/metrics.ts:47](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/metrics.ts#L47)

#### Parameters

##### ctx

[`PluginInitContext`](../interfaces/PluginInitContext.md)

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

#### Implementation of

[`YukitaPlugin`](../interfaces/YukitaPlugin.md).[`init`](../interfaces/YukitaPlugin.md#init)
