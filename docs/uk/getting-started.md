# Getting Started

## Requirements

- Node.js >= 20
- Lavalink v4 (REST: `/v4/*`, WS: `/v4/websocket`)

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

## Resolve Tracks

```ts
const resolved = await client.resolve('guild:1', 'ytsearch:daft punk around the world');
if (!resolved.ok) throw resolved.error;
```

## Create Player

```ts
const created = await client.createPlayer('guild:1', {
  guildId: '123',
  shardId: 0
});
if (!created.ok) throw created.error;

const player = created.value;
```

## Shutdown

```ts
await client.shutdown();
```

