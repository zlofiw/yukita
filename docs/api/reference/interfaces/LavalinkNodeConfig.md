[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / LavalinkNodeConfig

# Interface: LavalinkNodeConfig

Defined in: [src/lavalink/types.ts:16](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/types.ts#L16)

Lavalink node connection config.

## Properties

### id

> **id**: `string`

Defined in: [src/lavalink/types.ts:17](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/types.ts#L17)

***

### host

> **host**: `string`

Defined in: [src/lavalink/types.ts:18](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/types.ts#L18)

***

### port

> **port**: `number`

Defined in: [src/lavalink/types.ts:19](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/types.ts#L19)

***

### secure?

> `optional` **secure**: `boolean`

Defined in: [src/lavalink/types.ts:20](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/types.ts#L20)

***

### password

> **password**: `string`

Defined in: [src/lavalink/types.ts:21](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/types.ts#L21)

***

### userId

> **userId**: `string`

Defined in: [src/lavalink/types.ts:22](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/types.ts#L22)

***

### clientName?

> `optional` **clientName**: `string`

Defined in: [src/lavalink/types.ts:23](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/types.ts#L23)

***

### restVersion?

> `optional` **restVersion**: `number`

Defined in: [src/lavalink/types.ts:24](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/types.ts#L24)

***

### wsVersion?

> `optional` **wsVersion**: `number`

Defined in: [src/lavalink/types.ts:25](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/types.ts#L25)

***

### requestTimeoutMs?

> `optional` **requestTimeoutMs**: `number`

Defined in: [src/lavalink/types.ts:26](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/types.ts#L26)

***

### restConcurrency?

> `optional` **restConcurrency**: `number`

Defined in: [src/lavalink/types.ts:31](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/types.ts#L31)

REST max in-flight requests (rate-limit friendly).
Defaults to `4`.

***

### readyTimeoutMs?

> `optional` **readyTimeoutMs**: `number`

Defined in: [src/lavalink/types.ts:32](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/types.ts#L32)

***

### healthCheckIntervalMs?

> `optional` **healthCheckIntervalMs**: `number`

Defined in: [src/lavalink/types.ts:33](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/types.ts#L33)

***

### resumeSession?

> `optional` **resumeSession**: `boolean`

Defined in: [src/lavalink/types.ts:38](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/types.ts#L38)

Enables REST session resume configuration after websocket ready.
Defaults to `true`.

***

### resumeTimeoutMs?

> `optional` **resumeTimeoutMs**: `number`

Defined in: [src/lavalink/types.ts:43](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/types.ts#L43)

Lavalink resume timeout in milliseconds for `updateSession`.
Defaults to `60_000`.

***

### retryPolicy?

> `optional` **retryPolicy**: `Partial`\<[`RetryPolicy`](RetryPolicy.md)\>

Defined in: [src/lavalink/types.ts:44](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/types.ts#L44)

***

### group?

> `optional` **group**: `string`

Defined in: [src/lavalink/types.ts:45](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/lavalink/types.ts#L45)
