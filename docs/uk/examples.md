# Приклади

У репозиторії є кілька прикладів:

- Discord.js bot: `examples/discordjs-bot/index.ts`
- Web dashboard: `examples/web-dashboard/index.html`
- Plugin example: `examples/plugin/index.ts`

## Discord.js Bot

Змінні середовища:

- `DISCORD_TOKEN`
- `LAVALINK_HOST` (за замовчуванням: `127.0.0.1`)
- `LAVALINK_PORT` (за замовчуванням: `2333`)
- `LAVALINK_PASSWORD` (за замовчуванням: `youshallnotpass`)
- `LAVALINK_USER_ID` (user id бота)

Команди:

- `!join`, `!leave`
- `!play <query/url>`
- `!pause`, `!resume`, `!stop`
- `!queue`

Запуск (з кореня репозиторію):

```bash
docker compose -f docker/lavalink-compose.yml up -d
pnpm dlx tsx examples/discordjs-bot/index.ts
```

## Web Dashboard

Запусти gateway сервер (встанови плагін `websocket-gateway`), а потім відкрий `examples/web-dashboard/index.html` у браузері.

## Plugin example

Показує:

- логування REST middleware (`onRestRequest`)
- кастомний gateway topic + command через extension `websocketGateway`

Запуск (з кореня репозиторію):

```bash
pnpm dlx tsx examples/plugin/index.ts
```

## Нотатки

- Приклади в цьому репо імпортують з `../../src`, щоб працювати в workspace.
- У своєму проєкті імпортуй з пакета: `import { YukitaSan } from 'yukitasan'`.
