# Коннекторы

Коннекторы — тонкие адаптеры, которые связывают YukitaSan с вашей Discord-библиотекой.

Контракт в стиле Shoukaku:

```ts
interface Connector {
  getId(): string;
  listen(nodes): void;
  sendPacket(guildId, payload): void;
  set(manager): void;
}
```

Обязанности:

- прокидывать `VOICE_STATE_UPDATE` и `VOICE_SERVER_UPDATE` в `client.applyVoiceStateUpdate(...)` / `client.applyVoiceServerUpdate(...)`
- отправлять OP 4 voice state пакеты для join/move/leave (`YukitaPlayer.connect()` / `YukitaPlayer.disconnect()`)

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

- слушает `VOICE_STATE_UPDATE` и `VOICE_SERVER_UPDATE`
- отправляет OP 4 payload через `sendPacket(...)`

## OP 4 (Join/Move/Leave)

Если коннектор настроен, можно запросить join/leave:

```ts
const player = (await client.createPlayer(guildId, { guildId, shardId: 0 })).value;
await player.connect(channelId);
await player.disconnect();
```
