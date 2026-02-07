# yukitasan

TypeScript-first Lavalink v4 client library for Node.js (Discord-library agnostic via Shoukaku-style connectors).

## Install

```bash
pnpm add yukitasan
# or: npm i yukitasan
```

## Quick Start (Core)

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
  ],
  selectionStrategy: 'penalty'
});

const started = await client.start();
if (!started.ok) throw started.error;

const created = await client.createPlayer('guild:1', {
  guildId: 'guild-1',
  shardId: 0
});
if (!created.ok) throw created.error;

const resolved = await client.resolve('guild:1', 'ytsearch:daft punk around the world');
if (!resolved.ok) throw resolved.error;
```

## Discord.js Connector (OP 4)

```ts
import { Client, GatewayIntentBits } from 'discord.js';
import { DiscordJSConnector, YukitaSan } from 'yukitasan';

const discord = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});

const yukita = new YukitaSan({
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

## WebSocket Gateway Plugin

```ts
import { createWebsocketGatewayPlugin, YukitaSan } from 'yukitasan';

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

## Development

```bash
pnpm install
pnpm typecheck
pnpm test:unit
pnpm build
```

Integration tests require a running Lavalink v4 (see `docker/lavalink-compose.yml`):

```bash
pnpm test:integration
```

## License

MIT

