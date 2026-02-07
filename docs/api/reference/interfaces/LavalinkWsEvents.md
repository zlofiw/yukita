[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / LavalinkWsEvents

# Interface: LavalinkWsEvents

Defined in: [src/lavalink/LavalinkWsClient.ts:18](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkWsClient.ts#L18)

WS events emitted by lavalink websocket client.

## Properties

### connected

> **connected**: `object`

Defined in: [src/lavalink/LavalinkWsClient.ts:19](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkWsClient.ts#L19)

#### nodeId

> **nodeId**: `string`

***

### disconnected

> **disconnected**: `object`

Defined in: [src/lavalink/LavalinkWsClient.ts:20](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkWsClient.ts#L20)

#### nodeId

> **nodeId**: `string`

#### code

> **code**: `number`

#### reason

> **reason**: `string`

***

### error

> **error**: `object`

Defined in: [src/lavalink/LavalinkWsClient.ts:21](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkWsClient.ts#L21)

#### nodeId

> **nodeId**: `string`

#### error

> **error**: `Error`

***

### ready

> **ready**: `object`

Defined in: [src/lavalink/LavalinkWsClient.ts:22](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkWsClient.ts#L22)

#### nodeId

> **nodeId**: `string`

#### payload

> **payload**: [`LavalinkReadyPayload`](LavalinkReadyPayload.md)

***

### stats

> **stats**: `object`

Defined in: [src/lavalink/LavalinkWsClient.ts:23](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkWsClient.ts#L23)

#### nodeId

> **nodeId**: `string`

#### payload

> **payload**: [`LavalinkNodeStats`](LavalinkNodeStats.md)

***

### playerUpdate

> **playerUpdate**: `object`

Defined in: [src/lavalink/LavalinkWsClient.ts:24](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkWsClient.ts#L24)

#### nodeId

> **nodeId**: `string`

#### payload

> **payload**: [`LavalinkPlayerUpdatePayload`](LavalinkPlayerUpdatePayload.md)

***

### playerEvent

> **playerEvent**: `object`

Defined in: [src/lavalink/LavalinkWsClient.ts:25](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkWsClient.ts#L25)

#### nodeId

> **nodeId**: `string`

#### payload

> **payload**: [`LavalinkPlayerEvent`](../type-aliases/LavalinkPlayerEvent.md)

***

### raw

> **raw**: `object`

Defined in: [src/lavalink/LavalinkWsClient.ts:26](https://github.com/zlofiw/yukita/blob/main/src/lavalink/LavalinkWsClient.ts#L26)

#### nodeId

> **nodeId**: `string`

#### payload

> **payload**: [`LavalinkWsMessage`](../type-aliases/LavalinkWsMessage.md)
