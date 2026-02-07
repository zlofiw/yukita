# Examples

This repository ships a few reference examples:

- Discord.js bot: `examples/discordjs-bot/index.ts`
- Web dashboard: `examples/web-dashboard/index.html`
- Plugin example: `examples/plugin/index.ts`

## Discord.js Bot

Env vars:

- `DISCORD_TOKEN`
- `LAVALINK_HOST` (default: `127.0.0.1`)
- `LAVALINK_PORT` (default: `2333`)
- `LAVALINK_PASSWORD` (default: `youshallnotpass`)
- `LAVALINK_USER_ID` (your bot user id)

Commands:

- `!join`, `!leave`
- `!play <query/url>`
- `!pause`, `!resume`, `!stop`
- `!queue`

Run (repo root):

```bash
docker compose -f docker/lavalink-compose.yml up -d
pnpm dlx tsx examples/discordjs-bot/index.ts
```

## Web Dashboard

Start a gateway server (install `websocket-gateway` plugin) and then open `examples/web-dashboard/index.html` in a browser.

## Plugin Example

Demonstrates:

- REST middleware logging (`onRestRequest`)
- Custom gateway topic + command via `websocketGateway` extension

Run (repo root):

```bash
pnpm dlx tsx examples/plugin/index.ts
```

## Notes

- Examples in this repo import from `../../src` so they can run against the workspace.
- In your own project, import from the package: `import { YukitaSan } from 'yukitasan'`.
