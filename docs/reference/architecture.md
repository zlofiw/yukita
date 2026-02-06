# Architecture

## Workspace Layout

- `packages/core`: player manager, queue, node pool, resolver orchestration, typed events.
- `packages/protocol`: Lavalink REST/WS clients, payload mapping, backoff.
- `packages/plugin-kit`: Result, YukitaError, plugin contracts, async event bus.
- `packages/gateway`: WebSocket command/event bridge for web and bot clients.
- `packages/docs`: npm module with bundled docs static assets.
- `packages/connectors/connector-discord`: Discord voice state/server adapter.
- `packages/plugins/*`: reference plugins (`metrics`, `resolve-cache`).

## Runtime Flow

1. Connector receives external voice events.
2. Core routes updates into player state.
3. NodePool selects a Lavalink node for resolve/playback.
4. Protocol layer handles REST/WS exchange with retry + reconnect.
5. Core emits typed events and dispatches plugin hooks.
6. Gateway streams snapshots/diffs and accepts control commands.

## Multi-node Strategy

NodePool supports these strategies:

- `penalty`
- `least-load`
- `lowest-latency`
- `round-robin`

Selection can include preferred node and exclude lists for failover.

## Consistency Guarantees

- Per-context event ordering is preserved.
- Queue state remains in core, not in Lavalink only.
- Failover migrates player voice/session state and restores playback telemetry.
- Public APIs use Result instead of throw-based flow control.

## Error Model

- Base type: `YukitaError`.
- Stable `code` values are documented in `/reference/error-codes`.
- Optional `meta` carries structured context.
- Optional `cause` keeps source exception.
