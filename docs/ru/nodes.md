# Ноды и балансировка

## Конфиг ноды

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

## Жизненный цикл

YukitaSan управляет WS + REST для каждой ноды:

- WS подключается к `/v4/websocket` с обязательными заголовками и опциональным `Session-Id` для resume.
- После WS `ready` вызывается REST `updateSession`, если `resumeSession: true`.
- При reconnect:
  `ready.resumed === true`: игроки считаются существующими на Lavalink, принудительный resync не делается.
  `ready.resumed === false`: игроки ресинхронизируются (voice + текущий track state).

## Failover

Когда нода отвалилась и resume включён, YukitaSan ждёт до `resumeTimeoutMs` (с верхним cap) перед тем как мигрировать затронутые players на другую подключённую ноду.

Чтобы отключить resume-first поведение, установи `resumeSession: false`.

## Стратегии выбора ноды

`selectionStrategy` (опция клиента):

- `penalty` (default)
- `least-load`
- `latency`
- `round-robin`

Стратегию можно переопределять на конкретный выбор: `nodePool.select({ strategy })`.

## Кастомная функция выбора

Можно передать функцию:

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
