# WebSocket Gateway

YukitaSan містить WebSocket gateway (як плагін) для дашбордів і зовнішніх клієнтів.

## Обмеження браузера

У браузері не можна передавати довільні заголовки під час WebSocket-handshake (наприклад `Authorization`), тому gateway підтримує кілька способів передачі auth:

1. Токен у query: `wss://.../yukitasan?token=...`
2. Токен у subprotocol через `Sec-WebSocket-Protocol`
3. Перше повідомлення `auth` після підключення (challenge/response)

## Підключення плагіна

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

## Ролі

Авторизація в gateway побудована на ролях:

- `web:read`: підписки/лише читання
- `bot:control`: команди керування відтворенням
- `admin`: повний доступ

## Auth: токен у query

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

## Auth: перше повідомлення

1. Підключитися без токена
2. Сервер надсилає `hello` з `challenge`
3. Клієнт відповідає `auth`

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

## Підписки

Команди надсилаються так:

```json
{ "op":"cmd", "t":"subscribe", "id":"...", "ts": 0, "d": { "topic":"nodes" } }
{ "op":"cmd", "t":"subscribe", "id":"...", "ts": 0, "d": { "topic":"players" } }
{ "op":"cmd", "t":"subscribe", "id":"...", "ts": 0, "d": { "topic":"events" } }
{ "op":"cmd", "t":"subscribe", "id":"...", "ts": 0, "d": { "topic":"metrics" } }
```

Також підтримуються topics виду `context:<id>` для потоків per-guild/player.

## Команди

Вбудовані типи команд:

- `play`, `pause`, `resume`, `stop`, `seek`, `volume`
- `queue.add`, `queue.remove`, `queue.move`, `queue.clear`, `queue.shuffle`
- `filters.apply`, `filters.clear`

Кожна команда надсилається як:

```json
{ "op":"cmd", "t":"pause", "id":"...", "ts": 0, "d": { "contextId": "123" } }
```

## Безпека (редакція)

Для сесій із роллю `web:read` gateway прибирає чутливі дані:

- секрети Discord voice прибираються зі snapshots
- `track.encoded` прибирається з events/snapshots, якщо в сесії немає `bot:control` (або `admin`)

Якщо UI потрібні операції, що вимагають `encoded`, автентифікуйтеся з `bot:control`.

## Кастомні topics і команди (плагіни)

Gateway можна розширювати з плагінів (публікувати нові topics, реєструвати кастомні команди).
Див. `examples/plugin/index.ts`.
