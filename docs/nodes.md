# Nodes & Load Balancing

## Node Config

```ts
{
  id: 'main',
  host: '127.0.0.1',
  port: 2333,
  secure: false,
  password: 'youshallnotpass',
  userId: '123456789012345678',

  // Optional
  clientName: 'YukitaSan/<version>',
  requestTimeoutMs: 10_000,
  restConcurrency: 4,
  readyTimeoutMs: 12_000,
  healthCheckIntervalMs: 15_000,

  // Resume support
  resumeSession: true,
  resumeTimeoutMs: 60_000
}
```

## Lifecycle

YukitaSan manages WS + REST for each node:

- WS connects to `/v4/websocket` with required headers and an optional `Session-Id` for resume.
- After WS `ready`, REST `updateSession` is called when `resumeSession: true`.
- On reconnect:
  `ready.resumed === true`: players are assumed to exist on Lavalink and no resync is forced.
  `ready.resumed === false`: players are re-synced (voice + current track state).

## Failover

When a node disconnects and resume is enabled, YukitaSan waits up to `resumeTimeoutMs` (capped) before migrating affected players to another connected node.

To disable resume-first behavior, set `resumeSession: false`.

## Selection Strategies

`selectionStrategy` (client option):

- `penalty` (default)
- `least-load`
- `latency`
- `round-robin`

You can also override the strategy per selection request via `nodePool.select({ strategy })`.

## Custom Selection Function

You can provide a function strategy:

```ts
const client = new YukitaSan({
  nodes: [...],
  selectionStrategy: (nodes, request) => {
    if (request.preferredNodeId) {
      return nodes.find((node) => node.id === request.preferredNodeId) ?? null;
    }
    return nodes[0] ?? null;
  }
});
```
