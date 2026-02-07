# Конектори

Конектори це тонкі адаптери, які з’єднують YukitaSan з вашою Discord-бібліотекою.

Контракт у стилі Shoukaku:

```ts
interface Connector {
  getId(): string;
  listen(nodes): void;
  sendPacket(guildId, payload): void;
  set(manager): void;
}
```

Обов’язки:

- прокидати `VOICE_STATE_UPDATE` та `VOICE_SERVER_UPDATE` у `client.applyVoiceStateUpdate(...)` / `client.applyVoiceServerUpdate(...)`
- надсилати OP 4 voice state пакети для join/move/leave (`YukitaPlayer.connect()` / `YukitaPlayer.disconnect()`)

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

Конектор:

- слухає `VOICE_STATE_UPDATE` та `VOICE_SERVER_UPDATE`
- надсилає OP 4 payload через `sendPacket(...)`

## OP 4 (Join/Move/Leave)

Якщо конектор налаштовано, можна запросити join/leave:

```ts
const player = (await client.createPlayer(guildId, { guildId, shardId: 0 })).value;
await player.connect(channelId);
await player.disconnect();
```
