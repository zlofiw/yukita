# Gateway Protocol

`@yukita/gateway` uses one frame envelope:

```json
{
  "op": "event|cmd|ack|err",
  "t": "string",
  "id": "string",
  "ts": 1738886400000,
  "d": {}
}
```

## Commands (`op=cmd`)

- `play`
- `pause`
- `resume`
- `stop`
- `seek`
- `volume`
- `queue.add`
- `queue.remove`
- `queue.move`
- `queue.clear`
- `queue.shuffle`
- `filters.apply`
- `filters.clear`
- `subscribe`
- `unsubscribe`

## Ack (`op=ack`)

- `t`: command type echoed back.
- `id`: command correlation id.
- `d`: command result payload (usually player snapshot).

## Error (`op=err`)

```json
{
  "code": "RATE_LIMITED",
  "message": "Command rate limit exceeded",
  "meta": {}
}
```

## Event (`op=event`)

Common stream topics:

- `node`
- `node:<nodeId>`
- `context:<contextId>`
- `context:<contextId>:player`
- `context:<contextId>:track`
- `context:<contextId>:queue`

On `subscribe` for `context:<contextId>`, gateway can emit immediate `snapshot` event.

## Security

Auth modes:

- `jwt`
- `hmac`

Roles:

- `web:read`
- `bot:control`
- `admin`

Policy:

- Control commands require `bot:control` or `admin`.
- Read subscriptions require `web:read` or `admin`.
- Fixed-window rate limiting applies per session.
- Optional `allowedOrigins` filter is enforced during handshake.