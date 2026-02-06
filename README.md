# YukiTa

YukiTa is a TypeScript-first Lavalink toolkit with a fully rewritten architecture:

- `@yukita/core` - node pool, resolver, players, queue, events and plugin runtime.
- `@yukita/protocol` - Lavalink REST/WS protocol clients and payload codecs.
- `@yukita/plugin-kit` - plugin interfaces, hooks and shared Result/Error primitives.
- `@yukita/gateway` - WebSocket control/stream gateway for bot and web clients.
- `@yukita/connector-discord` - Discord voice-state adapter without discord.js coupling.
- `@yukita/plugins-metrics`, `@yukita/plugins-resolve-cache` - reference plugins.

## Install

```bash
pnpm install
```

Build all packages:

```bash
pnpm build
```

## Quick Start (`@yukita/core`)

```ts
import { YukitaClient } from '@yukita/core';
import { MetricsPlugin } from '@yukita/plugins-metrics';
import { ResolveCachePlugin } from '@yukita/plugins-resolve-cache';

const client = new YukitaClient({
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
if (!started.ok) {
  throw started.error;
}

const metricsPlugin = await client.use(new MetricsPlugin());
if (!metricsPlugin.ok) {
  throw metricsPlugin.error;
}

const cachePlugin = await client.use(new ResolveCachePlugin());
if (!cachePlugin.ok) {
  throw cachePlugin.error;
}

const created = await client.createPlayer('guild:1', {
  guildId: 'guild-1',
  shardId: 0
});
if (!created.ok) {
  throw created.error;
}

const played = await client.play('guild:1', {
  query: 'ytsearch:deadmau5 strobe',
  sourceHints: ['youtube']
});
if (!played.ok) {
  throw played.error;
}
```

## Node Config

Minimal node configuration:

```ts
{
  id: 'main',
  host: '127.0.0.1',
  port: 2333,
  secure: false,
  password: 'youshallnotpass',
  userId: '123456789012345678',
  clientName: 'YukiTa/1.0',
  requestTimeoutMs: 10000,
  readyTimeoutMs: 12000,
  healthCheckIntervalMs: 15000,
  resumeSession: true,
  resumeTimeoutMs: 60000
}
```

## Resolve + Player Example

```ts
const resolved = await client.resolve('guild:1', 'daft punk', {
  sourceHints: ['youtube']
});

if (resolved.ok && resolved.value.result.kind === 'tracks') {
  await client.queueAdd('guild:1', {
    track: resolved.value.result.tracks[0]
  });
}
```

## Gateway Example

```ts
import { YukitaGatewayServer } from '@yukita/gateway';

const gateway = new YukitaGatewayServer(client, {
  port: 8080,
  path: '/yukita',
  auth: {
    mode: 'hmac',
    secret: process.env.GATEWAY_SECRET!
  },
  allowedOrigins: ['https://example.com'],
  rateLimit: {
    maxCommands: 60,
    windowMs: 30000
  }
});

await gateway.start();
```

## Documentation

- `docs/architecture.md`
- `docs/events.md`
- `docs/error-codes.md`
- `docs/plugins.md`
- `docs/gateway-protocol.md`

## Commands

- `pnpm lint`
- `pnpm typecheck`
- `pnpm typecheck:examples`
- `pnpm test`
- `pnpm build`
- `pnpm check`
- `pnpm examples:basic`
- `pnpm examples:gateway`
- `pnpm examples:discord`

`examples/gateway.ts` exits automatically after a short demo window.
Set `GATEWAY_EXAMPLE_KEEP_ALIVE=1` to keep the gateway running.

`examples/discord-bot.ts` is a full bot example with commands that cover:
`join/move/leave`, `play/pause/resume/stop/seek/volume`, queue operations,
filters, repeat modes, node management, resolver, metrics and resolve-cache plugin APIs.

Minimal env for Discord example:

```bash
DISCORD_TOKEN=your_bot_token
LAVALINK_HOST=127.0.0.1
LAVALINK_PORT=2333
LAVALINK_PASSWORD=youshallnotpass
```
