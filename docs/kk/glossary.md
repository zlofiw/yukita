# Глоссарий

- `contextId`: YukitaSan оқиғалар/күйді бағыттау үшін қолданатын қолданбалық идентификатор. Discord боттарында `guildId` мәнін `contextId` ретінде қолдану ең оңай.
- `guildId`: Discord guild id (жол).
- `node`: бір Lavalink қосылымы (WS + REST).
- `nodePool`: түйіндер мен таңдау/failover стратегияларын басқарады.
- `player`: бір `contextId`/`guildId` үшін ойнату контроллері.
- `connector`: YukitaSan мен Discord кітапханасын байланыстыратын жұқа адаптер (voice updates ішке, OP 4 пакеттер сыртқа).
- `sessionId`: Lavalink WS session id (resume үшін).
- `gateway`: дашбордтар/сыртқы клиенттер үшін YukitaSan WebSocket сервері.
- `topic`: gateway жазылу кілті (`nodes`, `players`, `events`, `metrics`, `context:<id>`, ...).
- `roles`: gateway қолжетімділік рөлдері (`web:read`, `bot:control`, `admin`).

