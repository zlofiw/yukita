# Примеры

В репозитории есть несколько примеров:

- Discord.js bot: `examples/discordjs-bot/index.ts`
- Web dashboard: `examples/web-dashboard/index.html`
- Plugin example: `examples/plugin/index.ts`

## Discord.js Bot

Переменные окружения:

- `DISCORD_TOKEN`
- `LAVALINK_HOST` (по умолчанию: `127.0.0.1`)
- `LAVALINK_PORT` (по умолчанию: `2333`)
- `LAVALINK_PASSWORD` (по умолчанию: `youshallnotpass`)
- `LAVALINK_USER_ID` (user id бота)

Команды:

- `!join`, `!leave`
- `!play <query/url>`
- `!pause`, `!resume`, `!stop`
- `!queue`

Запуск (из корня репозитория):

```bash
docker compose -f docker/lavalink-compose.yml up -d
pnpm dlx tsx examples/discordjs-bot/index.ts
```

## Web Dashboard

Запусти gateway server (установи плагин `websocket-gateway`), затем открой `examples/web-dashboard/index.html` в браузере.

## Plugin example

Показывает:

- REST middleware логирование (`onRestRequest`)
- кастомный gateway topic + command через extension `websocketGateway`

Запуск (из корня репозитория):

```bash
pnpm dlx tsx examples/plugin/index.ts
```

## Примечания

- Примеры в этом репо импортируют из `../../src`, чтобы запускаться из workspace.
- В своём проекте импортируй из пакета: `import { YukitaSan } from 'yukitasan'`.
