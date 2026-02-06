# Quick Start

## 1. Install

```bash
pnpm add @yukita/core @yukita/connector-discord @yukita/plugins-metrics @yukita/plugins-resolve-cache
```

## 2. Create Client

```ts
import { YukitaClient } from '@yukita/core';

const client = new YukitaClient({
  nodes: [
    {
      id: 'main',
      host: '127.0.0.1',
      port: 2333,
      secure: false,
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
```

## 3. Install Plugins

```ts
import { MetricsPlugin } from '@yukita/plugins-metrics';
import { ResolveCachePlugin } from '@yukita/plugins-resolve-cache';

const metricsResult = await client.use(new MetricsPlugin());
if (!metricsResult.ok) {
  throw metricsResult.error;
}

const cacheResult = await client.use(new ResolveCachePlugin({ ttlMs: 30_000 }));
if (!cacheResult.ok) {
  throw cacheResult.error;
}
```

## 4. Create Player + Play

```ts
const contextId = 'guild:123';

const created = await client.createPlayer(contextId, {
  guildId: '123',
  shardId: 0
});
if (!created.ok) {
  throw created.error;
}

const played = await client.play(contextId, {
  query: 'ytsearch:yoasobi idol',
  sourceHints: ['youtube']
});
if (!played.ok) {
  throw played.error;
}
```

## 5. Connect Discord Voice Updates

```ts
import { DiscordVoiceConnector } from '@yukita/connector-discord';

const connector = new DiscordVoiceConnector(
  client,
  {
    sendGatewayPayload: (shardId, payload) => {
      // send OP 4 Voice State Update via your Discord gateway implementation
    }
  },
  {
    // botUserId is optional; connector can detect it from incoming packets
  }
);

// route Discord gateway packets into connector.handleGatewayPayload(...)
```

## 6. Optional Gateway Server

```ts
import { YukitaGatewayServer } from '@yukita/gateway';

const gateway = new YukitaGatewayServer(client, {
  port: 8080,
  path: '/yukita',
  auth: {
    mode: 'hmac',
    secret: process.env.GATEWAY_SECRET ?? 'change-me'
  },
  allowedOrigins: ['https://your-site.example'],
  rateLimit: {
    maxCommands: 60,
    windowMs: 30_000
  }
});

await gateway.start();
```

## Result Pattern

All public methods return `Result<T, YukitaError>`:

- success: `{ ok: true, value }`
- failure: `{ ok: false, error }`

See `/reference/error-codes` for stable codes.