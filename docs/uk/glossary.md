# Глосарій

- `contextId`: прикладний ідентифікатор, за яким YukitaSan маршрутизує події/стан. У Discord-ботах найпростіше використовувати `guildId` як `contextId`.
- `guildId`: id Discord guild (рядок).
- `node`: одне підключення до Lavalink (WS + REST).
- `nodePool`: керує нодами та стратегіями вибору/failover.
- `player`: контролер відтворення в межах одного `contextId`/`guildId`.
- `connector`: тонкий адаптер між YukitaSan і Discord-бібліотекою (voice updates всередину, OP 4 пакети назовні).
- `sessionId`: session id з Lavalink WS (використовується для resume).
- `gateway`: WebSocket сервер YukitaSan для дашбордів/зовнішніх клієнтів.
- `topic`: ключ підписки в gateway (`nodes`, `players`, `events`, `metrics`, `context:<id>`, ...).
- `roles`: ролі доступу в gateway (`web:read`, `bot:control`, `admin`).

