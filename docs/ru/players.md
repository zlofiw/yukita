# Плееры и очередь

## Lifecycle

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

Состояние доступно через `player.snapshot()` и эмитится через события `player.state`.

## Очередь

```ts
await client.queueAdd(contextId, { query: 'ytsearch:strobe deadmau5' });
await client.queueShuffle(contextId);

// Repeat mode живёт на player.
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

Если настроен коннектор (см. [Коннекторы](./connectors)), можно запросить join/leave через `YukitaPlayer`:

```ts
await player.connect('VOICE_CHANNEL_ID');
await player.disconnect();
```

Voice updates (state + server) всё равно должны приходить из Discord и прокидываться в клиент коннектором.

## Events

```ts
const unsubscribe = client.on('track.started', ({ contextId, track }) => {
  console.log('track started', contextId, track.title);
});
```
