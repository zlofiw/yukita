# Plugins

Plugins are installed with:

```ts
await client.use(plugin);
```

## Contract

```ts
interface YukitaPlugin {
  name: string;
  version: string;
  compatibleRange: string;
  init(ctx: PluginInitContext): void | Result<void> | Promise<void | Result<void>>;
}
```

## Hooks

- `beforeResolve(payload)`
- `afterResolve(request, result)`
- `beforePlay(payload)`
- `afterPlay(payload)`
- `onNodeEvent(event)`
- `onPlayerEvent(event)`
- `onTrackEvent(event)`
- `onQueueEvent(event)`

## API Extension

Plugins can expose API under a namespace:

```ts
ctx.extendApi('metrics', {
  getSnapshot: () => ({})
});
```

Core exposes extensions via:

```ts
const metrics = client.getExtension<{ getSnapshot: () => unknown }>('metrics');
```

## Reference Plugins

- `@yukita/plugins-metrics`
  - counts resolve/play/event activity.
- `@yukita/plugins-resolve-cache`
  - caches resolve results using hooks and short-circuit resolve support.
