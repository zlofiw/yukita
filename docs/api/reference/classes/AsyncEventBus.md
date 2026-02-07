[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / AsyncEventBus

# Class: AsyncEventBus\<TEvents\>

Defined in: [src/shared/event-bus.ts:9](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/shared/event-bus.ts#L9)

Async-safe typed event bus.

## Type Parameters

### TEvents

`TEvents` *extends* `object`

## Constructors

### Constructor

> **new AsyncEventBus**\<`TEvents`\>(): `AsyncEventBus`\<`TEvents`\>

#### Returns

`AsyncEventBus`\<`TEvents`\>

## Methods

### on()

> **on**\<`TKey`\>(`event`, `listener`): () => `void`

Defined in: [src/shared/event-bus.ts:15](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/shared/event-bus.ts#L15)

Registers a listener.

#### Type Parameters

##### TKey

`TKey` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`TKey`

##### listener

[`Listener`](../type-aliases/Listener.md)\<`TEvents`\[`TKey`\]\>

#### Returns

> (): `void`

##### Returns

`void`

***

### off()

> **off**\<`TKey`\>(`event`, `listener`): `void`

Defined in: [src/shared/event-bus.ts:25](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/shared/event-bus.ts#L25)

Removes a listener.

#### Type Parameters

##### TKey

`TKey` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`TKey`

##### listener

[`Listener`](../type-aliases/Listener.md)\<`TEvents`\[`TKey`\]\>

#### Returns

`void`

***

### emit()

> **emit**\<`TKey`\>(`event`, `payload`, `onError?`): `Promise`\<`void`\>

Defined in: [src/shared/event-bus.ts:39](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/shared/event-bus.ts#L39)

Emits event to all listeners.

#### Type Parameters

##### TKey

`TKey` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`TKey`

##### payload

`TEvents`\[`TKey`\]

##### onError?

(`error`) => `void`

#### Returns

`Promise`\<`void`\>

***

### clear()

> **clear**(): `void`

Defined in: [src/shared/event-bus.ts:66](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/shared/event-bus.ts#L66)

Removes all listeners.

#### Returns

`void`
