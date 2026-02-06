# Events

Core events (`YukitaClient.on(...)`):

- `node.connected` `{ nodeId, resumed }`
- `node.disconnected` `{ nodeId, code, reason }`
- `node.error` `{ nodeId, error }`
- `node.stats` `{ nodeId, stats }`
- `player.created` `{ contextId, snapshot }`
- `player.destroyed` `{ contextId, snapshot }`
- `player.state` `{ contextId, snapshot, reason }`
- `track.started` `{ contextId, track, nodeId }`
- `track.ended` `{ contextId, track, reason, nodeId }`
- `track.stuck` `{ contextId, payload, nodeId }`
- `track.exception` `{ contextId, payload, nodeId }`
- `queue.updated` `{ contextId, queue, reason }`
- `resolve.completed` `{ contextId, query, output }`
- `resolve.failed` `{ contextId, query, error }`

## Ordering Guarantee

For events bound to a single `contextId`, dispatch order is guaranteed by an internal per-context async chain:

1. each new event for context waits previous one,
2. listeners run sequentially and safely,
3. plugin hooks are dispatched in the same ordered phase.
