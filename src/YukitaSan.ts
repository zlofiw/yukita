import { satisfies } from 'semver';
import {
  AsyncEventBus,
  YukitaError,
  YukitaErrorCode,
  err,
  ok,
  toYukitaError,
  type Result,
  type YukitaResolveModel,
  type YukitaTrackModel
} from './shared';
import type {
  BeforePlayPayload,
  BeforeResolvePayload,
  PluginHooks,
  PluginInitContext,
  PluginLogger,
  YukitaPlugin
} from './plugins/types';
import { mapLoadResult } from './lavalink/codec';
import type { LavalinkFilters } from './lavalink/types';
import { NodePool } from './lavalink/NodePool';
import { YukitaPlayer } from './lavalink/Player';
import type { LavalinkRestClientHooks } from './lavalink/LavalinkRestClient';
import type { LavalinkResponse, LavalinkResponseError, RestRequestContext, RestResponseContext } from './lavalink/responses';
import type { Connector } from './connectors/Connector';
import type {
  CreatePlayerOptions,
  ExtensionsMap,
  NodeSelectionRequest,
  PlayInput,
  PlayerSnapshot,
  ResolveOptions,
  ResolveOutput,
  VoiceServerUpdate,
  VoiceStateUpdate,
  YukitaSanEvents,
  YukitaSanOptions
} from './types';
import { CORE_VERSION } from './version';

type HookEntry = {
  pluginName: string;
  hooks: PluginHooks;
};

/**
 * Main orchestration class for nodes, players, resolve and plugins.
 */
export class YukitaSan {
  public readonly nodePool: NodePool;
  public readonly connector: Connector | null;
  public readonly events = new AsyncEventBus<YukitaSanEvents>();
  public readonly extensions: ExtensionsMap = new Map();
  public readonly plugins = new Map<string, YukitaPlugin>();

  private readonly players = new Map<string, YukitaPlayer>();
  private readonly guildToContext = new Map<string, string>();
  private readonly orderedChains = new Map<string, Promise<void>>();
  private readonly failoverTimers = new Map<string, NodeJS.Timeout>();
  private readonly logger: PluginLogger;
  private readonly hooks: HookEntry[] = [];

  public constructor(options: YukitaSanOptions) {
    this.logger = this.buildLogger(options.logger);
    this.connector = options.connector ?? null;
    this.connector?.set(this);
    this.nodePool = new NodePool({
      nodes: options.nodes,
      strategy: options.selectionStrategy ?? 'penalty'
    });
    this.bindNodePoolEvents();
    this.updateNodeRestHooks();
  }

  /**
   * Starts node connections.
   */
  public async start(): Promise<Result<void>> {
    this.connector?.listen(this.nodePool.listNodes());
    const connected = await this.nodePool.connectAll();
    if (!connected.ok) {
      return connected;
    }

    for (const entry of this.hooks) {
      if (!entry.hooks.onInit) {
        continue;
      }
      try {
        await entry.hooks.onInit();
      } catch (error) {
        this.logger.warn('Plugin init hook failed', {
          plugin: entry.pluginName,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    return ok(undefined);
  }

  /**
   * Gracefully stops client and all nodes.
   */
  public async shutdown(): Promise<Result<void>> {
    try {
      for (const contextId of this.players.keys()) {
        const result = await this.destroyPlayer(contextId);
        if (!result.ok) {
          this.logger.warn('Failed to destroy player during shutdown', {
            contextId,
            error: result.error.message
          });
        }
      }

      for (const entry of this.hooks) {
        if (!entry.hooks.onShutdown) {
          continue;
        }
        try {
          await entry.hooks.onShutdown();
        } catch (error) {
          this.logger.warn('Plugin shutdown hook failed', {
            plugin: entry.pluginName,
            error: error instanceof Error ? error.message : String(error)
          });
        }
      }

      await this.nodePool.destroy();
      this.events.clear();
      this.orderedChains.clear();
      this.guildToContext.clear();
      for (const timer of this.failoverTimers.values()) {
        clearTimeout(timer);
      }
      this.failoverTimers.clear();
      return ok(undefined);
    } catch (error) {
      return err(
        toYukitaError(error, {
          code: YukitaErrorCode.INTERNAL_ERROR,
          message: 'Failed to shutdown YukitaSan client'
        })
      );
    }
  }

  /**
   * Registers listener and returns unsubscribe function.
   */
  public on<TKey extends keyof YukitaSanEvents>(
    event: TKey,
    listener: (payload: YukitaSanEvents[TKey]) => void | Promise<void>
  ): () => void {
    return this.events.on(event, listener);
  }

  /**
   * Installs plugin with compatibility check.
   */
  public async use(plugin: YukitaPlugin): Promise<Result<void>> {
    if (this.plugins.has(plugin.name)) {
      return err(
        new YukitaError({
          code: YukitaErrorCode.INVALID_ARGUMENT,
          message: `Plugin "${plugin.name}" already installed`,
          meta: { plugin: plugin.name }
        })
      );
    }

    if (plugin.compatibleRange && !satisfies(CORE_VERSION, plugin.compatibleRange, { includePrerelease: true })) {
      return err(
        new YukitaError({
          code: YukitaErrorCode.INCOMPATIBLE_PLUGIN,
          message: `Plugin "${plugin.name}" is not compatible with core ${CORE_VERSION}`,
          meta: {
            plugin: plugin.name,
            compatibleRange: plugin.compatibleRange
          }
        })
      );
    }

    const localHooks: PluginHooks[] = [];
    const context: PluginInitContext = {
      coreVersion: CORE_VERSION,
      client: this,
      registerHooks: (hooks) => {
        localHooks.push(hooks);
      },
      extendApi: (namespace, api) => this.extendApi(namespace, api),
      logger: this.logger
    };

    try {
      const initResult = await plugin.init(context);
      if (this.isResult(initResult) && !initResult.ok) {
        return initResult;
      }
    } catch (error) {
      return err(
        new YukitaError({
          code: YukitaErrorCode.PLUGIN_INIT_FAILED,
          message: `Plugin "${plugin.name}" init failed`,
          cause: error,
          meta: { plugin: plugin.name }
        })
      );
    }

    for (const hooks of localHooks) {
      this.hooks.push({
        pluginName: plugin.name,
        hooks
      });
    }

    this.plugins.set(plugin.name, plugin);
    this.updateNodeRestHooks();
    return ok(undefined);
  }

  /**
   * Retrieves plugin extension namespace.
   */
  public getExtension<TApi extends object>(namespace: string): Result<TApi> {
    const extension = this.extensions.get(namespace);
    if (!extension) {
      return err(
        new YukitaError({
          code: YukitaErrorCode.INVALID_ARGUMENT,
          message: `Extension namespace "${namespace}" not found`,
          meta: { namespace }
        })
      );
    }
    return ok(extension as TApi);
  }

  /**
   * Creates player for context.
   */
  public async createPlayer(contextId: string, input: CreatePlayerOptions): Promise<Result<YukitaPlayer>> {
    const existing = this.players.get(contextId);
    if (existing) {
      return ok(existing);
    }

    const nodeResult = input.nodeId
      ? this.nodePool.select({ preferredNodeId: input.nodeId })
      : this.nodePool.select();
    if (!nodeResult.ok) {
      return nodeResult;
    }

    const playerInput: ConstructorParameters<typeof YukitaPlayer>[0] = {
      client: this,
      contextId,
      guildId: input.guildId,
      shardId: input.shardId,
      nodeId: nodeResult.value.id
    };
    if (typeof input.initialChannelId !== 'undefined') {
      playerInput.initialChannelId = input.initialChannelId;
    }

    const player = new YukitaPlayer(playerInput);

    this.players.set(contextId, player);
    this.guildToContext.set(input.guildId, contextId);
    await this.emitOrdered(contextId, 'player.created', {
      contextId,
      snapshot: player.snapshot()
    });
    return ok(player);
  }

  /**
   * Gets player by context id.
   */
  public getPlayer(contextId: string): Result<YukitaPlayer> {
    const player = this.players.get(contextId);
    if (!player) {
      return err(
        new YukitaError({
          code: YukitaErrorCode.PLAYER_NOT_FOUND,
          message: `Player for context "${contextId}" not found`,
          meta: { contextId }
        })
      );
    }
    return ok(player);
  }

  /**
   * Returns snapshots of all known players.
   */
  public listPlayers(): PlayerSnapshot[] {
    return [...this.players.values()].map((player) => player.snapshot());
  }

  /**
   * Destroys player by context id.
   */
  public async destroyPlayer(contextId: string): Promise<Result<void>> {
    const playerResult = this.getPlayer(contextId);
    if (!playerResult.ok) {
      return playerResult;
    }

    const player = playerResult.value;
    const snapshot = player.snapshot();
    const destroyResult = await player.destroy();
    if (!destroyResult.ok) {
      return destroyResult;
    }

    this.players.delete(contextId);
    this.guildToContext.delete(snapshot.guildId);
    await this.emitOrdered(contextId, 'player.destroyed', {
      contextId,
      snapshot
    });
    return ok(undefined);
  }

  /**
   * Resolves query/url through selected node.
   */
  public async resolve(contextId: string, query: string, options: ResolveOptions = {}): Promise<Result<ResolveOutput>> {
    let payload: BeforeResolvePayload = { contextId, query };
    if (typeof options.preferredNodeId !== 'undefined') {
      payload.preferredNodeId = options.preferredNodeId;
    }
    if (typeof options.sourceHints !== 'undefined') {
      payload.sourceHints = options.sourceHints;
    }
    if (typeof options.metadata !== 'undefined') {
      payload.metadata = options.metadata;
    }

    const beforeHookResult = await this.runBeforeResolve(payload);
    if (!beforeHookResult.ok) {
      await this.events.emit('resolve.failed', {
        contextId,
        query,
        error: beforeHookResult.error
      });
      return beforeHookResult;
    }
    payload = beforeHookResult.value;

    if (payload.shortCircuitResult) {
      const afterCacheHook = await this.runAfterResolve(payload, payload.shortCircuitResult);
      if (!afterCacheHook.ok) {
        await this.events.emit('resolve.failed', {
          contextId,
          query,
          error: afterCacheHook.error
        });
        return afterCacheHook;
      }

      const output: ResolveOutput = {
        nodeId: payload.preferredNodeId ?? 'plugin-cache',
        result: afterCacheHook.value
      };
      await this.events.emit('resolve.completed', {
        contextId,
        query,
        output
      });
      return ok(output);
    }

    const selectionRequest: NodeSelectionRequest = {};
    if (typeof payload.preferredNodeId !== 'undefined') {
      selectionRequest.preferredNodeId = payload.preferredNodeId;
    }
    const nodeResult = this.nodePool.select(selectionRequest);
    if (!nodeResult.ok) {
      await this.events.emit('resolve.failed', {
        contextId,
        query,
        error: nodeResult.error
      });
      return nodeResult;
    }

    const identifier = this.buildIdentifier(payload.query, payload.sourceHints);
    const resolveRaw = await nodeResult.value.rest.resolve(identifier);
    if (!resolveRaw.ok) {
      const error = new YukitaError({
        code: YukitaErrorCode.NODE_REST_FAILED,
        message: resolveRaw.error.message,
        meta: {
          ...(resolveRaw.error.details ?? {}),
          requestId: resolveRaw.meta.requestId,
          endpoint: resolveRaw.meta.endpoint,
          nodeId: nodeResult.value.id,
          identifier
        },
        cause: resolveRaw.error.cause
      });
      await this.events.emit('resolve.failed', {
        contextId,
        query,
        error
      });
      return err(error);
    }

    const mapped = mapLoadResult(resolveRaw.value);
    if (!mapped.ok) {
      await this.events.emit('resolve.failed', {
        contextId,
        query,
        error: mapped.error
      });
      return mapped;
    }

    const afterHookResult = await this.runAfterResolve(payload, mapped.value.result);
    if (!afterHookResult.ok) {
      await this.events.emit('resolve.failed', {
        contextId,
        query,
        error: afterHookResult.error
      });
      return afterHookResult;
    }

    const output: ResolveOutput = {
      nodeId: nodeResult.value.id,
      result: afterHookResult.value
    };
    await this.events.emit('resolve.completed', {
      contextId,
      query,
      output
    });
    return ok(output);
  }

  /**
   * Resolves and starts playback or uses provided track.
   */
  public async play(contextId: string, input: PlayInput): Promise<Result<PlayerSnapshot>> {
    const playerResult = this.getPlayer(contextId);
    if (!playerResult.ok) {
      return playerResult;
    }
    const player = playerResult.value;

    let selectedTrack: YukitaTrackModel | null = input.track ?? null;
    let additionalTracks: YukitaTrackModel[] = [];

    if (!selectedTrack) {
      if (!input.query) {
        return err(
          new YukitaError({
            code: YukitaErrorCode.INVALID_ARGUMENT,
            message: 'play requires query or track'
          })
        );
      }
      const resolveResult = await this.resolve(contextId, input.query, this.toResolveOptions(input));
      if (!resolveResult.ok) {
        return resolveResult;
      }

      const resolved = resolveResult.value.result;
      if (resolved.kind === 'loadFailed') {
        return err(
          new YukitaError({
            code: YukitaErrorCode.LOAD_FAILED,
            message: resolved.message,
            meta: { cause: resolved.cause }
          })
        );
      }

      if (resolved.kind === 'noMatches') {
        return err(
          new YukitaError({
            code: YukitaErrorCode.RESOLVE_FAILED,
            message: 'No matches found'
          })
        );
      }

      if (resolved.kind === 'playlist') {
        selectedTrack = resolved.playlist.tracks[0] ?? null;
        additionalTracks = resolved.playlist.tracks.slice(1);
      } else {
        selectedTrack = resolved.tracks[0] ?? null;
        additionalTracks = resolved.tracks.slice(1);
      }
    }

    if (!selectedTrack) {
      return err(
        new YukitaError({
          code: YukitaErrorCode.RESOLVE_FAILED,
          message: 'No playable track found'
        })
      );
    }

    if (additionalTracks.length) {
      const queueResult = await player.addToQueue(additionalTracks);
      if (!queueResult.ok) {
        return queueResult;
      }
    }

    const playOptions: Parameters<YukitaPlayer['playTrack']>[1] = {};
    if (typeof input.metadata !== 'undefined') {
      playOptions.metadata = input.metadata;
    }
    const playResult = await player.playTrack(selectedTrack, playOptions);
    if (!playResult.ok) {
      return playResult;
    }
    return ok(player.snapshot());
  }

  /**
   * Adds query/track to queue.
   */
  public async queueAdd(contextId: string, input: PlayInput): Promise<Result<PlayerSnapshot>> {
    const playerResult = this.getPlayer(contextId);
    if (!playerResult.ok) {
      return playerResult;
    }
    const player = playerResult.value;

    let tracks: YukitaTrackModel[] = [];
    if (input.track) {
      tracks = [input.track];
    } else if (input.query) {
      const resolveResult = await this.resolve(contextId, input.query, this.toResolveOptions(input));
      if (!resolveResult.ok) {
        return resolveResult;
      }
      const resolved = resolveResult.value.result;
      if (resolved.kind === 'tracks') {
        tracks = resolved.tracks;
      } else if (resolved.kind === 'playlist') {
        tracks = resolved.playlist.tracks;
      } else if (resolved.kind === 'loadFailed') {
        return err(
          new YukitaError({
            code: YukitaErrorCode.LOAD_FAILED,
            message: resolved.message,
            meta: { cause: resolved.cause }
          })
        );
      } else {
        tracks = [];
      }
    } else {
      return err(
        new YukitaError({
          code: YukitaErrorCode.INVALID_ARGUMENT,
          message: 'queueAdd requires query or track'
        })
      );
    }

    if (!tracks.length) {
      return err(
        new YukitaError({
          code: YukitaErrorCode.RESOLVE_FAILED,
          message: 'No tracks to add'
        })
      );
    }

    const queueResult = await player.addToQueue(tracks);
    if (!queueResult.ok) {
      return queueResult;
    }
    return ok(player.snapshot());
  }

  /**
   * Pauses current player.
   */
  public async pause(contextId: string): Promise<Result<PlayerSnapshot>> {
    return this.wrapPlayerState(contextId, async (player) => player.pause());
  }

  /**
   * Resumes current player.
   */
  public async resume(contextId: string): Promise<Result<PlayerSnapshot>> {
    return this.wrapPlayerState(contextId, async (player) => player.resume());
  }

  /**
   * Stops current player.
   */
  public async stop(contextId: string): Promise<Result<PlayerSnapshot>> {
    return this.wrapPlayerState(contextId, async (player) => player.stop());
  }

  /**
   * Seeks current track.
   */
  public async seek(contextId: string, positionMs: number): Promise<Result<PlayerSnapshot>> {
    return this.wrapPlayerState(contextId, async (player) => player.seek(positionMs));
  }

  /**
   * Sets player volume.
   */
  public async setVolume(contextId: string, volume: number): Promise<Result<PlayerSnapshot>> {
    return this.wrapPlayerState(contextId, async (player) => player.setVolume(volume));
  }

  /**
   * Applies player filters.
   */
  public async applyFilters(contextId: string, filters: LavalinkFilters): Promise<Result<PlayerSnapshot>> {
    return this.wrapPlayerState(contextId, async (player) => player.applyFilters(filters));
  }

  /**
   * Clears player filters.
   */
  public async clearFilters(contextId: string): Promise<Result<PlayerSnapshot>> {
    return this.wrapPlayerState(contextId, async (player) => player.clearFilters());
  }

  /**
   * Removes queue track.
   */
  public async queueRemove(contextId: string, index: number): Promise<Result<PlayerSnapshot>> {
    return this.wrapPlayerState(contextId, async (player) => player.removeFromQueue(index).then((result) => (result.ok ? ok(undefined) : result)));
  }

  /**
   * Moves queue track.
   */
  public async queueMove(contextId: string, fromIndex: number, toIndex: number): Promise<Result<PlayerSnapshot>> {
    return this.wrapPlayerState(contextId, async (player) => player.moveQueue(fromIndex, toIndex));
  }

  /**
   * Clears queue.
   */
  public async queueClear(contextId: string): Promise<Result<PlayerSnapshot>> {
    return this.wrapPlayerState(contextId, async (player) => player.clearQueue());
  }

  /**
   * Shuffles queue.
   */
  public async queueShuffle(contextId: string): Promise<Result<PlayerSnapshot>> {
    return this.wrapPlayerState(contextId, async (player) => player.shuffleQueue());
  }

  /**
   * Applies voice state updates from external connector.
   */
  public async applyVoiceStateUpdate(input: VoiceStateUpdate): Promise<Result<void>> {
    const playerResult = await this.ensurePlayer(input.contextId, {
      guildId: input.guildId,
      shardId: input.shardId
    });
    if (!playerResult.ok) {
      return playerResult;
    }

    return playerResult.value.applyVoiceState({
      channelId: input.channelId,
      sessionId: input.sessionId,
      shardId: input.shardId
    });
  }

  /**
   * Applies voice server updates from external connector.
   */
  public async applyVoiceServerUpdate(input: VoiceServerUpdate): Promise<Result<void>> {
    const playerResult = await this.ensurePlayer(input.contextId, {
      guildId: input.guildId,
      shardId: 0
    });
    if (!playerResult.ok) {
      return playerResult;
    }
    return playerResult.value.applyVoiceServer({
      endpoint: input.endpoint,
      token: input.token
    });
  }

  /**
   * Emits event ordered per context id.
   */
  public async emitOrdered<TKey extends keyof YukitaSanEvents>(
    contextId: string,
    event: TKey,
    payload: YukitaSanEvents[TKey]
  ): Promise<void> {
    const previous = this.orderedChains.get(contextId) ?? Promise.resolve();
    const next = previous
      .catch(() => undefined)
      .then(async () => {
        await this.events.emit(event, payload, (error) => {
          this.logger.error('Core listener failed', {
            event: String(event),
            contextId,
            error: error.message
          });
        });
        await this.dispatchPluginEvent(event, payload);
      });
    this.orderedChains.set(contextId, next);
    await next;
  }

  /**
   * Runs before-play plugin hooks.
   */
  public async runBeforePlay(payload: BeforePlayPayload): Promise<Result<BeforePlayPayload>> {
    let current = payload;
    for (const entry of this.hooks) {
      if (!entry.hooks.beforePlay) {
        continue;
      }

      const output = await entry.hooks.beforePlay(current);
      const normalized = this.normalizeHookResult(output, current);
      if (!normalized.ok) {
        return normalized;
      }
      current = normalized.value;
    }
    return ok(current);
  }

  /**
   * Runs after-play plugin hooks.
   */
  public async runAfterPlay(payload: BeforePlayPayload): Promise<Result<void>> {
    for (const entry of this.hooks) {
      if (!entry.hooks.afterPlay) {
        continue;
      }
      const output = await entry.hooks.afterPlay(payload);
      if (this.isResult(output) && !output.ok) {
        return output;
      }
    }
    return ok(undefined);
  }

  private async wrapPlayerState(
    contextId: string,
    operation: (player: YukitaPlayer) => Promise<Result<void>>
  ): Promise<Result<PlayerSnapshot>> {
    const playerResult = this.getPlayer(contextId);
    if (!playerResult.ok) {
      return playerResult;
    }
    const player = playerResult.value;

    const result = await operation(player);
    if (!result.ok) {
      return result;
    }
    return ok(player.snapshot());
  }

  private async ensurePlayer(
    contextId: string,
    input: {
      guildId: string;
      shardId: number;
    }
  ): Promise<Result<YukitaPlayer>> {
    const existing = this.players.get(contextId);
    if (existing) {
      return ok(existing);
    }
    return this.createPlayer(contextId, {
      guildId: input.guildId,
      shardId: input.shardId
    });
  }

  private toResolveOptions(input: PlayInput): ResolveOptions {
    const options: ResolveOptions = {};
    if (typeof input.preferredNodeId !== 'undefined') {
      options.preferredNodeId = input.preferredNodeId;
    }
    if (typeof input.sourceHints !== 'undefined') {
      options.sourceHints = input.sourceHints;
    }
    if (typeof input.metadata !== 'undefined') {
      options.metadata = input.metadata;
    }
    return options;
  }

  private buildIdentifier(query: string, sourceHints?: string[]): string {
    const normalized = query.trim();
    if (!normalized.length) {
      return normalized;
    }

    if (/^[a-z0-9]+search:/i.test(normalized) || /^[a-z][a-z0-9+.-]*:\/\//i.test(normalized)) {
      return normalized;
    }

    const hint = sourceHints?.[0]?.toLowerCase();
    switch (hint) {
      case 'youtube':
      case 'yt':
        return `ytsearch:${normalized}`;
      case 'youtube-music':
      case 'ytmusic':
      case 'ytm':
        return `ytmsearch:${normalized}`;
      case 'soundcloud':
      case 'sc':
        return `scsearch:${normalized}`;
      default:
        return `ytsearch:${normalized}`;
    }
  }

  private bindNodePoolEvents(): void {
    this.nodePool.events.on('node.connected', async ({ nodeId, resumed }) => {
      this.clearFailoverTimer(nodeId);
      await this.events.emit('node.connected', { nodeId, resumed });
      await this.dispatchPluginEvent('node.connected', { nodeId, resumed });
      if (!resumed) {
        await this.resyncPlayersOnNode(nodeId);
      }
    });

    this.nodePool.events.on('node.disconnected', async ({ nodeId, code, reason }) => {
      await this.events.emit('node.disconnected', { nodeId, code, reason });
      await this.dispatchPluginEvent('node.disconnected', { nodeId, code, reason });
      this.scheduleFailover(nodeId);
    });

    this.nodePool.events.on('node.error', async ({ nodeId, error }) => {
      await this.events.emit('node.error', { nodeId, error });
      await this.dispatchPluginEvent('node.error', { nodeId, error });
    });

    this.nodePool.events.on('node.stats', async ({ nodeId, stats }) => {
      await this.events.emit('node.stats', { nodeId, stats });
      await this.dispatchPluginEvent('node.stats', { nodeId, stats });
    });

    this.nodePool.events.on('node.playerUpdate', async ({ payload }) => {
      const contextId = this.guildToContext.get(payload.guildId);
      if (!contextId) {
        return;
      }
      const player = this.players.get(contextId);
      if (!player) {
        return;
      }
      const result = await player.onPlayerUpdate(payload);
      if (!result.ok) {
        await this.events.emit('node.error', {
          nodeId: player.currentNodeId,
          error: result.error
        });
      }
    });

    this.nodePool.events.on('node.playerEvent', async ({ payload }) => {
      const contextId = this.guildToContext.get(payload.guildId);
      if (!contextId) {
        return;
      }
      const player = this.players.get(contextId);
      if (!player) {
        return;
      }
      const result = await player.onPlayerEvent(payload);
      if (!result.ok) {
        await this.events.emit('node.error', {
          nodeId: player.currentNodeId,
          error: result.error
        });
      }
    });
  }

  private async handleNodeFailover(disconnectedNodeId: string): Promise<void> {
    const impactedPlayers = [...this.players.values()].filter((player) => player.currentNodeId === disconnectedNodeId);
    if (!impactedPlayers.length) {
      return;
    }

    for (const player of impactedPlayers) {
      const selection = this.nodePool.select({
        excludeNodeIds: [disconnectedNodeId]
      } satisfies NodeSelectionRequest);
      if (!selection.ok) {
        await this.emitOrdered(player.contextId, 'player.state', {
          contextId: player.contextId,
          snapshot: player.snapshot(),
          reason: 'failover-unavailable'
        });
        continue;
      }
      const migrate = await player.migrateToNode(selection.value.id);
      if (!migrate.ok) {
        await this.events.emit('node.error', {
          nodeId: disconnectedNodeId,
          error: migrate.error
        });
      }
    }
  }

  private clearFailoverTimer(nodeId: string): void {
    const existing = this.failoverTimers.get(nodeId);
    if (existing) {
      clearTimeout(existing);
      this.failoverTimers.delete(nodeId);
    }
  }

  private scheduleFailover(nodeId: string): void {
    this.clearFailoverTimer(nodeId);

    const node = this.nodePool.getNode(nodeId);
    const resumeEnabled = node?.config.resumeSession ?? true;
    if (!resumeEnabled) {
      void this.handleNodeFailover(nodeId);
      return;
    }

    const delayMs = Math.min(node?.config.resumeTimeoutMs ?? 7_500, 15_000);
    const timer = setTimeout(() => {
      this.failoverTimers.delete(nodeId);
      const current = this.nodePool.getNode(nodeId);
      if (!current || current.state !== 'connected') {
        void this.handleNodeFailover(nodeId);
      }
    }, delayMs);

    this.failoverTimers.set(nodeId, timer);
  }

  private async resyncPlayersOnNode(nodeId: string): Promise<void> {
    const players = [...this.players.values()].filter((player) => player.currentNodeId === nodeId);
    if (!players.length) {
      return;
    }

    for (const player of players) {
      const resync = await player.resync();
      if (!resync.ok) {
        await this.events.emit('node.error', {
          nodeId,
          error: resync.error
        });
      }
    }
  }

  private async runBeforeResolve(payload: BeforeResolvePayload): Promise<Result<BeforeResolvePayload>> {
    let current = payload;
    for (const entry of this.hooks) {
      if (!entry.hooks.beforeResolve) {
        continue;
      }
      const output = await entry.hooks.beforeResolve(current);
      const normalized = this.normalizeHookResult(output, current);
      if (!normalized.ok) {
        return normalized;
      }
      current = normalized.value;
    }
    return ok(current);
  }

  private async runAfterResolve(
    request: BeforeResolvePayload,
    result: YukitaResolveModel
  ): Promise<Result<YukitaResolveModel>> {
    let current = result;
    for (const entry of this.hooks) {
      if (!entry.hooks.afterResolve) {
        continue;
      }
      const output = await entry.hooks.afterResolve(request, current);
      const normalized = this.normalizeHookResult(output, current);
      if (!normalized.ok) {
        return normalized;
      }
      current = normalized.value;
    }
    return ok(current);
  }

  private async dispatchPluginEvent<TKey extends keyof YukitaSanEvents>(
    event: TKey,
    payload: YukitaSanEvents[TKey]
  ): Promise<void> {
    for (const entry of this.hooks) {
      const hooks = entry.hooks;
      if (String(event).startsWith('node.') && hooks.onNodeEvent) {
        await hooks.onNodeEvent({
          type: String(event).split('.')[1] as 'connected' | 'disconnected' | 'error' | 'stats',
          nodeId: (payload as { nodeId: string }).nodeId,
          payload
        });
      }

      if (String(event).startsWith('player.') && hooks.onPlayerEvent) {
        await hooks.onPlayerEvent({
          type: String(event).split('.')[1] as 'created' | 'destroyed' | 'state',
          contextId: (payload as { contextId: string }).contextId,
          payload
        });
      }

      if (String(event).startsWith('track.') && hooks.onTrackEvent) {
        await hooks.onTrackEvent({
          type: String(event).split('.')[1] as 'started' | 'ended' | 'stuck' | 'exception',
          contextId: (payload as { contextId: string }).contextId,
          payload
        });
      }

      if (event === 'queue.updated' && hooks.onQueueEvent) {
        await hooks.onQueueEvent({
          type: 'updated',
          contextId: (payload as { contextId: string }).contextId,
          payload
        });
      }
    }
  }

  private extendApi<TApi extends object>(namespace: string, api: TApi): Result<void> {
    if (!namespace.trim()) {
      return err(
        new YukitaError({
          code: YukitaErrorCode.INVALID_ARGUMENT,
          message: 'Extension namespace cannot be empty'
        })
      );
    }
    if (this.extensions.has(namespace)) {
      return err(
        new YukitaError({
          code: YukitaErrorCode.INVALID_ARGUMENT,
          message: `Extension namespace "${namespace}" already exists`,
          meta: { namespace }
        })
      );
    }
    this.extensions.set(namespace, Object.freeze({ ...api }));
    return ok(undefined);
  }

  private normalizeHookResult<TValue>(
    value: TValue | Result<TValue> | void,
    fallback: TValue
  ): Result<TValue> {
    if (typeof value === 'undefined') {
      return ok(fallback);
    }
    if (this.isResult<TValue>(value)) {
      return value;
    }
    return ok(value);
  }

  private isResult<TValue>(
    value: TValue | Result<TValue> | void
  ): value is Result<TValue> {
    if (!value || typeof value !== 'object') {
      return false;
    }
    return Object.prototype.hasOwnProperty.call(value, 'ok');
  }

  private updateNodeRestHooks(): void {
    const hooks = this.buildRestHooks();
    for (const node of this.nodePool.listNodes()) {
      node.rest.setHooks(hooks);
    }
  }

  private buildRestHooks(): LavalinkRestClientHooks {
    return {
      onRequest: async (ctx: RestRequestContext) => {
        for (const entry of this.hooks) {
          if (!entry.hooks.onRestRequest) {
            continue;
          }
          await entry.hooks.onRestRequest(ctx);
        }
      },
      onResponse: async <T>(ctx: RestResponseContext<T>, res: LavalinkResponse<T>) => {
        for (const entry of this.hooks) {
          if (!entry.hooks.onRestResponse) {
            continue;
          }
          await entry.hooks.onRestResponse(ctx, res);
        }
      },
      onError: async (ctx: RestRequestContext, error: LavalinkResponseError) => {
        for (const entry of this.hooks) {
          if (!entry.hooks.onRestError) {
            continue;
          }
          await entry.hooks.onRestError(ctx, error);
        }
      }
    };
  }

  private buildLogger(custom?: Partial<PluginLogger>): PluginLogger {
    return {
      debug: custom?.debug ?? ((message, meta) => console.debug(`[yukita] ${message}`, meta ?? {})),
      info: custom?.info ?? ((message, meta) => console.info(`[yukita] ${message}`, meta ?? {})),
      warn: custom?.warn ?? ((message, meta) => console.warn(`[yukita] ${message}`, meta ?? {})),
      error: custom?.error ?? ((message, meta) => console.error(`[yukita] ${message}`, meta ?? {}))
    };
  }
}
