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
  clientName: 'YukitaSan/0.1',
  requestTimeoutMs: 10_000,
  restConcurrency: 4,
  readyTimeoutMs: 12_000,
  healthCheckIntervalMs: 15_000,

  // Resume support
  resumeSession: true,
  resumeTimeoutMs: 60_000
}
```

## Selection Strategies

`selectionStrategy` (client option):

- `penalty` (default)
- `least-load`
- `latency`
- `round-robin`

You can also override the strategy per selection request via `nodePool.select({ strategy })`.

