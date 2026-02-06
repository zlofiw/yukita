# Error Codes

All public APIs return `Result<T, YukitaError>`.

- Success: `{ ok: true, value }`
- Failure: `{ ok: false, error }`

## Base Shape

```ts
interface YukitaError {
  code: string;
  message: string;
  meta?: Record<string, unknown>;
  cause?: unknown;
}
```

## Codes

- `INVALID_ARGUMENT`
- `INTERNAL_ERROR`
- `TIMEOUT`
- `AUTH_FAILED`
- `RATE_LIMITED`
- `COMMAND_NOT_ALLOWED`
- `NODE_NOT_FOUND`
- `NODE_UNAVAILABLE`
- `NODE_CONNECT_FAILED`
- `NODE_DISCONNECTED`
- `NODE_REST_FAILED`
- `NODE_WS_FAILED`
- `RESOLVE_FAILED`
- `LOAD_FAILED`
- `PLAYER_NOT_FOUND`
- `PLAYER_ALREADY_EXISTS`
- `PLAYER_OPERATION_FAILED`
- `PLAYER_UPDATE_FAILED`
- `QUEUE_OUT_OF_RANGE`
- `PLUGIN_INIT_FAILED`
- `INCOMPATIBLE_PLUGIN`

## Mapping Guidance

- Use `INVALID_ARGUMENT` for validation and malformed input.
- Use `NODE_*` for transport/session/node health failures.
- Use `RESOLVE_FAILED` when no tracks matched.
- Use `LOAD_FAILED` when Lavalink reported provider-side load errors.
- Use `PLAYER_*` for playback state transition failures.
- Keep `meta` deterministic and machine-readable.