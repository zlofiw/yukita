[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / Connector

# Interface: Connector

Defined in: [src/connectors/Connector.ts:7](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/connectors/Connector.ts#L7)

Shoukaku-style connector interface: thin Discord library adapter.

## Methods

### getId()

> **getId**(): `string`

Defined in: [src/connectors/Connector.ts:8](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/connectors/Connector.ts#L8)

#### Returns

`string`

***

### listen()

> **listen**(`nodes`): `void`

Defined in: [src/connectors/Connector.ts:9](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/connectors/Connector.ts#L9)

#### Parameters

##### nodes

readonly [`LavalinkNode`](../classes/LavalinkNode.md)[]

#### Returns

`void`

***

### sendPacket()

> **sendPacket**(`guildId`, `payload`): `void` \| `Promise`\<`void`\>

Defined in: [src/connectors/Connector.ts:10](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/connectors/Connector.ts#L10)

#### Parameters

##### guildId

`string`

##### payload

`unknown`

#### Returns

`void` \| `Promise`\<`void`\>

***

### set()

> **set**(`manager`): `void`

Defined in: [src/connectors/Connector.ts:11](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/connectors/Connector.ts#L11)

#### Parameters

##### manager

[`YukitaSan`](../classes/YukitaSan.md)

#### Returns

`void`
