[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / WebsocketGatewayPlugin

# Class: WebsocketGatewayPlugin

Defined in: [src/plugins/websocket-gateway.ts:20](https://github.com/zlofiw/yukita/blob/main/src/plugins/websocket-gateway.ts#L20)

## Implements

- [`YukitaPlugin`](../interfaces/YukitaPlugin.md)

## Constructors

### Constructor

> **new WebsocketGatewayPlugin**(`options`): `WebsocketGatewayPlugin`

Defined in: [src/plugins/websocket-gateway.ts:28](https://github.com/zlofiw/yukita/blob/main/src/plugins/websocket-gateway.ts#L28)

#### Parameters

##### options

[`WebsocketGatewayPluginOptions`](../interfaces/WebsocketGatewayPluginOptions.md)

#### Returns

`WebsocketGatewayPlugin`

## Properties

### name

> `readonly` **name**: `"websocket-gateway"` = `'websocket-gateway'`

Defined in: [src/plugins/websocket-gateway.ts:21](https://github.com/zlofiw/yukita/blob/main/src/plugins/websocket-gateway.ts#L21)

#### Implementation of

[`YukitaPlugin`](../interfaces/YukitaPlugin.md).[`name`](../interfaces/YukitaPlugin.md#name)

***

### version

> `readonly` **version**: `"0.1.0"` = `CORE_VERSION`

Defined in: [src/plugins/websocket-gateway.ts:22](https://github.com/zlofiw/yukita/blob/main/src/plugins/websocket-gateway.ts#L22)

#### Implementation of

[`YukitaPlugin`](../interfaces/YukitaPlugin.md).[`version`](../interfaces/YukitaPlugin.md#version)

***

### compatibleRange

> `readonly` **compatibleRange**: `"^0.1.0"` = `CORE_COMPATIBLE_RANGE`

Defined in: [src/plugins/websocket-gateway.ts:23](https://github.com/zlofiw/yukita/blob/main/src/plugins/websocket-gateway.ts#L23)

#### Implementation of

[`YukitaPlugin`](../interfaces/YukitaPlugin.md).[`compatibleRange`](../interfaces/YukitaPlugin.md#compatiblerange)

## Methods

### init()

> **init**(`ctx`): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/plugins/websocket-gateway.ts:32](https://github.com/zlofiw/yukita/blob/main/src/plugins/websocket-gateway.ts#L32)

#### Parameters

##### ctx

[`PluginInitContext`](../interfaces/PluginInitContext.md)

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

#### Implementation of

[`YukitaPlugin`](../interfaces/YukitaPlugin.md).[`init`](../interfaces/YukitaPlugin.md#init)
