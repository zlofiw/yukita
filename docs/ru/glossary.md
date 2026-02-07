# Глоссарий

- `contextId`: прикладной идентификатор, по которому YukitaSan маршрутизирует события/состояние. В Discord-ботах проще всего использовать `guildId` как `contextId`.
- `guildId`: id Discord guild (строка).
- `node`: одно подключение к Lavalink (WS + REST).
- `nodePool`: управляет нодами и стратегиями выбора/failover.
- `player`: контроллер воспроизведения в рамках одного `contextId`/`guildId`.
- `connector`: тонкий адаптер между YukitaSan и Discord-библиотекой (voice updates внутрь, OP 4 пакеты наружу).
- `sessionId`: session id из Lavalink WS (используется для resume).
- `gateway`: WebSocket сервер YukitaSan для дашбордов/внешних клиентов.
- `topic`: ключ подписки в gateway (`nodes`, `players`, `events`, `metrics`, `context:<id>`, ...).
- `roles`: роли доступа в gateway (`web:read`, `bot:control`, `admin`).

