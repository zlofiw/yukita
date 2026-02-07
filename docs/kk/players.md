# Плеерлер және кезек

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

Күй `player.snapshot()` арқылы қолжетімді және `player.state` оқиғалары арқылы жіберіледі.

## Кезек

```ts
await client.queueAdd(contextId, { query: 'ytsearch:strobe deadmau5' });
await client.queueShuffle(contextId);

// Repeat mode player ішінде.
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

Егер коннектор конфигурацияланған болса (қара: [Коннекторлар](./connectors)), join/leave сұрауын `YukitaPlayer` арқылы жасауға болады:

```ts
await player.connect('VOICE_CHANNEL_ID');
await player.disconnect();
```

Voice updates (state + server) бәрібір Discord-тан келіп, коннектор арқылы клиентке берiлуi керек.

## Events

```ts
const unsubscribe = client.on('track.started', ({ contextId, track }) => {
  console.log('track started', contextId, track.title);
});
```
