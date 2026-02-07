# Початок

## Вимоги

- Node.js >= 20
- Lavalink v4 (REST: `/v4/*`, WS: `/v4/websocket`)
- Discord-бібліотека (опційно, через конектори)

## Запуск Lavalink (Docker)

У цьому репозиторії є мінімальний docker compose і конфіг:

```bash
docker compose -f docker/lavalink-compose.yml up -d
```

Конфіг: `docker/lavalink/application.yml`

## Встановлення

```bash
pnpm add yukitasan
```

## Створення клієнта

```ts
import { YukitaSan } from 'yukitasan';

const client = new YukitaSan({
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

const started = await client.start();
if (!started.ok) throw started.error;
```

## Опційно: встановлення вбудованих плагінів

```ts
import {
  createMetricsPlugin,
  createResolveCachePlugin,
  createWebsocketGatewayPlugin
} from 'yukitasan';

await client.use(createMetricsPlugin());
await client.use(createResolveCachePlugin());

await client.use(
  createWebsocketGatewayPlugin({
    port: 8080,
    path: '/yukitasan',
    auth: {
      mode: 'hmac',
      secret: process.env.GATEWAY_SECRET ?? 'change-me'
    }
  })
);
```

## Опційно: Discord.js конектор

YukitaSan не залежить від Discord-бібліотеки, але має Discord.js конектор.

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

Конектор слухає `VOICE_STATE_UPDATE` / `VOICE_SERVER_UPDATE` і надсилає OP 4 пакети для join/move/leave.

## Базовий player flow

У більшості ботів найпростіше використовувати `guildId` як `contextId`.

```ts
const contextId = guildId;

const created = await client.createPlayer(contextId, {
  guildId,
  shardId: 0
});
if (!created.ok) throw created.error;

const player = created.value;

// Join voice (OP 4) якщо конектор налаштований.
await player.connect(voiceChannelId);

// Resolve + play.
const played = await client.play(contextId, { query: 'ytsearch:daft punk around the world' });
if (!played.ok) throw played.error;
```

## Зупинка клієнта

```ts
await client.shutdown();
```
