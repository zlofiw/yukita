# Players & Queue

## Player Lifecycle

```ts
const contextId = guildId;

const created = await client.createPlayer(contextId, { guildId, shardId: 0 });
if (!created.ok) throw created.error;

const player = created.value;
```

Destroy:

```ts
await client.destroyPlayer(contextId);
```

## Snapshot

Player state is available via `player.snapshot()` and emitted through `player.state` events.

## Queue

```ts
await client.queueAdd(contextId, { query: 'ytsearch:strobe deadmau5' });
await client.queueShuffle(contextId);

// Repeat mode lives on the player.
await player.setRepeatMode('queue');

await client.queueClear(contextId);
```

## Playback

```ts
await client.play(contextId, { query: 'ytsearch:daft punk around the world' });
await client.pause(contextId);
await client.resume(contextId);
await client.seek(contextId, 30_000);
await client.setVolume(contextId, 100);
```

## Voice Connect/Disconnect

If you configured a connector (see [Connectors](./connectors)), you can request join/leave via `YukitaPlayer`:

```ts
await player.connect('VOICE_CHANNEL_ID');
await player.disconnect();
```

Voice updates (state + server) must still be received from Discord and passed into the client by the connector.

## Events

```ts
const unsubscribe = client.on('track.started', ({ contextId, track }) => {
  console.log('track started', contextId, track.title);
});
```
