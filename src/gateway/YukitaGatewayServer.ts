import { createHmac, randomUUID } from 'crypto';
import { parse as parseUrl } from 'url';
import jwt from 'jsonwebtoken';
import type { YukitaCoreEvents } from '../types';
import type { YukitaSan } from '../YukitaSan';
import { YukitaError, YukitaErrorCode, err, ok, type Result, type YukitaResolveModel, type YukitaTrackModel } from '../shared';
import WebSocket, { WebSocketServer, type RawData } from 'ws';
import type {
  GatewayClaims,
  GatewayCommandRegistration,
  GatewayEnvelope,
  GatewayOutboundTransform,
  GatewayRateLimitOptions,
  GatewayRole,
  GatewayServerOptions,
  GatewaySessionInfo
} from './types';

type SessionState = {
  socket: WebSocket;
  claims: GatewayClaims | null;
  authenticated: boolean;
  challenge: string;
  authTimer: NodeJS.Timeout | null;
  subscriptions: Set<string>;
  commandCount: number;
  windowStartedAt: number;
};

const BUILT_IN_COMMANDS = new Set<string>([
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
  'filters.clear',
  'subscribe',
  'unsubscribe'
]);

/**
 * WebSocket gateway for subscriptions and remote commands.
 */
export class YukitaGatewayServer {
  private readonly client: YukitaSan;
  private readonly options: GatewayServerOptions;
  private readonly sessions = new Map<WebSocket, SessionState>();
  private readonly coreUnsubscribers: Array<() => void> = [];
  private readonly rateLimit: GatewayRateLimitOptions;
  private readonly commands = new Map<string, GatewayCommandRegistration>();
  private readonly outboundTransforms: GatewayOutboundTransform[] = [];
  private wss: WebSocketServer | null = null;

  public constructor(client: YukitaSan, options: GatewayServerOptions) {
    this.client = client;
    this.options = options;
    this.rateLimit = {
      maxCommands: options.rateLimit?.maxCommands ?? 60,
      windowMs: options.rateLimit?.windowMs ?? 30_000
    };
    this.outboundTransforms.push((session, frame) => this.sanitizeFrame(session, frame));
  }

  /**
   * Registers a custom gateway command handler (plugin extension point).
   */
  public registerCommand(name: string, registration: GatewayCommandRegistration): () => void {
    const command = name.trim();
    if (!command) {
      throw new Error('Gateway command name cannot be empty');
    }
    if (BUILT_IN_COMMANDS.has(command)) {
      throw new Error(`Cannot override built-in gateway command: ${command}`);
    }
    if (this.commands.has(command)) {
      throw new Error(`Gateway command already registered: ${command}`);
    }
    this.commands.set(command, registration);
    return () => {
      this.commands.delete(command);
    };
  }

  /**
   * Adds an outbound frame transform hook.
   * Return disposer to remove.
   */
  public addOutboundTransform(transform: GatewayOutboundTransform): () => void {
    this.outboundTransforms.push(transform);
    return () => {
      const index = this.outboundTransforms.indexOf(transform);
      if (index >= 0) {
        this.outboundTransforms.splice(index, 1);
      }
    };
  }

  /**
   * Publishes an event frame to a topic (or topics).
   */
  public publish(topics: string | readonly string[], type: string, payload: object): void {
    const list = Array.isArray(topics) ? [...topics] : [topics];
    if (!list.length) {
      return;
    }

    const frame: GatewayEnvelope = {
      op: 'event',
      t: type,
      id: randomUUID(),
      ts: Date.now(),
      d: payload as Record<string, unknown>
    };

    for (const session of this.sessions.values()) {
      if (this.isSubscribed(session, list)) {
        this.sendEnvelope(session, frame);
      }
    }
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
      void this.handleConnection(
        socket,
        request.headers.authorization,
        request.headers['sec-websocket-protocol'],
        request.headers.origin,
        request.url ?? ''
      );
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
      if (session.authTimer) {
        clearTimeout(session.authTimer);
        session.authTimer = null;
      }
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
    subprotocolHeader: string | string[] | undefined,
    origin: string | undefined,
    requestUrl: string
  ): Promise<void> {
    const originAllowed = this.isOriginAllowed(origin);
    if (!originAllowed) {
      socket.close(4403, 'origin denied');
      return;
    }

    const session: SessionState = {
      socket,
      claims: null,
      authenticated: false,
      challenge: randomUUID(),
      authTimer: null,
      subscriptions: new Set<string>(),
      commandCount: 0,
      windowStartedAt: Date.now()
    };

    const token = this.extractToken(authHeader, subprotocolHeader, requestUrl);
    if (token) {
      const claimsResult = this.verifyToken(token);
      if (!claimsResult.ok) {
        socket.close(4401, claimsResult.error.message);
        return;
      }
      session.claims = claimsResult.value;
      session.authenticated = true;
      this.sendAck(session, 'auth', randomUUID(), {
        authenticated: true,
        roles: session.claims.roles
      });
    } else {
      this.sendHello(session);
      session.authTimer = setTimeout(() => {
        socket.close(4401, 'auth timeout');
      }, 10_000);
    }

    this.sessions.set(socket, session);

    socket.on('message', (chunk) => {
      void this.handleMessage(session, chunk);
    });

    socket.on('close', () => {
      if (session.authTimer) {
        clearTimeout(session.authTimer);
        session.authTimer = null;
      }
      this.sessions.delete(socket);
    });
  }

  private async handleMessage(session: SessionState, chunk: RawData): Promise<void> {
    let frame: GatewayEnvelope;
    try {
      frame = JSON.parse(chunk.toString()) as GatewayEnvelope;
    } catch {
      this.sendErrorEnvelope(session, {
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

    if (frame.op === 'auth') {
      await this.handleAuth(session, frame.id, frame.d);
      return;
    }

    if (!session.authenticated || !session.claims) {
      this.sendError(session, frame.t, frame.id, new YukitaError({
        code: YukitaErrorCode.AUTH_FAILED,
        message: 'Not authenticated'
      }));
      return;
    }

    if (frame.op !== 'cmd') {
      this.sendError(session, frame.t, frame.id, new YukitaError({
        code: YukitaErrorCode.INVALID_ARGUMENT,
        message: 'Only cmd operation is accepted from client'
      }));
      return;
    }

    if (!this.consumeRateLimit(session)) {
      this.sendError(session, frame.t, frame.id, new YukitaError({
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

  private async handleAuth(
    session: SessionState,
    commandId: string,
    payload: Record<string, unknown>
  ): Promise<void> {
    if (session.authenticated) {
      this.sendAck(session, 'auth', commandId, { authenticated: true });
      return;
    }

    const token = payload.token;
    const challenge = payload.challenge;
    if (typeof token !== 'string' || !token.trim()) {
      session.socket.close(4401, 'missing token');
      return;
    }
    if (typeof challenge !== 'string' || challenge !== session.challenge) {
      session.socket.close(4401, 'invalid challenge');
      return;
    }

    const claimsResult = this.verifyToken(token);
    if (!claimsResult.ok) {
      session.socket.close(4401, claimsResult.error.message);
      return;
    }

    session.claims = claimsResult.value;
    session.authenticated = true;
    if (session.authTimer) {
      clearTimeout(session.authTimer);
      session.authTimer = null;
    }

    this.sendAck(session, 'auth', commandId, {
      authenticated: true,
      roles: session.claims.roles
    });
  }

  private async dispatchCommand(
    session: SessionState,
    commandType: string,
    commandId: string,
    payload: Record<string, unknown>
  ): Promise<void> {
    if (!session.claims) {
      this.sendError(session, commandType, commandId, new YukitaError({
        code: YukitaErrorCode.AUTH_FAILED,
        message: 'Not authenticated'
      }));
      return;
    }

    const custom = this.commands.get(commandType);
    if (custom) {
      const requiredRoles = custom.requiredRoles;
      if (requiredRoles?.length && !this.hasAnyRole(session.claims.roles, requiredRoles)) {
        this.sendError(session, commandType, commandId, new YukitaError({
          code: YukitaErrorCode.COMMAND_NOT_ALLOWED,
          message: `Command requires ${requiredRoles.join(' | ')} role`
        }));
        return;
      }

      let exec: Result<object>;
      try {
        exec = await custom.handler(
          {
            claims: session.claims,
            subscriptions: session.subscriptions
          },
          payload
        );
      } catch (error) {
        exec = err(
          new YukitaError({
            code: YukitaErrorCode.INTERNAL_ERROR,
            message: 'Gateway command handler threw',
            cause: error,
            meta: { commandType }
          })
        );
      }

      if (!exec.ok) {
        this.sendError(session, commandType, commandId, exec.error);
        return;
      }

      this.sendAck(session, commandType, commandId, exec.value ?? {});
      return;
    }

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
      this.sendError(session, commandType, commandId, new YukitaError({
        code: YukitaErrorCode.COMMAND_NOT_ALLOWED,
        message: 'Control command requires bot:control or admin role'
      }));
      return;
    }

    if (readCommands.has(commandType) && !this.hasAnyRole(session.claims.roles, ['web:read', 'admin'])) {
      this.sendError(session, commandType, commandId, new YukitaError({
        code: YukitaErrorCode.COMMAND_NOT_ALLOWED,
        message: 'Read command requires web:read or admin role'
      }));
      return;
    }

    const exec = await this.executeCommand(commandType, payload);
    if (!exec.ok) {
      this.sendError(session, commandType, commandId, exec.error);
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

    this.sendAck(session, commandType, commandId, exec.value ?? {});
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
        this.maybeBroadcastMetrics();
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
        this.sendEnvelope(session, frame);
      }
    }
  }

  private topicsForEvent<TKey extends keyof YukitaCoreEvents>(
    event: TKey,
    payload: YukitaCoreEvents[TKey]
  ): string[] {
    if (String(event).startsWith('node.')) {
      const nodeId = (payload as { nodeId?: string }).nodeId;
      return nodeId ? ['nodes', 'events', 'node', `node:${nodeId}`] : ['nodes', 'events', 'node'];
    }

    const contextId = (payload as { contextId?: string }).contextId;
    if (!contextId) {
      return [];
    }
    const domain = String(event).split('.')[0];
    return ['players', 'events', `context:${contextId}`, `context:${contextId}:${domain}`];
  }

  private isSubscribed(session: SessionState, topics: string[]): boolean {
    if (session.subscriptions.has('*')) {
      return true;
    }
    return topics.some((topic) => session.subscriptions.has(topic));
  }

  private async sendSnapshotIfAvailable(session: SessionState, topic: string): Promise<void> {
    if (topic === 'nodes') {
      const nodes = this.client.nodePool.listNodes().map((node) => ({
        id: node.id,
        state: node.state,
        stats: node.stats,
        penalty: node.penalty,
        latencyMs: node.latencyMs
      }));
      this.sendEnvelope(session, {
        op: 'event',
        t: 'snapshot.nodes',
        id: randomUUID(),
        ts: Date.now(),
        d: { nodes }
      });
      return;
    }

    if (topic === 'players') {
      const players = this.client.listPlayers();
      this.sendEnvelope(session, {
        op: 'event',
        t: 'snapshot.players',
        id: randomUUID(),
        ts: Date.now(),
        d: { players }
      });
      return;
    }

    if (topic === 'metrics') {
      this.sendEnvelope(session, {
        op: 'event',
        t: 'snapshot.metrics',
        id: randomUUID(),
        ts: Date.now(),
        d: { metrics: this.getMetricsSnapshot() }
      });
      return;
    }

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

    this.sendEnvelope(session, {
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

  private hasTopicSubscriber(topic: string): boolean {
    for (const session of this.sessions.values()) {
      if (session.subscriptions.has('*') || session.subscriptions.has(topic)) {
        return true;
      }
    }
    return false;
  }

  private maybeBroadcastMetrics(): void {
    if (!this.hasTopicSubscriber('metrics')) {
      return;
    }

    const metrics = this.getMetricsSnapshot();
    if (!metrics) {
      return;
    }

    this.publish('metrics', 'metrics.updated', { metrics });
  }

  private getMetricsSnapshot(): unknown | null {
    const ext = this.client.getExtension<{ getSnapshot: () => unknown }>('metrics');
    if (!ext.ok) {
      return null;
    }
    try {
      return ext.value.getSnapshot();
    } catch {
      return null;
    }
  }

  private sanitizeFrame(session: GatewaySessionInfo, frame: GatewayEnvelope): GatewayEnvelope | null {
    if (frame.op !== 'event') {
      return frame;
    }

    const isControl = this.hasAnyRole(session.claims.roles, ['bot:control', 'admin']);

    const stripEncoded = (track: unknown): unknown => {
      if (isControl) {
        return track;
      }
      if (!track || typeof track !== 'object') {
        return track;
      }

      const { encoded: _encoded, ...rest } = track as YukitaTrackModel;
      return rest;
    };

    const sanitizeResolveModel = (model: unknown): unknown => {
      if (isControl) {
        return model;
      }
      if (!model || typeof model !== 'object') {
        return model;
      }

      const payload = model as YukitaResolveModel;
      if (payload.kind === 'tracks') {
        return {
          ...payload,
          tracks: Array.isArray(payload.tracks) ? payload.tracks.map(stripEncoded) : []
        };
      }

      if (payload.kind === 'playlist') {
        return {
          ...payload,
          playlist: payload.playlist
            ? {
                ...payload.playlist,
                tracks: Array.isArray(payload.playlist.tracks) ? payload.playlist.tracks.map(stripEncoded) : []
              }
            : payload.playlist
        };
      }

      return model;
    };

    const sanitizeSnapshot = (snapshot: unknown): unknown => {
      if (!snapshot || typeof snapshot !== 'object') {
        return snapshot;
      }

      const raw = snapshot as any;
      const voice = raw.voice && typeof raw.voice === 'object'
        ? {
            contextId: raw.voice.contextId,
            guildId: raw.voice.guildId,
            channelId: raw.voice.channelId ?? null,
            shardId: raw.voice.shardId ?? 0,
            connected: Boolean(raw.voice.connected)
          }
        : raw.voice;

      return {
        ...raw,
        current: stripEncoded(raw.current),
        queue: Array.isArray(raw.queue) ? raw.queue.map(stripEncoded) : raw.queue,
        voice
      };
    };

    const stripRawEventTrack = (payload: unknown): unknown => {
      if (isControl) {
        return payload;
      }
      if (!payload || typeof payload !== 'object') {
        return payload;
      }

      const raw = payload as any;
      if (!raw.track || typeof raw.track !== 'object') {
        return payload;
      }

      const { encoded: _encoded, ...rest } = raw.track as { encoded?: unknown };
      return { ...raw, track: rest };
    };

    const d = frame.d;

    switch (frame.t) {
      case 'player.created':
      case 'player.destroyed':
      case 'player.state':
        return { ...frame, d: { ...d, snapshot: sanitizeSnapshot(d.snapshot) } };
      case 'queue.updated':
        return { ...frame, d: { ...d, queue: Array.isArray(d.queue) ? (d.queue as unknown[]).map(stripEncoded) : d.queue } };
      case 'track.started':
      case 'track.ended':
        return { ...frame, d: { ...d, track: stripEncoded(d.track) } };
      case 'track.stuck':
      case 'track.exception':
        return { ...frame, d: { ...d, payload: stripRawEventTrack(d.payload) } };
      case 'resolve.completed': {
        const output = d.output as any;
        if (!output || typeof output !== 'object') {
          return frame;
        }
        return {
          ...frame,
          d: {
            ...d,
            output: {
              ...output,
              result: sanitizeResolveModel(output.result)
            }
          }
        };
      }
      case 'snapshot.players':
        return {
          ...frame,
          d: {
            ...d,
            players: Array.isArray(d.players) ? (d.players as unknown[]).map(sanitizeSnapshot) : d.players
          }
        };
      case 'snapshot':
        return { ...frame, d: { ...d, snapshot: sanitizeSnapshot(d.snapshot) } };
      default:
        return frame;
    }
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

  private sendAck(session: SessionState, type: string, id: string, payload: object): void {
    this.sendEnvelope(session, {
      op: 'ack',
      t: type,
      id,
      ts: Date.now(),
      d: payload as Record<string, unknown>
    });
  }

  private sendError(session: SessionState, type: string, id: string, error: YukitaError): void {
    this.sendErrorEnvelope(session, {
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

  private sendErrorEnvelope(session: SessionState, frame: GatewayEnvelope): void {
    this.sendEnvelope(session, frame);
  }

  private sendEnvelope(session: SessionState, frame: GatewayEnvelope): void {
    const socket = session.socket;
    if (socket.readyState !== WebSocket.OPEN) {
      return;
    }

    let outbound: GatewayEnvelope | null = frame;
    if (session.claims) {
      const info: GatewaySessionInfo = {
        claims: session.claims,
        subscriptions: session.subscriptions
      };

      for (const transform of this.outboundTransforms) {
        if (!outbound) {
          break;
        }
        try {
          outbound = transform(info, outbound);
        } catch (error) {
          console.error('[yukita-gateway] outbound transform failed', error);
        }
      }
    }

    if (!outbound) {
      return;
    }

    socket.send(JSON.stringify(outbound));
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

  private extractToken(
    authHeader: string | undefined,
    subprotocolHeader: string | string[] | undefined,
    requestUrl: string
  ): string | null {
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.slice('Bearer '.length).trim();
    }

    const parsed = parseUrl(requestUrl, true);
    const token = parsed.query.token;
    if (typeof token === 'string') {
      return token;
    }

    const headerValue = Array.isArray(subprotocolHeader) ? subprotocolHeader.join(',') : subprotocolHeader;
    if (!headerValue) {
      return null;
    }

    const protocols = headerValue.split(',').map((value) => value.trim()).filter(Boolean);
    for (const protocol of protocols) {
      if (protocol.startsWith('yukitasan.token.')) {
        return protocol.slice('yukitasan.token.'.length).trim() || null;
      }
      if (protocol.startsWith('token.')) {
        return protocol.slice('token.'.length).trim() || null;
      }
    }

    return null;
  }

  private sendHello(session: SessionState): void {
    this.sendEnvelope(session, {
      op: 'hello',
      t: 'hello',
      id: randomUUID(),
      ts: Date.now(),
      d: {
        challenge: session.challenge,
        auth: ['query', 'subprotocol', 'message']
      }
    });
  }

  private verifyToken(token: string): Result<GatewayClaims> {
    if (this.options.auth.mode === 'jwt') {
      try {
        const payload = jwt.verify(token, this.options.auth.secret, {
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
