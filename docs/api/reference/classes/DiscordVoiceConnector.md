[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / DiscordVoiceConnector

# Class: DiscordVoiceConnector

Defined in: [src/connectors/DiscordVoiceConnector.ts:50](https://github.com/zlofiw/yukita/blob/main/src/connectors/DiscordVoiceConnector.ts#L50)

Discord connector that feeds voice events into `yukitasan`.

## Constructors

### Constructor

> **new DiscordVoiceConnector**(`client`, `sender`, `options`): `DiscordVoiceConnector`

Defined in: [src/connectors/DiscordVoiceConnector.ts:55](https://github.com/zlofiw/yukita/blob/main/src/connectors/DiscordVoiceConnector.ts#L55)

#### Parameters

##### client

[`YukitaSan`](YukitaSan.md)

##### sender

[`DiscordGatewaySender`](../interfaces/DiscordGatewaySender.md)

##### options

[`DiscordConnectorOptions`](../interfaces/DiscordConnectorOptions.md)

#### Returns

`DiscordVoiceConnector`

## Methods

### handleVoiceStateUpdate()

> **handleVoiceStateUpdate**(`input`): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/connectors/DiscordVoiceConnector.ts:64](https://github.com/zlofiw/yukita/blob/main/src/connectors/DiscordVoiceConnector.ts#L64)

Handles Discord VOICE_STATE_UPDATE.

#### Parameters

##### input

###### contextId

`string`

###### shardId

`number`

###### payload

[`DiscordVoiceStateUpdate`](../interfaces/DiscordVoiceStateUpdate.md)

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### handleVoiceServerUpdate()

> **handleVoiceServerUpdate**(`input`): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/connectors/DiscordVoiceConnector.ts:78](https://github.com/zlofiw/yukita/blob/main/src/connectors/DiscordVoiceConnector.ts#L78)

Handles Discord VOICE_SERVER_UPDATE.

#### Parameters

##### input

###### contextId

`string`

###### payload

[`DiscordVoiceServerUpdate`](../interfaces/DiscordVoiceServerUpdate.md)

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### joinVoice()

> **joinVoice**(`input`): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/connectors/DiscordVoiceConnector.ts:88](https://github.com/zlofiw/yukita/blob/main/src/connectors/DiscordVoiceConnector.ts#L88)

Sends join command to Discord gateway.

#### Parameters

##### input

###### shardId

`number`

###### guildId

`string`

###### channelId

`string`

###### selfMute?

`boolean`

###### selfDeaf?

`boolean`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### moveVoice()

> **moveVoice**(`input`): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/connectors/DiscordVoiceConnector.ts:107](https://github.com/zlofiw/yukita/blob/main/src/connectors/DiscordVoiceConnector.ts#L107)

Sends move command to Discord gateway.

#### Parameters

##### input

###### shardId

`number`

###### guildId

`string`

###### channelId

`string`

###### selfMute?

`boolean`

###### selfDeaf?

`boolean`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

***

### leaveVoice()

> **leaveVoice**(`input`): `Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>

Defined in: [src/connectors/DiscordVoiceConnector.ts:126](https://github.com/zlofiw/yukita/blob/main/src/connectors/DiscordVoiceConnector.ts#L126)

Sends leave command to Discord gateway.

#### Parameters

##### input

###### shardId

`number`

###### guildId

`string`

###### selfMute?

`boolean`

###### selfDeaf?

`boolean`

#### Returns

`Promise`\<[`Result`](../type-aliases/Result.md)\<`void`\>\>
