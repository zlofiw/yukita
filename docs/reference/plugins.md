# Plugin Hooks

Install plugins via `client.use(plugin)`.

## Contract

```ts
interface YukitaPlugin {
  name: string;
  version: string;
  compatibleRange: string;
  init(ctx: PluginInitContext): void | Result<void> | Promise<void | Result<void>>;
}
```

## Hook Surface

- `beforeResolve(payload)`
- `afterResolve(request, result)`
- `beforePlay(payload)`
- `afterPlay(payload)`
- `onNodeEvent(event)`
- `onPlayerEvent(event)`
- `onTrackEvent(event)`
- `onQueueEvent(event)`

## Extension Namespaces

Plugins can expose runtime APIs without prototype patching:

```ts
ctx.extendApi('metrics', {
  getSnapshot: () => ({})
});

const metrics = client.getExtension<{ getSnapshot: () => unknown }>('metrics');
if (metrics.ok) {
  console.log(metrics.value.getSnapshot());
}
```

## Reference Plugins

- `@yukita/plugins-metrics`
  - counters for resolve/play/node/player/track/queue activity.
- `@yukita/plugins-resolve-cache`
  - before/after resolve hooks with TTL cache and short-circuit resolve path.

For a full custom plugin walk-through, see `/guides/plugin-development`.