# Glossary

- `contextId`: Application-level identifier used by YukitaSan to route events/state. In Discord bots, using `guildId` as `contextId` is the simplest approach.
- `guildId`: Discord guild id (string).
- `node`: A single Lavalink connection (WS + REST).
- `nodePool`: Manages nodes and selection/failover strategies.
- `player`: A playback controller scoped to a single `contextId`/`guildId`.
- `connector`: A thin adapter that connects YukitaSan to a Discord library (voice updates in, OP 4 packets out).
- `sessionId`: Lavalink WS session id (used for resume).
- `gateway`: YukitaSan WebSocket server for dashboards/external clients.
- `topic`: Subscription key in gateway (`nodes`, `players`, `events`, `metrics`, `context:<id>`, ...).
- `roles`: Gateway authz roles (`web:read`, `bot:control`, `admin`).

