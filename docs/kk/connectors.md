# Коннекторлар

Коннекторлар YukitaSan-ды Discord кітапханасымен байланыстыратын жұқа адаптерлер.

Shoukaku стиліндегі контракт:

```ts
interface Connector {
  getId(): string;
  listen(nodes): void;
  sendPacket(guildId, payload): void;
  set(manager): void;
}
```

Міндеттері:

- `VOICE_STATE_UPDATE` және `VOICE_SERVER_UPDATE` оқиғаларын `client.applyVoiceStateUpdate(...)` / `client.applyVoiceServerUpdate(...)` ішіне жіберу
- join/move/leave үшін OP 4 voice state пакеттерін жіберу (`YukitaPlayer.connect()` / `YukitaPlayer.disconnect()`)

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

Коннектор:

- `VOICE_STATE_UPDATE` және `VOICE_SERVER_UPDATE` тыңдайды
- OP 4 payload-ты `sendPacket(...)` арқылы жібереді

## OP 4 (Join/Move/Leave)

Коннектор бапталған болса, join/leave сұрауын жіберуге болады:

```ts
const player = (await client.createPlayer(guildId, { guildId, shardId: 0 })).value;
await player.connect(channelId);
await player.disconnect();
```
