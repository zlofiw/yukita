[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / DefinePluginContext

# Interface: DefinePluginContext

Defined in: [src/plugins/definePlugin.ts:23](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/definePlugin.ts#L23)

## Properties

### coreVersion

> **coreVersion**: `string`

Defined in: [src/plugins/definePlugin.ts:24](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/definePlugin.ts#L24)

***

### logger

> **logger**: [`PluginLogger`](PluginLogger.md)

Defined in: [src/plugins/definePlugin.ts:25](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/definePlugin.ts#L25)

***

### client

> **client**: [`YukitaSan`](../classes/YukitaSan.md)

Defined in: [src/plugins/definePlugin.ts:26](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/definePlugin.ts#L26)

***

### extendApi()

> **extendApi**: \<`TApi`\>(`namespace`, `api`) => [`Result`](../type-aliases/Result.md)\<`void`\>

Defined in: [src/plugins/definePlugin.ts:28](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/definePlugin.ts#L28)

#### Type Parameters

##### TApi

`TApi` *extends* `object`

#### Parameters

##### namespace

`string`

##### api

`TApi`

#### Returns

[`Result`](../type-aliases/Result.md)\<`void`\>

***

### hooks

> **hooks**: `object`

Defined in: [src/plugins/definePlugin.ts:30](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/plugins/definePlugin.ts#L30)

#### onInit()

> **onInit**: (`handler`) => `void`

##### Parameters

###### handler

() => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

##### Returns

`void`

#### onShutdown()

> **onShutdown**: (`handler`) => `void`

##### Parameters

###### handler

() => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

##### Returns

`void`

#### onNodeConnect()

> **onNodeConnect**: (`handler`) => `void`

##### Parameters

###### handler

[`HookFn`](../type-aliases/HookFn.md)\<[`PluginNodeEvent`](PluginNodeEvent.md)\>

##### Returns

`void`

#### onNodeReady()

> **onNodeReady**: (`handler`) => `void`

##### Parameters

###### handler

[`HookFn`](../type-aliases/HookFn.md)\<[`PluginNodeEvent`](PluginNodeEvent.md)\>

##### Returns

`void`

#### onNodeDisconnect()

> **onNodeDisconnect**: (`handler`) => `void`

##### Parameters

###### handler

[`HookFn`](../type-aliases/HookFn.md)\<[`PluginNodeEvent`](PluginNodeEvent.md)\>

##### Returns

`void`

#### onPlayerCreate()

> **onPlayerCreate**: (`handler`) => `void`

##### Parameters

###### handler

[`HookFn`](../type-aliases/HookFn.md)\<[`PluginPlayerEvent`](PluginPlayerEvent.md)\>

##### Returns

`void`

#### onPlayerDestroy()

> **onPlayerDestroy**: (`handler`) => `void`

##### Parameters

###### handler

[`HookFn`](../type-aliases/HookFn.md)\<[`PluginPlayerEvent`](PluginPlayerEvent.md)\>

##### Returns

`void`

#### onTrackStart()

> **onTrackStart**: (`handler`) => `void`

##### Parameters

###### handler

[`HookFn`](../type-aliases/HookFn.md)\<[`PluginTrackEvent`](PluginTrackEvent.md)\>

##### Returns

`void`

#### onTrackEnd()

> **onTrackEnd**: (`handler`) => `void`

##### Parameters

###### handler

[`HookFn`](../type-aliases/HookFn.md)\<[`PluginTrackEvent`](PluginTrackEvent.md)\>

##### Returns

`void`

#### onTrackException()

> **onTrackException**: (`handler`) => `void`

##### Parameters

###### handler

[`HookFn`](../type-aliases/HookFn.md)\<[`PluginTrackEvent`](PluginTrackEvent.md)\>

##### Returns

`void`

#### onTrackStuck()

> **onTrackStuck**: (`handler`) => `void`

##### Parameters

###### handler

[`HookFn`](../type-aliases/HookFn.md)\<[`PluginTrackEvent`](PluginTrackEvent.md)\>

##### Returns

`void`

#### onQueueUpdated()

> **onQueueUpdated**: (`handler`) => `void`

##### Parameters

###### handler

[`HookFn`](../type-aliases/HookFn.md)\<[`PluginQueueEvent`](PluginQueueEvent.md)\>

##### Returns

`void`

#### beforeResolve()

> **beforeResolve**: (`handler`) => `void`

##### Parameters

###### handler

(`payload`) => `void` \| [`BeforeResolvePayload`](BeforeResolvePayload.md) \| [`Result`](../type-aliases/Result.md)\<[`BeforeResolvePayload`](BeforeResolvePayload.md)\> \| `Promise`\<void \| BeforeResolvePayload \| Result\<BeforeResolvePayload\>\>

##### Returns

`void`

#### afterResolve()

> **afterResolve**: (`handler`) => `void`

##### Parameters

###### handler

(`request`, `result`) => `void` \| [`YukitaResolveModel`](../type-aliases/YukitaResolveModel.md) \| [`Result`](../type-aliases/Result.md)\<[`YukitaResolveModel`](../type-aliases/YukitaResolveModel.md)\> \| `Promise`\<void \| YukitaResolveModel \| Result\<YukitaResolveModel\>\>

##### Returns

`void`

#### beforePlay()

> **beforePlay**: (`handler`) => `void`

##### Parameters

###### handler

(`payload`) => `void` \| [`BeforePlayPayload`](BeforePlayPayload.md) \| [`Result`](../type-aliases/Result.md)\<[`BeforePlayPayload`](BeforePlayPayload.md)\> \| `Promise`\<void \| BeforePlayPayload \| Result\<BeforePlayPayload\>\>

##### Returns

`void`

#### afterPlay()

> **afterPlay**: (`handler`) => `void`

##### Parameters

###### handler

(`payload`) => `void` \| [`Result`](../type-aliases/Result.md)\<`void`\> \| `Promise`\<void \| Result\<void\>\>

##### Returns

`void`

#### onRestRequest()

> **onRestRequest**: (`handler`) => `void`

##### Parameters

###### handler

[`RestRequestHook`](../type-aliases/RestRequestHook.md)

##### Returns

`void`

#### onRestResponse()

> **onRestResponse**: (`handler`) => `void`

##### Parameters

###### handler

[`RestResponseHook`](../type-aliases/RestResponseHook.md)

##### Returns

`void`

#### onRestError()

> **onRestError**: (`handler`) => `void`

##### Parameters

###### handler

[`RestErrorHook`](../type-aliases/RestErrorHook.md)

##### Returns

`void`
