[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / GatewayOutboundTransform

# Type Alias: GatewayOutboundTransform()

> **GatewayOutboundTransform** = (`session`, `frame`) => [`GatewayEnvelope`](../interfaces/GatewayEnvelope.md) \| `null`

Defined in: [src/gateway/types.ts:39](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L39)

Outbound frame transform hook.
Return `null` to drop the frame.

## Parameters

### session

[`GatewaySessionInfo`](../interfaces/GatewaySessionInfo.md)

### frame

[`GatewayEnvelope`](../interfaces/GatewayEnvelope.md)

## Returns

[`GatewayEnvelope`](../interfaces/GatewayEnvelope.md) \| `null`
