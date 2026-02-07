# REST та LavalinkResponse

`LavalinkRestClient` обгортає Lavalink v4 REST і повертає дискримінований union `LavalinkResponse<T>`.

## LavalinkResponse

```ts
type LavalinkResponse<T> =
  | { ok: true; kind: 'ok'; value: T; meta: { requestId; nodeId; endpoint; tookMs; ... } }
  | { ok: false; kind: 'error' | 'timeout' | 'aborted' | 'invalidPayload'; error: { code; message; details?; cause? }; meta: ... }
```

`meta` завжди містить:

- `requestId`: унікальний id для запиту
- `nodeId`: id ноди з конфіга
- `endpoint`: наприклад `GET /stats`
- `tookMs`: тривалість у мілісекундах

## Приклад

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

## Middleware hooks (плагіни)

Плагіни можуть спостерігати/розширювати REST виклики:

- `onRestRequest(ctx)`: можна додавати поля в `ctx.meta`
- `onRestResponse(ctx, res)`: інспектувати `res.meta` і `res.value`
- `onRestError(ctx, error)`: інспектувати нормалізовані помилки

## Покриття

Typed helpers містять:

- `/version`, `/v4/info`, `/v4/stats`
- `/v4/loadtracks`, `/v4/decodetrack`, `/v4/decodetracks`
- `/v4/sessions/*` (players + session update)
- `/v4/routeplanner/*`

Для всього іншого використовуй `node.rest.raw({ path, method, ... })`.

## Retry та concurrency

REST клієнт навмисно “консервативний”:

- ретраї тільки для ідемпотентних запитів
- враховує `Retry-After` на 429
- обмежує паралелізм через `restConcurrency` (за замовчуванням `4`)
