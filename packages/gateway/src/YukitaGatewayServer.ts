import { createHmac, randomUUID } from 'crypto';
import { parse as parseUrl } from 'url';
import { verify } from 'jsonwebtoken';
import type { YukitaClient, YukitaCoreEvents } from '@yukita/core';
import { YukitaError, YukitaErrorCode, err, ok, type Result } from '@yukita/plugin-kit';
import WebSocket, { WebSocketServer, type RawData } from 'ws';
import type { GatewayClaims, GatewayEnvelope, GatewayRateLimitOptions, GatewayServerOptions } from './types';

type SessionState = {
  socket: WebSocket;
  claims: GatewayClaims;
  subscriptions: Set<string>;
  commandCount: number;
  windowStartedAt: number;
};

/**
 * WebSocket gateway for subscriptions and remote commands.
 */
export class YukitaGatewayServer {
  private readonly client: YukitaClient;
  private readonly options: GatewayServerOptions;
  private readonly sessions = new Map<WebSocket, SessionState>();
  private readonly coreUnsubscribers: Array<() => void> = [];
  private readonly rateLimit: GatewayRateLimitOptions;
  private wss: WebSocketServer | null = null;

  public constructor(client: YukitaClient, options: GatewayServerOptions) {
    this.client = client;
    this.options = options;
    this.rateLimit = {
      maxCommands: options.rateLimit?.maxCommands ?? 60,
      windowMs: options.rateLimit?.windowMs ?? 30_000
    };
  }

  /**
   * Starts websocket gateway.
   */
  public async start(): Promise<Result<void>> {
    if (this.wss) {
      return ok(undefined);
    }

    this.wss = this.options.server
      ? new WebSocketServer({
          server: this.options.server,
          path: this.options.path ?? '/yukita'
        })
      : new WebSocketServer({
          host: this.options.host ?? '0.0.0.0',
          port: this.options.port ?? 8080,
          path: this.options.path ?? '/yukita'
        });

    this.wss.on('connection', (socket, request) => {
      void this.handleConnection(socket, request.headers.authorization, request.headers.origin, request.url ?? '');
    });

    this.wss.on('error', (error) => {
      console.error('[yukita-gateway] websocket server error', error);
    });

    this.bindCoreEvents();
    return ok(undefined);
  }

  /**
   * Stops websocket gateway.
   */
  public async stop(): Promise<Result<void>> {
    if (!this.wss) {
      return ok(undefined);
    }

    for (const unsubscribe of this.coreUnsubscribers) {
      unsubscribe();
    }
    this.coreUnsubscribers.length = 0;

    for (const session of this.sessions.values()) {
      session.socket.close(1000, 'gateway shutdown');
    }
    this.sessions.clear();

    await new Promise<void>((resolve) => {
      const server = this.wss;
      if (!server) {
        resolve();
        return;
      }
      server.close(() => resolve());
    });
    this.wss = null;
    return ok(undefined);
  }

  private async handleConnection(
    socket: WebSocket,
    authHeader: string | undefined,
    origin: string | undefined,
    requestUrl: string
  ): Promise<void> {
    const originAllowed = this.isOriginAllowed(origin);
    if (!originAllowed) {
      socket.close(4403, 'origin denied');
      return;
    }

    const token = this.extractToken(authHeader, requestUrl);
    if (!token) {
      socket.close(4401, 'missing token');
      return;
    }

    const claimsResult = this.verifyToken(token);
    if (!claimsResult.ok) {
      socket.close(4401, claimsResult.error.message);
      return;
    }

    const session: SessionState = {
      socket,
      claims: claimsResult.value,
      subscriptions: new Set<string>(),
      commandCount: 0,
      windowStartedAt: Date.now()
    };
    this.sessions.set(socket, session);

    socket.on('message', (chunk) => {
      void this.handleMessage(session, chunk);
    });

    socket.on('close', () => {
      this.sessions.delete(socket);
    });
  }

  private async handleMessage(session: SessionState, chunk: RawData): Promise<void> {
    let frame: GatewayEnvelope;
    try {
      frame = JSON.parse(chunk.toString()) as GatewayEnvelope;
    } catch {
      this.sendErrorEnvelope(session.socket, {
        op: 'err',
        t: 'parse',
        id: randomUUID(),
        ts: Date.now(),
        d: {
          code: YukitaErrorCode.INVALID_ARGUMENT,
          message: 'Invalid JSON frame',
          meta: {}
        }
      });
      return;
    }

    if (frame.op !== 'cmd') {
      this.sendError(session.socket, frame.t, frame.id, new YukitaError({
        code: YukitaErrorCode.INVALID_ARGUMENT,
        message: 'Only cmd operation is accepted from client'
      }));
      return;
    }

    if (!this.consumeRateLimit(session)) {
      this.sendError(session.socket, frame.t, frame.id, new YukitaError({
        code: YukitaErrorCode.RATE_LIMITED,
        message: 'Command rate limit exceeded',
        meta: {
          maxCommands: this.rateLimit.maxCommands,
          windowMs: this.rateLimit.windowMs
        }
      }));
      return;
    }

    await this.dispatchCommand(session, frame.t, frame.id, frame.d);
  }

  private async dispatchCommand(
    session: SessionState,
    commandType: string,
    commandId: string,
    payload: Record<string, unknown>
  ): Promise<void> {
    const controlCommands = new Set([
      'play',
      'pause',
      'resume',
      'stop',
      'seek',
      'volume',
      'queue.add',
      'queue.remove',
      'queue.move',
      'queue.clear',
      'queue.shuffle',
      'filters.apply',
      'filters.clear'
    ]);

    const readCommands = new Set(['subscribe', 'unsubscribe']);
    if (controlCommands.has(commandType) && !this.hasAnyRole(session.claims.roles, ['bot:control', 'admin'])) {
      this.sendError(session.socket, commandType, commandId, new YukitaError({
        code: YukitaErrorCode.COMMAND_NOT_ALLOWED,
        message: 'Control command requires bot:control or admin role'
      }));
      return;
    }

    if (readCommands.has(commandType) && !this.hasAnyRole(session.claims.roles, ['web:read', 'admin'])) {
      this.sendError(session.socket, commandType, commandId, new YukitaError({
        code: YukitaErrorCode.COMMAND_NOT_ALLOWED,
        message: 'Read command requires web:read or admin role'
      }));
      return;
    }

    const exec = await this.executeCommand(commandType, payload);
    if (!exec.ok) {
      this.sendError(session.socket, commandType, commandId, exec.error);
      return;
    }

    if (commandType === 'subscribe') {
      const topic = payload.topic as string;
      session.subscriptions.add(topic);
      await this.sendSnapshotIfAvailable(session, topic);
    }

    if (commandType === 'unsubscribe') {
      const topic = payload.topic as string;
      session.subscriptions.delete(topic);
    }

    this.sendAck(session.socket, commandType, commandId, exec.value ?? {});
  }

  private async executeCommand(
    command: string,
    payload: Record<string, unknown>
  ): Promise<Result<object>> {
    switch (command) {
      case 'play': {
        const result = await this.client.play(payload.contextId as string, payload.input as never);
        return result.ok ? ok({ snapshot: result.value }) : result;
      }
      case 'pause': {
        const result = await this.client.pause(payload.contextId as string);
        return result.ok ? ok({ snapshot: result.value }) : result;
      }
      case 'resume': {
        const result = await this.client.resume(payload.contextId as string);
        return result.ok ? ok({ snapshot: result.value }) : result;
      }
      case 'stop': {
        const result = await this.client.stop(payload.contextId as string);
        return result.ok ? ok({ snapshot: result.value }) : result;
      }
      case 'seek': {
        const result = await this.client.seek(payload.contextId as string, payload.positionMs as number);
        return result.ok ? ok({ snapshot: result.value }) : result;
      }
      case 'volume': {
        const result = await this.client.setVolume(payload.contextId as string, payload.volume as number);
        return result.ok ? ok({ snapshot: result.value }) : result;
      }
      case 'queue.add': {
        const result = await this.client.queueAdd(payload.contextId as string, payload.input as never);
        return result.ok ? ok({ snapshot: result.value }) : result;
      }
      case 'queue.remove': {
        const result = await this.client.queueRemove(payload.contextId as string, payload.index as number);
        return result.ok ? ok({ snapshot: result.value }) : result;
      }
      case 'queue.move': {
        const result = await this.client.queueMove(
          payload.contextId as string,
          payload.fromIndex as number,
          payload.toIndex as number
        );
        return result.ok ? ok({ snapshot: result.value }) : result;
      }
      case 'queue.clear': {
        const result = await this.client.queueClear(payload.contextId as string);
        return result.ok ? ok({ snapshot: result.value }) : result;
      }
      case 'queue.shuffle': {
        const result = await this.client.queueShuffle(payload.contextId as string);
        return result.ok ? ok({ snapshot: result.value }) : result;
      }
      case 'filters.apply': {
        const result = await this.client.applyFilters(payload.contextId as string, payload.filters as never);
        return result.ok ? ok({ snapshot: result.value }) : result;
      }
      case 'filters.clear': {
        const result = await this.client.clearFilters(payload.contextId as string);
        return result.ok ? ok({ snapshot: result.value }) : result;
      }
      case 'subscribe':
      case 'unsubscribe':
        return ok({});
      default:
        return err(
          new YukitaError({
            code: YukitaErrorCode.INVALID_ARGUMENT,
            message: `Unsupported command: ${String(command)}`
          })
        );
    }
  }

  private bindCoreEvents(): void {
    const bind = <TKey extends keyof YukitaCoreEvents>(event: TKey): void => {
      const unsubscribe = this.client.on(event, async (payload) => {
        const topics = this.topicsForEvent(event, payload);
        this.broadcast(event, payload, topics);
      });
      this.coreUnsubscribers.push(unsubscribe);
    };

    bind('node.connected');
    bind('node.disconnected');
    bind('node.error');
    bind('node.stats');
    bind('player.created');
    bind('player.destroyed');
    bind('player.state');
    bind('track.started');
    bind('track.ended');
    bind('track.stuck');
    bind('track.exception');
    bind('queue.updated');
    bind('resolve.completed');
    bind('resolve.failed');
  }

  private broadcast<T extends object>(eventType: string, payload: T, topics: string[]): void {
    if (!topics.length) {
      return;
    }

    const frame: GatewayEnvelope = {
      op: 'event',
      t: eventType,
      id: randomUUID(),
      ts: Date.now(),
      d: payload as Record<string, unknown>
    };

    for (const session of this.sessions.values()) {
      if (this.isSubscribed(session, topics)) {
        this.sendEnvelope(session.socket, frame);
      }
    }
  }

  private topicsForEvent<TKey extends keyof YukitaCoreEvents>(
    event: TKey,
    payload: YukitaCoreEvents[TKey]
  ): string[] {
    if (String(event).startsWith('node.')) {
      const nodeId = (payload as { nodeId?: string }).nodeId;
      return nodeId ? ['node', `node:${nodeId}`] : ['node'];
    }

    const contextId = (payload as { contextId?: string }).contextId;
    if (!contextId) {
      return [];
    }
    const domain = String(event).split('.')[0];
    return [`context:${contextId}`, `context:${contextId}:${domain}`];
  }

  private isSubscribed(session: SessionState, topics: string[]): boolean {
    if (session.subscriptions.has('*')) {
      return true;
    }
    return topics.some((topic) => session.subscriptions.has(topic));
  }

  private async sendSnapshotIfAvailable(session: SessionState, topic: string): Promise<void> {
    if (!topic.startsWith('context:')) {
      return;
    }

    const parts = topic.split(':');
    const contextId = parts[1];
    if (!contextId) {
      return;
    }

    const playerResult = this.client.getPlayer(contextId);
    if (!playerResult.ok) {
      return;
    }

    this.sendEnvelope(session.socket, {
      op: 'event',
      t: 'snapshot',
      id: randomUUID(),
      ts: Date.now(),
      d: {
        contextId,
        snapshot: playerResult.value.snapshot()
      }
    });
  }

  private consumeRateLimit(session: SessionState): boolean {
    const now = Date.now();
    if (now - session.windowStartedAt > this.rateLimit.windowMs) {
      session.windowStartedAt = now;
      session.commandCount = 0;
    }

    if (session.commandCount >= this.rateLimit.maxCommands) {
      return false;
    }
    session.commandCount += 1;
    return true;
  }

  private sendAck(socket: WebSocket, type: string, id: string, payload: object): void {
    this.sendEnvelope(socket, {
      op: 'ack',
      t: type,
      id,
      ts: Date.now(),
      d: payload as Record<string, unknown>
    });
  }

  private sendError(socket: WebSocket, type: string, id: string, error: YukitaError): void {
    this.sendErrorEnvelope(socket, {
      op: 'err',
      t: type,
      id,
      ts: Date.now(),
      d: {
        code: error.code,
        message: error.message,
        meta: error.meta ?? {}
      }
    });
  }

  private sendErrorEnvelope(socket: WebSocket, frame: GatewayEnvelope): void {
    this.sendEnvelope(socket, frame);
  }

  private sendEnvelope(socket: WebSocket, frame: GatewayEnvelope): void {
    if (socket.readyState !== WebSocket.OPEN) {
      return;
    }
    socket.send(JSON.stringify(frame));
  }

  private isOriginAllowed(origin: string | undefined): boolean {
    const allowlist = this.options.allowedOrigins;
    if (!allowlist || !allowlist.length) {
      return true;
    }
    if (!origin) {
      return false;
    }
    return allowlist.includes(origin);
  }

  private extractToken(authHeader: string | undefined, requestUrl: string): string | null {
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.slice('Bearer '.length).trim();
    }
    const parsed = parseUrl(requestUrl, true);
    const token = parsed.query.token;
    return typeof token === 'string' ? token : null;
  }

  private verifyToken(token: string): Result<GatewayClaims> {
    if (this.options.auth.mode === 'jwt') {
      try {
        const payload = verify(token, this.options.auth.secret, {
          issuer: this.options.auth.issuer,
          audience: this.options.auth.audience
        }) as GatewayClaims;
        if (!payload.roles?.length) {
          return err(
            new YukitaError({
              code: YukitaErrorCode.AUTH_FAILED,
              message: 'Token has no roles'
            })
          );
        }
        return ok(payload);
      } catch (error) {
        return err(
          new YukitaError({
            code: YukitaErrorCode.AUTH_FAILED,
            message: 'JWT verification failed',
            cause: error
          })
        );
      }
    }

    const chunks = token.split('.');
    if (chunks.length !== 2) {
      return err(
        new YukitaError({
          code: YukitaErrorCode.AUTH_FAILED,
          message: 'Invalid HMAC token format'
        })
      );
    }

    const payloadPart = chunks[0];
    const signaturePart = chunks[1];
    if (!payloadPart || !signaturePart) {
      return err(
        new YukitaError({
          code: YukitaErrorCode.AUTH_FAILED,
          message: 'Invalid HMAC token format'
        })
      );
    }
    const expected = createHmac('sha256', this.options.auth.secret).update(payloadPart).digest('base64url');
    if (expected !== signaturePart) {
      return err(
        new YukitaError({
          code: YukitaErrorCode.AUTH_FAILED,
          message: 'Invalid HMAC signature'
        })
      );
    }

    try {
      const payload = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8')) as GatewayClaims;
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return err(
          new YukitaError({
            code: YukitaErrorCode.AUTH_FAILED,
            message: 'HMAC token expired'
          })
        );
      }
      if (!payload.roles?.length) {
        return err(
          new YukitaError({
            code: YukitaErrorCode.AUTH_FAILED,
            message: 'Token has no roles'
          })
        );
      }
      return ok(payload);
    } catch (error) {
      return err(
        new YukitaError({
          code: YukitaErrorCode.AUTH_FAILED,
          message: 'Invalid HMAC token payload',
          cause: error
        })
      );
    }
  }

  private hasAnyRole(current: readonly string[], required: readonly string[]): boolean {
    return required.some((role) => current.includes(role));
  }
}
