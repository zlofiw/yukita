# Architecture

## Packages

1. `@yukita/core`
   - `YukitaClient` orchestrates nodes, resolver, players and plugins.
   - `NodePool` manages multiple Lavalink nodes and selection strategies.
   - `YukitaPlayer` owns playback and queue state per `contextId`.
2. `@yukita/protocol`
   - `LavalinkRestClient` for `/loadtracks`, player/session endpoints, stats.
   - `LavalinkWsClient` for ws events with reconnect/backoff+jitter.
   - `LavalinkNode` combines REST+WS, health-check and session resume setup.
3. `@yukita/plugin-kit`
   - `YukitaPlugin` contract and hook payloads.
   - `YukitaError` + `Result<T>` shared primitives.
4. `@yukita/gateway`
   - WS command/event bridge with auth, roles and rate limiting.
5. `@yukita/connector-discord`
   - Adapter for Discord voice updates and join/move/leave utility payloads.
6. `@yukita/plugins-*`
   - reference plugins (`metrics`, `resolve-cache`).

## Event Flow

1. Connector forwards voice updates into `@yukita/core`.
2. `YukitaPlayer` sends voice/player updates to selected Lavalink node.
3. Lavalink websocket events are routed by `NodePool -> YukitaClient -> YukitaPlayer`.
4. Core emits typed events, preserving per-player ordering via internal event chains.
5. Plugins and gateway consume the same typed event stream.

## Failover

1. Node disconnect event is detected by `NodePool`.
2. Core selects fallback node using active strategy.
3. Player migrates node, re-sends voice payload, then restores track/position/filters.
4. Player emits state update with reason `failover`.

## Error Semantics

- Public methods return `Result<T, YukitaError>` style (`Result<T>`).
- No custom thrown errors are required for normal control flow.
- Stable error codes are documented in `docs/error-codes.md`.
