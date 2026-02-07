[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / LavalinkResponse

# Type Alias: LavalinkResponse\<T\>

> **LavalinkResponse**\<`T`\> = \{ `ok`: `true`; `kind`: `"ok"`; `value`: `T`; `meta`: [`LavalinkResponseMeta`](../interfaces/LavalinkResponseMeta.md); \} \| \{ `ok`: `false`; `kind`: `"error"` \| `"timeout"` \| `"aborted"` \| `"invalidPayload"`; `error`: [`LavalinkResponseError`](../interfaces/LavalinkResponseError.md); `meta`: [`LavalinkResponseMeta`](../interfaces/LavalinkResponseMeta.md); \}

Defined in: [src/lavalink/responses.ts:17](https://github.com/zlofiw/yukita/blob/main/src/lavalink/responses.ts#L17)

## Type Parameters

### T

`T`
