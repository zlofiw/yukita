[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / GatewayServerOptions

# Interface: GatewayServerOptions

Defined in: [src/gateway/types.ts:79](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L79)

Gateway server options.

## Extended by

- [`WebsocketGatewayPluginOptions`](WebsocketGatewayPluginOptions.md)

## Properties

### port?

> `optional` **port**: `number`

Defined in: [src/gateway/types.ts:80](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L80)

***

### host?

> `optional` **host**: `string`

Defined in: [src/gateway/types.ts:81](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L81)

***

### path?

> `optional` **path**: `string`

Defined in: [src/gateway/types.ts:82](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L82)

***

### server?

> `optional` **server**: `Server`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\>

Defined in: [src/gateway/types.ts:83](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L83)

***

### auth

> **auth**: [`GatewayAuthOptions`](GatewayAuthOptions.md)

Defined in: [src/gateway/types.ts:84](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L84)

***

### allowedOrigins?

> `optional` **allowedOrigins**: `string`[]

Defined in: [src/gateway/types.ts:85](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L85)

***

### rateLimit?

> `optional` **rateLimit**: `Partial`\<[`GatewayRateLimitOptions`](GatewayRateLimitOptions.md)\>

Defined in: [src/gateway/types.ts:86](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L86)
