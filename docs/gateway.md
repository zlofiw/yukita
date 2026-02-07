# WebSocket Gateway

YukitaSan includes a WebSocket gateway (as a plugin) for dashboards and external clients.

## Browser Constraint

Browsers cannot set arbitrary headers during the WebSocket handshake (for example `Authorization`), so the gateway supports multiple auth transports:

1. Query param token: `wss://.../yukitasan?token=...`
2. Subprotocol token via `Sec-WebSocket-Protocol`
3. First `auth` message after connect (challenge/response)

## Plugin Setup

```ts
import { createWebsocketGatewayPlugin } from 'yukitasan';

await client.use(
  createWebsocketGatewayPlugin({
    port: 8080,
    path: '/yukitasan',
    auth: {
      mode: 'hmac',
      secret: process.env.GATEWAY_SECRET ?? 'change-me'
    }
  })
);
```

## Roles

Gateway authorization is role-based:

- `web:read`: subscribe/read-only
- `bot:control`: can send playback control commands
- `admin`: full access

## Auth: Query Token

```ts
new WebSocket('wss://localhost:8080/yukitasan?token=YOUR_TOKEN');
```

## Auth: Subprotocol

```ts
new WebSocket('wss://localhost:8080/yukitasan', [
  'yukitasan.v1',
  'yukitasan.token.YOUR_TOKEN'
]);
```

## Auth: First Message

1. Connect without token
2. Server sends `hello` with `challenge`
3. Client replies with `auth`

```ts
const ws = new WebSocket('wss://localhost:8080/yukitasan');

ws.onmessage = (event) => {
  const frame = JSON.parse(event.data);
  if (frame.op === 'hello') {
    ws.send(
      JSON.stringify({
        op: 'auth',
        t: 'auth',
        id: crypto.randomUUID(),
        ts: Date.now(),
        d: {
          token: 'YOUR_TOKEN',
          challenge: frame.d.challenge
        }
      })
    );
  }
};
```

## Subscriptions

Send commands:

```json
{ "op":"cmd", "t":"subscribe", "id":"...", "ts": 0, "d": { "topic":"nodes" } }
{ "op":"cmd", "t":"subscribe", "id":"...", "ts": 0, "d": { "topic":"players" } }
{ "op":"cmd", "t":"subscribe", "id":"...", "ts": 0, "d": { "topic":"events" } }
{ "op":"cmd", "t":"subscribe", "id":"...", "ts": 0, "d": { "topic":"metrics" } }
```

The server also supports `context:<id>` topics for per-guild/player streams.

## Commands

Built-in command types:

- `play`, `pause`, `resume`, `stop`, `seek`, `volume`
- `queue.add`, `queue.remove`, `queue.move`, `queue.clear`, `queue.shuffle`
- `filters.apply`, `filters.clear`

Each command is sent as:

```json
{ "op":"cmd", "t":"pause", "id":"...", "ts": 0, "d": { "contextId": "123" } }
```

## Safety (Redaction)

For `web:read` sessions the gateway redacts sensitive data:

- Discord voice secrets are removed from snapshots
- `track.encoded` is stripped from events/snapshots unless the session has `bot:control` (or `admin`)

If your UI needs control operations that require `encoded`, authenticate with `bot:control`.

## Custom Topics and Commands (Plugins)

The gateway server can be extended from plugins (publish new topics, register custom commands).
See `examples/plugin/index.ts`.
