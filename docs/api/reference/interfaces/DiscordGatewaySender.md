[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / DiscordGatewaySender

# Interface: DiscordGatewaySender

Defined in: [src/connectors/discord-types.ts:45](https://github.com/zlofiw/yukita/blob/main/src/connectors/discord-types.ts#L45)

Gateway sender abstraction.

## Properties

### sendGatewayPayload()

> **sendGatewayPayload**: (`shardId`, `payload`) => `void` \| `Promise`\<`void`\>

Defined in: [src/connectors/discord-types.ts:46](https://github.com/zlofiw/yukita/blob/main/src/connectors/discord-types.ts#L46)

#### Parameters

##### shardId

`number`

##### payload

[`DiscordVoiceStateCommand`](DiscordVoiceStateCommand.md)

#### Returns

`void` \| `Promise`\<`void`\>
