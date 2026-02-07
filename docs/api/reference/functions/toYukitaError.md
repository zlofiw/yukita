[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / toYukitaError

# Function: toYukitaError()

> **toYukitaError**(`error`, `fallback`): [`YukitaError`](../classes/YukitaError.md)

Defined in: [src/shared/result.ts:33](https://github.com/zlofiw/yukita/blob/main/src/shared/result.ts#L33)

Converts unknown errors to `YukitaError`.

## Parameters

### error

`unknown`

### fallback

#### code

[`YukitaErrorCode`](../type-aliases/YukitaErrorCode.md)

#### message

`string`

#### meta?

`Record`\<`string`, `unknown`\>

## Returns

[`YukitaError`](../classes/YukitaError.md)
