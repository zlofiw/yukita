# Начало

## Требования

- Node.js >= 20
- Lavalink v4 (REST: `/v4/*`, WS: `/v4/websocket`)
- Discord-библиотека (опционально, через коннекторы)

## Запуск Lavalink (Docker)

В этом репозитории есть минимальный docker compose и конфиг:

```bash
docker compose -f docker/lavalink-compose.yml up -d
```

Конфиг: `docker/lavalink/application.yml`

## Установка

```bash
pnpm add yukitasan
```

## Создание клиента

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

## Опционально: установка встроенных плагинов

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

## Опционально: Discord.js коннектор

YukitaSan не зависит от Discord-библиотеки, но включает Discord.js коннектор.

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

Коннектор слушает `VOICE_STATE_UPDATE` / `VOICE_SERVER_UPDATE` и отправляет OP 4 пакеты для join/move/leave.

## Базовый player flow

В большинстве ботов проще всего использовать `guildId` как `contextId`.

```ts
const contextId = guildId;

const created = await client.createPlayer(contextId, {
  guildId,
  shardId: 0
});
if (!created.ok) throw created.error;

const player = created.value;

// Join voice (OP 4) если коннектор настроен.
await player.connect(voiceChannelId);

// Resolve + play.
const played = await client.play(contextId, { query: 'ytsearch:daft punk around the world' });
if (!played.ok) throw played.error;
```

## Остановка клиента

```ts
await client.shutdown();
```
