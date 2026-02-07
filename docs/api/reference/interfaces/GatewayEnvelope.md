[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / GatewayEnvelope

# Interface: GatewayEnvelope\<TPayload\>

Defined in: [src/gateway/types.ts:19](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L19)

Envelope for all gateway frames.

## Type Parameters

### TPayload

`TPayload` *extends* `object` = `Record`\<`string`, `unknown`\>

## Properties

### op

> **op**: [`GatewayOp`](../type-aliases/GatewayOp.md)

Defined in: [src/gateway/types.ts:20](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L20)

***

### t

> **t**: `string`

Defined in: [src/gateway/types.ts:21](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L21)

***

### id

> **id**: `string`

Defined in: [src/gateway/types.ts:22](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L22)

***

### ts

> **ts**: `number`

Defined in: [src/gateway/types.ts:23](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L23)

***

### d

> **d**: `TPayload`

Defined in: [src/gateway/types.ts:24](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L24)
