# Мысалдар

Бұл репозиторийде бірнеше reference мысал бар:

- Discord.js bot: `examples/discordjs-bot/index.ts`
- Web dashboard: `examples/web-dashboard/index.html`
- Plugin example: `examples/plugin/index.ts`

## Discord.js Bot

Қоршаған орта айнымалылары:

- `DISCORD_TOKEN`
- `LAVALINK_HOST` (әдепкі: `127.0.0.1`)
- `LAVALINK_PORT` (әдепкі: `2333`)
- `LAVALINK_PASSWORD` (әдепкі: `youshallnotpass`)
- `LAVALINK_USER_ID` (боттың user id)

Командалар:

- `!join`, `!leave`
- `!play <query/url>`
- `!pause`, `!resume`, `!stop`
- `!queue`

Іске қосу (репо түбірінен):

```bash
docker compose -f docker/lavalink-compose.yml up -d
pnpm dlx tsx examples/discordjs-bot/index.ts
```

## Web Dashboard

Gateway серверін іске қосыңыз (`websocket-gateway` плагинін орнатыңыз), кейін браузерде `examples/web-dashboard/index.html` файлын ашыңыз.

## Plugin example

Көрсетеді:

- REST middleware логтауын (`onRestRequest`)
- extension `websocketGateway` арқылы кастом gateway topic + command

Іске қосу (репо түбірінен):

```bash
pnpm dlx tsx examples/plugin/index.ts
```

## Ескертпелер

- Бұл реподағы мысалдар workspace ішінде жұмыс істеу үшін `../../src` арқылы импорттайды.
- Өз жобаңызда пакеттен импорттаңыз: `import { YukitaSan } from 'yukitasan'`.
