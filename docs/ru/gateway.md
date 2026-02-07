# WebSocket Gateway

YukitaSan включает WebSocket gateway (как плагин) для дашбордов и внешних клиентов.

## Ограничение браузера

В браузере нельзя передавать произвольные заголовки во время WebSocket-handshake (например `Authorization`), поэтому gateway поддерживает несколько способов передачи auth:

1. Токен в query: `wss://.../yukitasan?token=...`
2. Токен в subprotocol через `Sec-WebSocket-Protocol`
3. Первое сообщение `auth` после подключения (challenge/response)

## Подключение плагина

```ts
import { createWebsocketGatewayPlugin } from 'yukitasan';

await client.use(
  createWebsocketGatewayPlugin({
    port: 8080,
    path: '/yukitasan',
    auth: {
      mode: 'hmac',
      secret: process.env.GATEWAY_SECRET ?? 'change-me'
    }
  })
);
```

## Роли

Авторизация в gateway построена на ролях:

- `web:read`: подписки/только чтение
- `bot:control`: команды управления воспроизведением
- `admin`: полный доступ

## Auth: токен в query

```ts
new WebSocket('wss://localhost:8080/yukitasan?token=YOUR_TOKEN');
```

## Auth: subprotocol

```ts
new WebSocket('wss://localhost:8080/yukitasan', [
  'yukitasan.v1',
  'yukitasan.token.YOUR_TOKEN'
]);
```

## Auth: первое сообщение

1. Подключиться без токена
2. Сервер отправляет `hello` с `challenge`
3. Клиент отвечает `auth`

```ts
const ws = new WebSocket('wss://localhost:8080/yukitasan');

ws.onmessage = (event) => {
  const frame = JSON.parse(event.data);
  if (frame.op === 'hello') {
    ws.send(
      JSON.stringify({
        op: 'auth',
        t: 'auth',
        id: crypto.randomUUID(),
        ts: Date.now(),
        d: {
          token: 'YOUR_TOKEN',
          challenge: frame.d.challenge
        }
      })
    );
  }
};
```

## Подписки

Команды отправляются так:

```json
{ "op":"cmd", "t":"subscribe", "id":"...", "ts": 0, "d": { "topic":"nodes" } }
{ "op":"cmd", "t":"subscribe", "id":"...", "ts": 0, "d": { "topic":"players" } }
{ "op":"cmd", "t":"subscribe", "id":"...", "ts": 0, "d": { "topic":"events" } }
{ "op":"cmd", "t":"subscribe", "id":"...", "ts": 0, "d": { "topic":"metrics" } }
```

Также поддерживаются topics вида `context:<id>` для потоков per-guild/player.

## Команды

Встроенные типы команд:

- `play`, `pause`, `resume`, `stop`, `seek`, `volume`
- `queue.add`, `queue.remove`, `queue.move`, `queue.clear`, `queue.shuffle`
- `filters.apply`, `filters.clear`

Каждая команда отправляется как:

```json
{ "op":"cmd", "t":"pause", "id":"...", "ts": 0, "d": { "contextId": "123" } }
```

## Безопасность (редакция)

Для сессий с ролью `web:read` gateway вырезает чувствительные данные:

- секреты Discord voice удаляются из snapshots
- `track.encoded` удаляется из events/snapshots, если у сессии нет `bot:control` (или `admin`)

Если UI нужны операции, требующие `encoded`, аутентифицируйся с `bot:control`.

## Кастомные topics и команды (плагины)

Gateway можно расширять из плагинов (публиковать новые topics, регистрировать кастомные команды).
См. `examples/plugin/index.ts`.
