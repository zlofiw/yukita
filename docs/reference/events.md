# Events

Core event names are emitted by `YukitaClient.on(event, listener)`.

## Node

- `node.connected` `{ nodeId, resumed }`
- `node.disconnected` `{ nodeId, code, reason }`
- `node.error` `{ nodeId, error }`
- `node.stats` `{ nodeId, stats }`

## Player

- `player.created` `{ contextId, snapshot }`
- `player.destroyed` `{ contextId, snapshot }`
- `player.state` `{ contextId, snapshot, reason }`

## Track

- `track.started` `{ contextId, track, nodeId }`
- `track.ended` `{ contextId, track, reason, nodeId }`
- `track.stuck` `{ contextId, payload, nodeId }`
- `track.exception` `{ contextId, payload, nodeId }`

## Queue

- `queue.updated` `{ contextId, queue, reason }`

## Resolve

- `resolve.completed` `{ contextId, query, output }`
- `resolve.failed` `{ contextId, query, error }`

## Ordering

For the same `contextId`, events are dispatched in strict sequence:

1. Next event waits for previous dispatch completion.
2. Async listener errors are isolated and reported.
3. Plugin event hooks run in the same ordered phase.

This prevents race conditions between queue/player updates.