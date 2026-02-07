# Түйіндер және баланс

## Түйін конфигі

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

## Өмірлік цикл

YukitaSan әр түйін үшін WS + REST басқарады:

- WS `/v4/websocket` адресіне міндетті headers және resume үшін опциялық `Session-Id` арқылы қосылады.
- WS `ready` кейін, `resumeSession: true` болса REST `updateSession` шақырылады.
- Reconnect кезінде:
  `ready.resumed === true`: player-лер Lavalink жағында бар деп есептеледі, forced resync жасалмайды.
  `ready.resumed === false`: player-лер қайта синхрондалады (voice + current track state).

## Failover

Түйін ажыраса және resume қосулы болса, YukitaSan `resumeTimeoutMs` уақытына дейін (cap бар) күтіп, содан кейін affected player-лерді басқа connected түйінге көшіреді.

Resume-first мінез-құлқын өшіру үшін `resumeSession: false` қой.

## Түйін таңдау стратегиялары

`selectionStrategy` (клиент опциясы):

- `penalty` (default)
- `least-load`
- `latency`
- `round-robin`

Стратегияны нақты таңдауда ауыстыруға болады: `nodePool.select({ strategy })`.

## Custom таңдау функциясы

Функция беруге болады:

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
