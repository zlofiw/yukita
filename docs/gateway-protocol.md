# Gateway Protocol

All frames use one envelope:

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

## Acknowledgements (`op=ack`)

Successful command response contains:

- `t`: original command type
- `id`: original correlation id
- `d`: structured response payload (usually latest player snapshot)

## Errors (`op=err`)

Error payload:

```json
{
  "code": "RATE_LIMITED",
  "message": "Command rate limit exceeded",
  "meta": {}
}
```

## Events (`op=event`)

Gateway forwards core events. Suggested subscriptions:

- `node`
- `node:<nodeId>`
- `context:<contextId>`
- `context:<contextId>:player`
- `context:<contextId>:track`
- `context:<contextId>:queue`

On `subscribe` for `context:<contextId>`, gateway sends immediate `snapshot` event if player exists.

Event stream semantics:

- `snapshot`: full state bootstrap (`contextId`, `snapshot`).
- `player.state`: incremental player-state updates (position/pause/filters/voice/failover reasons).
- `queue.updated`: queue diffs (`add/remove/move/shuffle/clear/advance/repeat-mode`).
- `node.stats`: periodic node statistics.

## Security

- Auth: `jwt` or `hmac` token.
- Roles:
  - `web:read`
  - `bot:control`
  - `admin`
- Control commands require `bot:control` or `admin`.
- Subscribe commands require `web:read` or `admin`.
- Fixed-window command rate limiting is enforced per session.
