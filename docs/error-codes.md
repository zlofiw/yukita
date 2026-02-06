# Error Codes

YukiTa uses `YukitaError` with stable string codes.

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

All public methods return `Result<T>`:

- success: `{ ok: true, value: T }`
- failure: `{ ok: false, error: YukitaError }`
