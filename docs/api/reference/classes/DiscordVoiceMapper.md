[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / DiscordVoiceMapper

# Class: DiscordVoiceMapper

Defined in: [src/connectors/DiscordVoiceConnector.ts:14](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/connectors/DiscordVoiceConnector.ts#L14)

Stateless mapper for Discord dispatch to core voice update shape.

## Constructors

### Constructor

> **new DiscordVoiceMapper**(): `DiscordVoiceMapper`

#### Returns

`DiscordVoiceMapper`

## Methods

### mapState()

> `static` **mapState**(`input`): `object`

Defined in: [src/connectors/DiscordVoiceConnector.ts:18](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/connectors/DiscordVoiceConnector.ts#L18)

Maps voice state event to core payload.

#### Parameters

##### input

###### contextId

`string`

###### shardId

`number`

###### payload

[`DiscordVoiceStateUpdate`](../interfaces/DiscordVoiceStateUpdate.md)

#### Returns

`object`

##### contextId

> **contextId**: `string` = `input.contextId`

##### guildId

> **guildId**: `string` = `input.payload.guild_id`

##### channelId

> **channelId**: `string` \| `null` = `input.payload.channel_id`

##### sessionId

> **sessionId**: `string` = `input.payload.session_id`

##### shardId

> **shardId**: `number` = `input.shardId`

##### selfMute

> **selfMute**: `boolean`

##### selfDeaf

> **selfDeaf**: `boolean`

***

### mapServer()

> `static` **mapServer**(`input`): `object`

Defined in: [src/connectors/DiscordVoiceConnector.ts:37](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/connectors/DiscordVoiceConnector.ts#L37)

Maps voice server event to core payload.

#### Parameters

##### input

###### contextId

`string`

###### payload

[`DiscordVoiceServerUpdate`](../interfaces/DiscordVoiceServerUpdate.md)

#### Returns

`object`

##### contextId

> **contextId**: `string` = `input.contextId`

##### guildId

> **guildId**: `string` = `input.payload.guild_id`

##### token

> **token**: `string` = `input.payload.token`

##### endpoint

> **endpoint**: `string` = `input.payload.endpoint`
