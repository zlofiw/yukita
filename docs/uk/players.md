# Players & Queue

## Player Lifecycle

```ts
const created = await client.createPlayer('guild:1', { guildId: '123', shardId: 0 });
if (!created.ok) throw created.error;

const player = created.value;
```

Destroy:

```ts
await client.destroyPlayer('guild:1');
```

## Queue

```ts
await client.queueAdd('guild:1', { query: 'ytsearch:strobe deadmau5' });
await client.queueShuffle('guild:1');
await client.queueClear('guild:1');
```

## Playback

```ts
await client.play('guild:1', { query: 'ytsearch:daft punk around the world' });
await client.pause('guild:1');
await client.resume('guild:1');
await client.seek('guild:1', 30_000);
await client.setVolume('guild:1', 100);
```

## Voice Connect/Disconnect

If you configured a connector (see [Connectors](./connectors)), you can request join/leave via `YukitaPlayer`:

```ts
await player.connect('VOICE_CHANNEL_ID');
await player.disconnect();
```

Voice updates (state + server) must still be received from Discord and passed into the client by the connector.
