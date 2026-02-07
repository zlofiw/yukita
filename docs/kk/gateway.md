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
```

The server also supports `context:<id>` topics for per-guild/player streams.

