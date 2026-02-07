# Getting Started

## Requirements

- Node.js >= 20
- Lavalink v4 (REST: `/v4/*`, WS: `/v4/websocket`)
- Discord library (optional, via connectors)

## Run Lavalink (Docker)

This repo includes a minimal docker compose file and config:

```bash
docker compose -f docker/lavalink-compose.yml up -d
```

Config: `docker/lavalink/application.yml`

## Install

```bash
pnpm add yukitasan
```

## Create Client

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

## Optional: Install Built-in Plugins

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

## Optional: Discord.js Connector

YukitaSan is Discord-library agnostic, but ships a Discord.js connector.

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

The connector listens to `VOICE_STATE_UPDATE` / `VOICE_SERVER_UPDATE` and sends OP 4 packets for join/move/leave.

## Player Flow

In most bots, using `guildId` as `contextId` is the simplest approach.

```ts
const contextId = guildId;

const created = await client.createPlayer(contextId, {
  guildId,
  shardId: 0
});
if (!created.ok) throw created.error;

const player = created.value;

// Join voice (OP 4) if a connector is configured.
await player.connect(voiceChannelId);

// Resolve + play.
const played = await client.play(contextId, { query: 'ytsearch:daft punk around the world' });
if (!played.ok) throw played.error;
```

## Shutdown

```ts
await client.shutdown();
```
