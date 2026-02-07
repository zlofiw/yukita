# WebSocket Gateway

YukitaSan дашбордтар мен сыртқы клиенттер үшін WebSocket gateway-ді (плагин ретінде) ұсынады.

## Браузер шектеуі

Браузер WebSocket-handshake кезінде (мысалы `Authorization`) еркін header қоса алмайды, сондықтан gateway auth-ты жеткізудің бірнеше тәсілін қолдайды:

1. Query параметріндегі токен: `wss://.../yukitasan?token=...`
2. `Sec-WebSocket-Protocol` арқылы subprotocol токені
3. Қосылғаннан кейінгі бірінші `auth` хабарламасы (challenge/response)

## Плагинді қосу

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

## Рөлдер

Gateway авторизациясы рөлдерге негізделген:

- `web:read`: жазылу/тек оқу
- `bot:control`: ойнатуды басқару командалары
- `admin`: толық қолжетімділік

## Auth: query токені

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

## Auth: бірінші хабарлама

1. Токенсіз қосылу
2. Сервер `hello` хабарламасын `challenge`-пен жібереді
3. Клиент `auth` деп жауап береді

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

## Жазылулар

Командаларды жіберу:

```json
{ "op":"cmd", "t":"subscribe", "id":"...", "ts": 0, "d": { "topic":"nodes" } }
{ "op":"cmd", "t":"subscribe", "id":"...", "ts": 0, "d": { "topic":"players" } }
{ "op":"cmd", "t":"subscribe", "id":"...", "ts": 0, "d": { "topic":"events" } }
{ "op":"cmd", "t":"subscribe", "id":"...", "ts": 0, "d": { "topic":"metrics" } }
```

Сервер сондай-ақ per-guild/player ағындары үшін `context:<id>` topics-тарын қолдайды.

## Командалар

Кірістірілген командалар түрлері:

- `play`, `pause`, `resume`, `stop`, `seek`, `volume`
- `queue.add`, `queue.remove`, `queue.move`, `queue.clear`, `queue.shuffle`
- `filters.apply`, `filters.clear`

Әр команда мынадай түрде жіберіледі:

```json
{ "op":"cmd", "t":"pause", "id":"...", "ts": 0, "d": { "contextId": "123" } }
```

## Қауіпсіздік (редакция)

`web:read` рөлі бар сессиялар үшін gateway сезімтал деректерді жасырады:

- Discord voice құпиялары snapshots ішінен алынып тасталады
- `track.encoded` events/snapshots ішінен алынып тасталады, егер сессияда `bot:control` (немесе `admin`) болмаса

Егер UI-ға `encoded` қажет болатын басқару операциялары керек болса, `bot:control` арқылы аутентификация жасаңыз.

## Кастом topics және командалар (плагиндер)

Gateway-ді плагиндер арқылы кеңейтуге болады (жаңа topics жариялау, кастом командаларды тіркеу).
Қараңыз: `examples/plugin/index.ts`.
