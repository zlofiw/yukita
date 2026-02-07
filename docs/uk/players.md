# Плеєри та черга

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

Стан доступний через `player.snapshot()` і емiтиться через події `player.state`.

## Черга

```ts
await client.queueAdd(contextId, { query: 'ytsearch:strobe deadmau5' });
await client.queueShuffle(contextId);

// Repeat mode живе на player.
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

Якщо налаштований конектор (див. [Конектори](./connectors)), можна запитати join/leave через `YukitaPlayer`:

```ts
await player.connect('VOICE_CHANNEL_ID');
await player.disconnect();
```

Voice updates (state + server) все одно мають приходити з Discord і прокидатися в клієнт конектором.

## Events

```ts
const unsubscribe = client.on('track.started', ({ contextId, track }) => {
  console.log('track started', contextId, track.title);
});
```
