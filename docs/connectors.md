# Connectors

Connectors are thin adapters that connect YukitaSan to a Discord library.

They follow the Shoukaku-style contract:

```ts
interface Connector {
  getId(): string;
  listen(nodes): void;
  sendPacket(guildId, payload): void;
  set(manager): void;
}
```

Responsibilities:

- forward `VOICE_STATE_UPDATE` and `VOICE_SERVER_UPDATE` to `client.applyVoiceStateUpdate(...)` / `client.applyVoiceServerUpdate(...)`
- send OP 4 voice state packets for join/move/leave (`YukitaPlayer.connect()` / `YukitaPlayer.disconnect()`)

## Discord.js

```ts
import { Client, GatewayIntentBits } from 'discord.js';
import { DiscordJSConnector, YukitaSan } from 'yukitasan';

const discord = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});

const client = new YukitaSan({
  connector: new DiscordJSConnector(discord),
  nodes: [
    {
      id: 'main',
      host: '127.0.0.1',
      port: 2333,
      password: 'youshallnotpass',
      userId: '123456789012345678'
    }
  ]
});
```

The connector:

- listens to `VOICE_STATE_UPDATE` and `VOICE_SERVER_UPDATE`
- sends OP 4 payloads via `sendPacket(...)`

## OP 4 (Join/Move/Leave)

If a connector is configured, you can request join/leave:

```ts
const player = (await client.createPlayer(guildId, { guildId, shardId: 0 })).value;
await player.connect(channelId);
await player.disconnect();
```
