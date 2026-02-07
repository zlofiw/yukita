# REST и LavalinkResponse

`LavalinkRestClient` оборачивает Lavalink v4 REST и возвращает дискриминируемый union `LavalinkResponse<T>`.

## LavalinkResponse

```ts
type LavalinkResponse<T> =
  | { ok: true; kind: 'ok'; value: T; meta: { requestId; nodeId; endpoint; tookMs; ... } }
  | { ok: false; kind: 'error' | 'timeout' | 'aborted' | 'invalidPayload'; error: { code; message; details?; cause? }; meta: ... }
```

`meta` всегда содержит:

- `requestId`: уникальный id на запрос
- `nodeId`: id ноды из конфига
- `endpoint`: например `GET /stats`
- `tookMs`: длительность в миллисекундах

## Пример

```ts
const node = client.nodePool.getNode('main');
if (!node) throw new Error('node missing');

const res = await node.rest.getStats();
if (!res.ok) {
  console.error(res.kind, res.error.code, res.error.message, res.meta.requestId);
  return;
}

console.log('players', res.value.players, 'took', res.meta.tookMs);
```

## Middleware hooks (плагины)

Плагины могут наблюдать/расширять REST вызовы:

- `onRestRequest(ctx)`: можно добавлять поля в `ctx.meta`
- `onRestResponse(ctx, res)`: инспектировать `res.meta` и `res.value`
- `onRestError(ctx, error)`: инспектировать нормализованные ошибки

## Покрытие

Typed helpers включают:

- `/version`, `/v4/info`, `/v4/stats`
- `/v4/loadtracks`, `/v4/decodetrack`, `/v4/decodetracks`
- `/v4/sessions/*` (players + session update)
- `/v4/routeplanner/*`

Для всего остального используй `node.rest.raw({ path, method, ... })`.

## Retry и concurrency

REST клиент намеренно “консервативный”:

- ретраи только для идемпотентных запросов
- учитывает `Retry-After` на 429
- ограничивает параллелизм через `restConcurrency` (по умолчанию `4`)
