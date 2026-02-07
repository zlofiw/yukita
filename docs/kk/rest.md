# REST & LavalinkResponse

`LavalinkRestClient` wraps Lavalink v4 REST and returns a discriminated union `LavalinkResponse<T>`.

## LavalinkResponse

```ts
type LavalinkResponse<T> =
  | { ok: true; kind: 'ok'; value: T; meta: { requestId; nodeId; endpoint; tookMs; ... } }
  | { ok: false; kind: 'error' | 'timeout' | 'aborted' | 'invalidPayload'; error: { code; message; details?; cause? }; meta: ... }
```

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

## Coverage

Typed helpers include:

- `/version`, `/v4/info`, `/v4/stats`
- `/v4/loadtracks`, `/v4/decodetrack`, `/v4/decodetracks`
- `/v4/sessions/*` (players + session update)
- `/v4/routeplanner/*`

For anything else, use `node.rest.raw({ path, method, ... })`.

