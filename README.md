# YukiTa

TypeScript-first Lavalink toolkit for Node.js.

## Packages

- `@yukita/core` - node pool, resolver, player manager, queue and typed events.
- `@yukita/protocol` - Lavalink REST/WS clients, payload mapping, backoff.
- `@yukita/plugin-kit` - plugin contracts, Result primitives, shared errors.
- `@yukita/gateway` - WebSocket command/event gateway with auth + roles.
- `@yukita/connector-discord` - Discord voice-state/server adapter.
- `@yukita/plugins-metrics` - reference metrics plugin.
- `@yukita/plugins-resolve-cache` - reference resolve cache plugin.

## Install (Monorepo)

```bash
pnpm install
```

## Build

```bash
pnpm build
```

## Quick Start

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

const metrics = await client.use(new MetricsPlugin());
if (!metrics.ok) {
  throw metrics.error;
}

const cache = await client.use(new ResolveCachePlugin());
if (!cache.ok) {
  throw cache.error;
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

```ts
{
  id: 'main',
  host: '127.0.0.1',
  port: 2333,
  secure: false,
  password: 'youshallnotpass',
  userId: '123456789012345678',
  requestTimeoutMs: 10000,
  readyTimeoutMs: 12000,
  healthCheckIntervalMs: 15000,
  resumeSession: true,
  resumeTimeoutMs: 60000
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
    secret: process.env.GATEWAY_SECRET ?? 'change-me'
  },
  allowedOrigins: ['https://example.com'],
  rateLimit: {
    maxCommands: 60,
    windowMs: 30000
  }
});

await gateway.start();
```

## Plugin Example

```ts
import {
  ok,
  type PluginInitContext,
  type Result,
  type YukitaPlugin
} from '@yukita/plugin-kit';

class HelloPlugin implements YukitaPlugin {
  public readonly name = 'hello-plugin';
  public readonly version = '1.0.0';
  public readonly compatibleRange = '^1.0.0';

  public async init(ctx: PluginInitContext): Promise<void | Result<void>> {
    ctx.registerHooks({
      onTrackEvent: (event) => {
        if (event.type === 'started') {
          ctx.logger.info('Track started', { contextId: event.contextId });
        }
      }
    });

    const extension = ctx.extendApi('hello', {
      ping: () => 'pong'
    });
    if (!extension.ok) {
      return extension;
    }

    return ok(undefined);
  }
}
```

## Docs (GitHub Pages)

- Local dev: `pnpm docs:dev`
- Production build: `pnpm docs:build`
- Main pages:
  - `/quick-start`
  - `/guides/plugin-development`
  - `/reference/architecture`
  - `/reference/events`
  - `/reference/error-codes`
  - `/reference/gateway-protocol`
  - `/reference/plugins`

## Commands

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm check`
- `pnpm docs:dev`
- `pnpm docs:build`

## CI / Release

- CI workflow: `.github/workflows/ci.yml`
- GitHub Pages deploy: `.github/workflows/docs-pages.yml`
- npm publish from tags (`v*.*.*`): `.github/workflows/publish.yml`
- Version sync helper: `pnpm version:all <x.y.z>`

## License

MIT
