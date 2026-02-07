[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / YukitaGatewayServer

# Class: YukitaGatewayServer

Defined in: [src/gateway/YukitaGatewayServer.ts:51](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/YukitaGatewayServer.ts#L51)

WebSocket gateway for subscriptions and remote commands.

## Constructors

### Constructor

> **new YukitaGatewayServer**(`client`, `options`): `YukitaGatewayServer`

Defined in: [src/gateway/YukitaGatewayServer.ts:61](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/YukitaGatewayServer.ts#L61)

#### Parameters

##### client

[`YukitaSan`](YukitaSan.md)

##### options

[`GatewayServerOptions`](../interfaces/GatewayServerOptions.md)

#### Returns

`YukitaGatewayServer`

## Methods

### registerCommand()

> **registerCommand**(`name`, `registration`): () => `void`

Defined in: [src/gateway/YukitaGatewayServer.ts:74](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/YukitaGatewayServer.ts#L74)

Registers a custom gateway command handler (plugin extension point).

#### Parameters

##### name

`string`

##### registration

[`GatewayCommandRegistration`](../interfaces/GatewayCommandRegistration.md)

#### Returns

> (): `void`

##### Returns

`void`

***

### addOutboundTransform()

> **addOutboundTransform**(`transform`): () => `void`

Defined in: [src/gateway/YukitaGatewayServer.ts:95](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/YukitaGatewayServer.ts#L95)

Adds an outbound frame transform hook.
Return disposer to remove.

#### Parameters

##### transform

[`GatewayOutboundTransform`](../type-aliases/GatewayOutboundTransform.md)

#### Returns

> (): `void`

##### Returns

`void`

***

### publish()

> **publish**(`topics`, `type`, `payload`): `void`

Defined in: [src/gateway/YukitaGatewayServer.ts:108](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/YukitaGatewayServer.ts#L108)

Publishes an event frame to a topic (or topics).

#### Parameters

##### topics

`string` | readonly `string`[]

##### type

`string`

##### payload

`object`

#### Returns

`void`

***

### start()

> **start**(): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/gateway/YukitaGatewayServer.ts:132](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/YukitaGatewayServer.ts#L132)

Starts websocket gateway.

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### stop()

> **stop**(): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/gateway/YukitaGatewayServer.ts:169](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/YukitaGatewayServer.ts#L169)

Stops websocket gateway.

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>
