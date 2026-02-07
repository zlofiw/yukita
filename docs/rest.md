# REST & LavalinkResponse

`LavalinkRestClient` wraps Lavalink v4 REST and returns a discriminated union `LavalinkResponse<T>`.

## LavalinkResponse

```ts
type LavalinkResponse<T> =
  | { ok: true; kind: 'ok'; value: T; meta: { requestId; nodeId; endpoint; tookMs; ... } }
  | { ok: false; kind: 'error' | 'timeout' | 'aborted' | 'invalidPayload'; error: { code; message; details?; cause? }; meta: ... }
```

`meta` always contains:

- `requestId`: unique id generated per request
- `nodeId`: node id from config
- `endpoint`: e.g. `GET /stats`
- `tookMs`: duration in milliseconds

## Example

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

## Middleware Hooks (Plugins)

Plugins can observe/augment REST calls using hooks:

- `onRestRequest(ctx)`: you can attach extra fields to `ctx.meta`
- `onRestResponse(ctx, res)`: inspect `res.meta` and `res.value`
- `onRestError(ctx, error)`: inspect normalized errors

## Coverage

Typed helpers include:

- `/version`, `/v4/info`, `/v4/stats`
- `/v4/loadtracks`, `/v4/decodetrack`, `/v4/decodetracks`
- `/v4/sessions/*` (players + session update)
- `/v4/routeplanner/*`

For anything else, use `node.rest.raw({ path, method, ... })`.

## Retry and Concurrency

The REST client is intentionally conservative:

- retries only idempotent requests
- respects `Retry-After` on 429
- limits in-flight requests via `restConcurrency` (default `4`)
