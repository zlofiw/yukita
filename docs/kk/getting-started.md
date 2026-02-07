# Бастау

## Талаптар

- Node.js >= 20
- Lavalink v4 (REST: `/v4/*`, WS: `/v4/websocket`)
- Discord кітапханасы (міндетті емес, коннекторлар арқылы)

## Lavalink іске қосу (Docker)

Бұл репозиторийде минималды docker compose және конфиг бар:

```bash
docker compose -f docker/lavalink-compose.yml up -d
```

Конфиг: `docker/lavalink/application.yml`

## Орнату

```bash
pnpm add yukitasan
```

## Клиент жасау

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

## Міндетті емес: built-in плагиндерді қосу

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

## Міндетті емес: Discord.js коннекторы

YukitaSan Discord кітапханасына тәуелсіз, бірақ Discord.js коннекторы бар.

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

Коннектор `VOICE_STATE_UPDATE` / `VOICE_SERVER_UPDATE` оқиғаларын тыңдайды және join/move/leave үшін OP 4 пакеттерін жібереді.

## Негізгі player flow

Көп боттарда `guildId` мәнін `contextId` ретінде қолдану ең оңай.

```ts
const contextId = guildId;

const created = await client.createPlayer(contextId, {
  guildId,
  shardId: 0
});
if (!created.ok) throw created.error;

const player = created.value;

// Коннектор болса voice-қа қосылу (OP 4).
await player.connect(voiceChannelId);

// Resolve + play.
const played = await client.play(contextId, { query: 'ytsearch:daft punk around the world' });
if (!played.ok) throw played.error;
```

## Клиентті тоқтату

```ts
await client.shutdown();
```
