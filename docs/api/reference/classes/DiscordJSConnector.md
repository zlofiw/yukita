[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / DiscordJSConnector

# Class: DiscordJSConnector

Defined in: [src/connectors/DiscordJSConnector.ts:15](https://github.com/zlofiw/yukita/blob/main/src/connectors/DiscordJSConnector.ts#L15)

Discord.js connector (Shoukaku-style) for voice updates and OP 4 dispatch.

## Implements

- [`Connector`](../interfaces/Connector.md)

## Constructors

### Constructor

> **new DiscordJSConnector**(`client`): `DiscordJSConnector`

Defined in: [src/connectors/DiscordJSConnector.ts:20](https://github.com/zlofiw/yukita/blob/main/src/connectors/DiscordJSConnector.ts#L20)

#### Parameters

##### client

`Client`

#### Returns

`DiscordJSConnector`

## Methods

### set()

> **set**(`manager`): `void`

Defined in: [src/connectors/DiscordJSConnector.ts:24](https://github.com/zlofiw/yukita/blob/main/src/connectors/DiscordJSConnector.ts#L24)

#### Parameters

##### manager

[`YukitaSan`](YukitaSan.md)

#### Returns

`void`

#### Implementation of

[`Connector`](../interfaces/Connector.md).[`set`](../interfaces/Connector.md#set)

***

### getId()

> **getId**(): `string`

Defined in: [src/connectors/DiscordJSConnector.ts:28](https://github.com/zlofiw/yukita/blob/main/src/connectors/DiscordJSConnector.ts#L28)

#### Returns

`string`

#### Implementation of

[`Connector`](../interfaces/Connector.md).[`getId`](../interfaces/Connector.md#getid)

***

### listen()

> **listen**(`_nodes`): `void`

Defined in: [src/connectors/DiscordJSConnector.ts:36](https://github.com/zlofiw/yukita/blob/main/src/connectors/DiscordJSConnector.ts#L36)

#### Parameters

##### \_nodes

readonly [`LavalinkNode`](LavalinkNode.md)[]

#### Returns

`void`

#### Implementation of

[`Connector`](../interfaces/Connector.md).[`listen`](../interfaces/Connector.md#listen)

***

### sendPacket()

> **sendPacket**(`guildId`, `payload`): `Promise`\<`void`\>

Defined in: [src/connectors/DiscordJSConnector.ts:46](https://github.com/zlofiw/yukita/blob/main/src/connectors/DiscordJSConnector.ts#L46)

#### Parameters

##### guildId

`string`

##### payload

`unknown`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Connector`](../interfaces/Connector.md).[`sendPacket`](../interfaces/Connector.md#sendpacket)
