# Ноди та балансування

## Конфіг ноди

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

## Життєвий цикл

YukitaSan керує WS + REST для кожної ноди:

- WS підключається до `/v4/websocket` з обов'язковими заголовками та опційним `Session-Id` для resume.
- Після WS `ready` викликається REST `updateSession`, якщо `resumeSession: true`.
- Під час reconnect:
  `ready.resumed === true`: гравці вважаються існуючими на Lavalink, примусовий resync не робиться.
  `ready.resumed === false`: гравці ресинхронізуються (voice + поточний track state).

## Failover

Коли нода відключилась і resume увімкнений, YukitaSan чекає до `resumeTimeoutMs` (з верхнім cap) перед тим як мігрувати зачеплені players на іншу підключену ноду.

Щоб вимкнути resume-first поведінку, встанови `resumeSession: false`.

## Стратегії вибору ноди

`selectionStrategy` (опція клієнта):

- `penalty` (default)
- `least-load`
- `latency`
- `round-robin`

Стратегію можна перевизначати на конкретний вибір: `nodePool.select({ strategy })`.

## Кастомна функція вибору

Можна передати функцію:

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
