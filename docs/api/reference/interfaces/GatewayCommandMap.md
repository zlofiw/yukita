[**yukitasan**](../index.md)

***

[yukitasan](../index.md) / GatewayCommandMap

# Interface: GatewayCommandMap

Defined in: [src/gateway/types.ts:102](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L102)

Command payload map.

## Properties

### play

> **play**: `object`

Defined in: [src/gateway/types.ts:103](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L103)

#### contextId

> **contextId**: `string`

#### input

> **input**: [`PlayInput`](PlayInput.md)

***

### pause

> **pause**: `object`

Defined in: [src/gateway/types.ts:107](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L107)

#### contextId

> **contextId**: `string`

***

### resume

> **resume**: `object`

Defined in: [src/gateway/types.ts:110](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L110)

#### contextId

> **contextId**: `string`

***

### stop

> **stop**: `object`

Defined in: [src/gateway/types.ts:113](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L113)

#### contextId

> **contextId**: `string`

***

### seek

> **seek**: `object`

Defined in: [src/gateway/types.ts:116](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L116)

#### contextId

> **contextId**: `string`

#### positionMs

> **positionMs**: `number`

***

### volume

> **volume**: `object`

Defined in: [src/gateway/types.ts:120](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L120)

#### contextId

> **contextId**: `string`

#### volume

> **volume**: `number`

***

### queue.add

> **queue.add**: `object`

Defined in: [src/gateway/types.ts:124](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L124)

#### contextId

> **contextId**: `string`

#### input

> **input**: [`PlayInput`](PlayInput.md)

***

### queue.remove

> **queue.remove**: `object`

Defined in: [src/gateway/types.ts:128](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L128)

#### contextId

> **contextId**: `string`

#### index

> **index**: `number`

***

### queue.move

> **queue.move**: `object`

Defined in: [src/gateway/types.ts:132](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L132)

#### contextId

> **contextId**: `string`

#### fromIndex

> **fromIndex**: `number`

#### toIndex

> **toIndex**: `number`

***

### queue.clear

> **queue.clear**: `object`

Defined in: [src/gateway/types.ts:137](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L137)

#### contextId

> **contextId**: `string`

***

### queue.shuffle

> **queue.shuffle**: `object`

Defined in: [src/gateway/types.ts:140](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L140)

#### contextId

> **contextId**: `string`

***

### filters.apply

> **filters.apply**: `object`

Defined in: [src/gateway/types.ts:143](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L143)

#### contextId

> **contextId**: `string`

#### filters

> **filters**: [`LavalinkFilters`](LavalinkFilters.md)

***

### filters.clear

> **filters.clear**: `object`

Defined in: [src/gateway/types.ts:147](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L147)

#### contextId

> **contextId**: `string`

***

### subscribe

> **subscribe**: `object`

Defined in: [src/gateway/types.ts:150](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L150)

#### topic

> **topic**: `string`

***

### unsubscribe

> **unsubscribe**: `object`

Defined in: [src/gateway/types.ts:153](https://github.com/zlofiw/yukita/blob/174c62f77ab5cf009b285f72ee20570c556fbd94/src/gateway/types.ts#L153)

#### topic

> **topic**: `string`
