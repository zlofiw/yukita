[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / WebsocketGatewayPluginOptions

# Interface: WebsocketGatewayPluginOptions

Defined in: [src/plugins/websocket-gateway.ts:7](https://github.com/zlofiw/yukita/blob/main/src/plugins/websocket-gateway.ts#L7)

Gateway server options.

## Extends

- [`GatewayServerOptions`](GatewayServerOptions.md)

## Properties

### port?

> `optional` **port**: `number`

Defined in: [src/gateway/types.ts:80](https://github.com/zlofiw/yukita/blob/main/src/gateway/types.ts#L80)

#### Inherited from

[`GatewayServerOptions`](GatewayServerOptions.md).[`port`](GatewayServerOptions.md#port)

***

### host?

> `optional` **host**: `string`

Defined in: [src/gateway/types.ts:81](https://github.com/zlofiw/yukita/blob/main/src/gateway/types.ts#L81)

#### Inherited from

[`GatewayServerOptions`](GatewayServerOptions.md).[`host`](GatewayServerOptions.md#host)

***

### path?

> `optional` **path**: `string`

Defined in: [src/gateway/types.ts:82](https://github.com/zlofiw/yukita/blob/main/src/gateway/types.ts#L82)

#### Inherited from

[`GatewayServerOptions`](GatewayServerOptions.md).[`path`](GatewayServerOptions.md#path)

***

### server?

> `optional` **server**: `Server`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\>

Defined in: [src/gateway/types.ts:83](https://github.com/zlofiw/yukita/blob/main/src/gateway/types.ts#L83)

#### Inherited from

[`GatewayServerOptions`](GatewayServerOptions.md).[`server`](GatewayServerOptions.md#server)

***

### auth

> **auth**: [`GatewayAuthOptions`](GatewayAuthOptions.md)

Defined in: [src/gateway/types.ts:84](https://github.com/zlofiw/yukita/blob/main/src/gateway/types.ts#L84)

#### Inherited from

[`GatewayServerOptions`](GatewayServerOptions.md).[`auth`](GatewayServerOptions.md#auth)

***

### allowedOrigins?

> `optional` **allowedOrigins**: `string`[]

Defined in: [src/gateway/types.ts:85](https://github.com/zlofiw/yukita/blob/main/src/gateway/types.ts#L85)

#### Inherited from

[`GatewayServerOptions`](GatewayServerOptions.md).[`allowedOrigins`](GatewayServerOptions.md#allowedorigins)

***

### rateLimit?

> `optional` **rateLimit**: `Partial`\<[`GatewayRateLimitOptions`](GatewayRateLimitOptions.md)\>

Defined in: [src/gateway/types.ts:86](https://github.com/zlofiw/yukita/blob/main/src/gateway/types.ts#L86)

#### Inherited from

[`GatewayServerOptions`](GatewayServerOptions.md).[`rateLimit`](GatewayServerOptions.md#ratelimit)

***

### namespace?

> `optional` **namespace**: `string`

Defined in: [src/plugins/websocket-gateway.ts:12](https://github.com/zlofiw/yukita/blob/main/src/plugins/websocket-gateway.ts#L12)

Extension namespace registered via `client.getExtension(namespace)`.
Defaults to `websocketGateway`.

***

### autoStart?

> `optional` **autoStart**: `boolean`

Defined in: [src/plugins/websocket-gateway.ts:17](https://github.com/zlofiw/yukita/blob/main/src/plugins/websocket-gateway.ts#L17)

Start gateway automatically on `client.start()`.
Defaults to `true`.
