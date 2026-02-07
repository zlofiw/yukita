# REST және LavalinkResponse

`LavalinkRestClient` Lavalink v4 REST-ті орайды және дискриминацияланған union `LavalinkResponse<T>` қайтарады.

## LavalinkResponse

```ts
type LavalinkResponse<T> =
  | { ok: true; kind: 'ok'; value: T; meta: { requestId; nodeId; endpoint; tookMs; ... } }
  | { ok: false; kind: 'error' | 'timeout' | 'aborted' | 'invalidPayload'; error: { code; message; details?; cause? }; meta: ... }
```

`meta` әрқашан мыналарды қамтиды:

- `requestId`: әр сұрау үшін бірегей id
- `nodeId`: конфигтен түйін id
- `endpoint`: мысалы `GET /stats`
- `tookMs`: миллисекундтағы ұзақтығы

## Мысал

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

## Middleware hooks (плагиндер)

Плагиндер REST шақыруларын бақылап/кеңейте алады:

- `onRestRequest(ctx)`: `ctx.meta` ішіне қосымша өрістер қосуға болады
- `onRestResponse(ctx, res)`: `res.meta` және `res.value` тексеру
- `onRestError(ctx, error)`: нормаланған қателерді тексеру

## Қамту

Typed helpers:

- `/version`, `/v4/info`, `/v4/stats`
- `/v4/loadtracks`, `/v4/decodetrack`, `/v4/decodetracks`
- `/v4/sessions/*` (players + session update)
- `/v4/routeplanner/*`

Қалғаны үшін `node.rest.raw({ path, method, ... })` қолдан.

## Retry және concurrency

REST клиент әдейі “сақ”:

- retry тек idempotent сұрауларға
- 429 кезінде `Retry-After` ескереді
- параллелизмді `restConcurrency` арқылы шектейді (әдепкі `4`)
