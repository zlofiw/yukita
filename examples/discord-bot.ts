import {
  ChannelType,
  Client,
  GatewayIntentBits,
  type BaseGuildVoiceChannel,
  type Guild,
  type Message
} from 'discord.js';
import { YukitaClient, type NodeSelectionStrategy, type RepeatMode } from '../packages/core/src';
import {
  DiscordVoiceConnector,
  type DiscordVoiceServerUpdate,
  type DiscordVoiceStateUpdate
} from '../packages/connectors/connector-discord/src';
import { MetricsPlugin } from '../packages/plugins/metrics/src';
import { ResolveCachePlugin } from '../packages/plugins/resolve-cache/src';
import type { YukitaError } from '../packages/plugin-kit/src';

type MetricsApi = {
  getSnapshot: () => {
    resolves: number;
    resolveFailures: number;
    plays: number;
    nodeEvents: number;
    playerEvents: number;
    trackEvents: number;
    queueEvents: number;
  };
  reset: () => void;
};

type ResolveCacheApi = {
  clear: () => void;
  invalidate: (query: string, sourceHints?: string[]) => void;
  stats: () => {
    size: number;
    hits: number;
    misses: number;
  };
};

const PREFIX = process.env.DISCORD_PREFIX ?? '!yukita';
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const LAVALINK_HOST = process.env.LAVALINK_HOST ?? '127.0.0.1';
const LAVALINK_PORT = Number(process.env.LAVALINK_PORT ?? '2333');
const LAVALINK_PASSWORD = process.env.LAVALINK_PASSWORD ?? 'youshallnotpass';
const LAVALINK_SECURE = process.env.LAVALINK_SECURE === '1';
const LAVALINK_NODE_ID = process.env.LAVALINK_NODE_ID ?? 'main';

if (!DISCORD_TOKEN) {
  console.error('DISCORD_TOKEN is required');
  process.exit(1);
}

const discord = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const yukita = new YukitaClient({
  nodes: [
    {
      id: LAVALINK_NODE_ID,
      host: LAVALINK_HOST,
      port: LAVALINK_PORT,
      secure: LAVALINK_SECURE,
      password: LAVALINK_PASSWORD,
      userId: 'pending-bot-user-id',
      clientName: 'YukiTa/1.0'
    }
  ],
  selectionStrategy: 'penalty'
});

const activeTextChannels = new Map<string, string>();
let connector: DiscordVoiceConnector | null = null;

function contextIdFromGuild(guildId: string): string {
  return `guild:${guildId}`;
}

function tokenize(input: string): string[] {
  const tokens: string[] = [];
  const matcher = /"([^"]+)"|'([^']+)'|(\S+)/g;
  let match: RegExpExecArray | null;
  while ((match = matcher.exec(input)) !== null) {
    tokens.push(match[1] ?? match[2] ?? match[3] ?? '');
  }
  return tokens.filter((token) => token.length > 0);
}

function formatError(error: YukitaError): string {
  const meta = typeof error.meta === 'undefined' ? '' : ` meta=${JSON.stringify(error.meta)}`;
  return `[${error.code}] ${error.message}${meta}`;
}

function parseVoiceChannelId(token: string): string {
  return token.replace('<#', '').replace('>', '');
}

function getVoiceChannelById(guild: Guild, token: string): BaseGuildVoiceChannel | null {
  const channelId = parseVoiceChannelId(token);
  const channel = guild.channels.cache.get(channelId);
  if (!channel || !channel.isVoiceBased()) {
    return null;
  }
  if (channel.type !== ChannelType.GuildVoice && channel.type !== ChannelType.GuildStageVoice) {
    return null;
  }
  return channel;
}

async function getInvokerVoiceChannel(message: Message): Promise<BaseGuildVoiceChannel | null> {
  const member = message.member ?? await message.guild?.members.fetch(message.author.id);
  const channel = member?.voice.channel;
  if (!channel || !channel.isVoiceBased()) {
    return null;
  }
  if (channel.type !== ChannelType.GuildVoice && channel.type !== ChannelType.GuildStageVoice) {
    return null;
  }
  return channel;
}

function getGuildShardId(guildId: string): number {
  const guild = discord.guilds.cache.get(guildId);
  return guild?.shardId ?? 0;
}

async function ensurePlayer(guildId: string, shardId: number, initialChannelId?: string): Promise<boolean> {
  const payload: {
    guildId: string;
    shardId: number;
    initialChannelId?: string;
  } = { guildId, shardId };
  if (typeof initialChannelId !== 'undefined') {
    payload.initialChannelId = initialChannelId;
  }
  const created = await yukita.createPlayer(contextIdFromGuild(guildId), payload);
  if (!created.ok) {
    console.error('createPlayer failed', formatError(created.error));
    return false;
  }
  return true;
}

async function ensureVoiceSession(message: Message): Promise<{ guildId: string; contextId: string } | null> {
  const guild = message.guild;
  if (!guild || !connector) {
    return null;
  }

  const voiceChannel = await getInvokerVoiceChannel(message);
  if (!voiceChannel) {
    await message.reply('Join a voice channel first.');
    return null;
  }

  const playerReady = await ensurePlayer(guild.id, guild.shardId, voiceChannel.id);
  if (!playerReady) {
    await message.reply('Failed to initialize player.');
    return null;
  }

  const joined = await connector.joinVoice({
    shardId: guild.shardId,
    guildId: guild.id,
    channelId: voiceChannel.id
  });
  if (!joined.ok) {
    await message.reply(`Join voice failed: ${formatError(joined.error)}`);
    return null;
  }

  return {
    guildId: guild.id,
    contextId: contextIdFromGuild(guild.id)
  };
}

async function sendCommandHelp(message: Message): Promise<void> {
  await message.reply([
    `Prefix: \`${PREFIX}\``,
    'Core: help, join [channel], move <channel>, leave, destroy, state',
    'Playback: play <query>, pause, resume, stop, seek <ms>, volume <0..1000>, resolve <query>',
    'Queue: queue add <query>, queue remove <index>, queue move <from> <to>, queue clear, queue shuffle, queue show',
    'Repeat/Filters: repeat <none|track|queue>, filters bassboost [gain], filters nightcore, filters clear',
    'Plugins: metrics, metrics reset, cache stats, cache clear',
    'Nodes: node list, node strategy <penalty|least-load|latency|round-robin>, node add <id> <host> <port> <password> [secure], node remove <id>'
  ].join('\n'));
}

async function handleCommand(message: Message): Promise<void> {
  if (!message.guild || message.author.bot) {
    return;
  }
  if (!message.content.startsWith(PREFIX)) {
    return;
  }

  activeTextChannels.set(message.guild.id, message.channel.id);

  const commandLine = message.content.slice(PREFIX.length).trim();
  if (!commandLine) {
    await sendCommandHelp(message);
    return;
  }

  const tokens = tokenize(commandLine);
  const root = tokens[0]?.toLowerCase();
  const args = tokens.slice(1);
  const guildId = message.guild.id;
  const contextId = contextIdFromGuild(guildId);

  if (!root) {
    await sendCommandHelp(message);
    return;
  }

  switch (root) {
    case 'help': {
      await sendCommandHelp(message);
      return;
    }
    case 'join':
    case 'move': {
      if (!connector) {
        await message.reply('Connector is not initialized yet.');
        return;
      }
      const channel = args[0] ? getVoiceChannelById(message.guild, args[0]) : await getInvokerVoiceChannel(message);
      if (!channel) {
        await message.reply('Voice channel not found. Pass channel mention/id or join one first.');
        return;
      }

      const ok = await ensurePlayer(guildId, message.guild.shardId, channel.id);
      if (!ok) {
        await message.reply('Failed to initialize player.');
        return;
      }

      const moved = await connector.moveVoice({
        shardId: message.guild.shardId,
        guildId,
        channelId: channel.id
      });
      await message.reply(
        moved.ok
          ? `Connected to <#${channel.id}>`
          : `Voice update failed: ${formatError(moved.error)}`
      );
      return;
    }
    case 'leave': {
      if (!connector) {
        await message.reply('Connector is not initialized yet.');
        return;
      }
      const left = await connector.leaveVoice({
        shardId: message.guild.shardId,
        guildId
      });
      await message.reply(left.ok ? 'Left voice channel.' : `Leave failed: ${formatError(left.error)}`);
      return;
    }
    case 'destroy': {
      const destroyed = await yukita.destroyPlayer(contextId);
      await message.reply(destroyed.ok ? 'Player destroyed.' : `Destroy failed: ${formatError(destroyed.error)}`);
      return;
    }
    case 'play': {
      if (!args.length) {
        await message.reply('Usage: play <query>');
        return;
      }
      const voice = await ensureVoiceSession(message);
      if (!voice) {
        return;
      }
      const query = args.join(' ');
      const played = await yukita.play(voice.contextId, {
        query,
        sourceHints: ['youtube'],
        metadata: { requestedBy: message.author.id }
      });
      if (!played.ok) {
        await message.reply(`Play failed: ${formatError(played.error)}`);
        return;
      }
      const current = played.value.current?.title ?? 'unknown';
      await message.reply(`Playing: **${current}**`);
      return;
    }
    case 'pause': {
      const result = await yukita.pause(contextId);
      await message.reply(result.ok ? 'Paused.' : `Pause failed: ${formatError(result.error)}`);
      return;
    }
    case 'resume': {
      const result = await yukita.resume(contextId);
      await message.reply(result.ok ? 'Resumed.' : `Resume failed: ${formatError(result.error)}`);
      return;
    }
    case 'stop': {
      const result = await yukita.stop(contextId);
      await message.reply(result.ok ? 'Stopped.' : `Stop failed: ${formatError(result.error)}`);
      return;
    }
    case 'seek': {
      const position = Number(args[0]);
      if (!Number.isFinite(position) || position < 0) {
        await message.reply('Usage: seek <positionMs>');
        return;
      }
      const result = await yukita.seek(contextId, position);
      await message.reply(result.ok ? `Seeked to ${position}ms.` : `Seek failed: ${formatError(result.error)}`);
      return;
    }
    case 'volume': {
      const volume = Number(args[0]);
      if (!Number.isFinite(volume) || volume < 0) {
        await message.reply('Usage: volume <0..1000>');
        return;
      }
      const result = await yukita.setVolume(contextId, volume);
      await message.reply(result.ok ? `Volume: ${volume}` : `Volume failed: ${formatError(result.error)}`);
      return;
    }
    case 'resolve': {
      if (!args.length) {
        await message.reply('Usage: resolve <query>');
        return;
      }
      const result = await yukita.resolve(contextId, args.join(' '), {
        sourceHints: ['youtube']
      });
      if (!result.ok) {
        await message.reply(`Resolve failed: ${formatError(result.error)}`);
        return;
      }
      const payload = result.value.result;
      if (payload.kind === 'tracks') {
        const titles = payload.tracks.slice(0, 5).map((track, index) => `${index + 1}. ${track.title}`).join('\n');
        await message.reply(`Tracks (${payload.tracks.length}):\n${titles || 'empty'}`);
        return;
      }
      if (payload.kind === 'playlist') {
        await message.reply(`Playlist: **${payload.playlist.name}** (${payload.playlist.tracks.length} tracks)`);
        return;
      }
      if (payload.kind === 'noMatches') {
        await message.reply('No matches.');
        return;
      }
      await message.reply(`Load failed: ${payload.message}`);
      return;
    }
    case 'queue': {
      const action = args[0]?.toLowerCase();
      if (!action) {
        await message.reply('Usage: queue <add|remove|move|clear|shuffle|show> ...');
        return;
      }
      if (action === 'add') {
        const query = args.slice(1).join(' ');
        if (!query) {
          await message.reply('Usage: queue add <query>');
          return;
        }
        const voice = await ensureVoiceSession(message);
        if (!voice) {
          return;
        }
        const result = await yukita.queueAdd(voice.contextId, {
          query,
          sourceHints: ['youtube'],
          metadata: { requestedBy: message.author.id }
        });
        await message.reply(
          result.ok
            ? `Queued. Size: ${result.value.queue.length}`
            : `Queue add failed: ${formatError(result.error)}`
        );
        return;
      }
      if (action === 'remove') {
        const index = Number(args[1]);
        if (!Number.isInteger(index) || index <= 0) {
          await message.reply('Usage: queue remove <1-based index>');
          return;
        }
        const result = await yukita.queueRemove(contextId, index - 1);
        await message.reply(
          result.ok
            ? `Removed queue item #${index}`
            : `Queue remove failed: ${formatError(result.error)}`
        );
        return;
      }
      if (action === 'move') {
        const fromIndex = Number(args[1]);
        const toIndex = Number(args[2]);
        if (!Number.isInteger(fromIndex) || !Number.isInteger(toIndex) || fromIndex <= 0 || toIndex <= 0) {
          await message.reply('Usage: queue move <from> <to> (1-based)');
          return;
        }
        const result = await yukita.queueMove(contextId, fromIndex - 1, toIndex - 1);
        await message.reply(result.ok ? 'Queue moved.' : `Queue move failed: ${formatError(result.error)}`);
        return;
      }
      if (action === 'clear') {
        const result = await yukita.queueClear(contextId);
        await message.reply(result.ok ? 'Queue cleared.' : `Queue clear failed: ${formatError(result.error)}`);
        return;
      }
      if (action === 'shuffle') {
        const result = await yukita.queueShuffle(contextId);
        await message.reply(result.ok ? 'Queue shuffled.' : `Queue shuffle failed: ${formatError(result.error)}`);
        return;
      }
      if (action === 'show') {
        const player = yukita.getPlayer(contextId);
        if (!player.ok) {
          await message.reply(`Queue show failed: ${formatError(player.error)}`);
          return;
        }
        const snapshot = player.value.snapshot();
        const head = snapshot.current ? `Now: **${snapshot.current.title}**` : 'Now: nothing';
        const queue = snapshot.queue
          .slice(0, 10)
          .map((track, index) => `${index + 1}. ${track.title}`)
          .join('\n');
        await message.reply(`${head}\nQueue(${snapshot.queue.length}):\n${queue || 'empty'}`);
        return;
      }
      await message.reply('Unknown queue action.');
      return;
    }
    case 'repeat': {
      const mode = args[0] as RepeatMode | undefined;
      if (!mode || !['none', 'track', 'queue'].includes(mode)) {
        await message.reply('Usage: repeat <none|track|queue>');
        return;
      }
      const player = yukita.getPlayer(contextId);
      if (!player.ok) {
        await message.reply(`Repeat failed: ${formatError(player.error)}`);
        return;
      }
      const result = await player.value.setRepeatMode(mode);
      await message.reply(result.ok ? `Repeat mode: ${mode}` : `Repeat failed: ${formatError(result.error)}`);
      return;
    }
    case 'filters': {
      const action = args[0]?.toLowerCase();
      if (!action) {
        await message.reply('Usage: filters <bassboost|nightcore|clear>');
        return;
      }
      if (action === 'clear') {
        const result = await yukita.clearFilters(contextId);
        await message.reply(result.ok ? 'Filters cleared.' : `Filters clear failed: ${formatError(result.error)}`);
        return;
      }
      if (action === 'bassboost') {
        const gain = Number(args[1] ?? '0.15');
        if (!Number.isFinite(gain)) {
          await message.reply('Usage: filters bassboost [gain]');
          return;
        }
        const result = await yukita.applyFilters(contextId, {
          equalizer: [
            { band: 0, gain },
            { band: 1, gain: gain * 0.75 },
            { band: 2, gain: gain * 0.5 }
          ]
        });
        await message.reply(result.ok ? `Bassboost applied (gain=${gain}).` : `Filters failed: ${formatError(result.error)}`);
        return;
      }
      if (action === 'nightcore') {
        const result = await yukita.applyFilters(contextId, {
          timescale: {
            speed: 1.25,
            pitch: 1.2,
            rate: 1.0
          }
        });
        await message.reply(result.ok ? 'Nightcore filter applied.' : `Filters failed: ${formatError(result.error)}`);
        return;
      }
      await message.reply('Unknown filters action.');
      return;
    }
    case 'state': {
      const player = yukita.getPlayer(contextId);
      if (!player.ok) {
        await message.reply(`State failed: ${formatError(player.error)}`);
        return;
      }
      const snapshot = player.value.snapshot();
      const response = [
        `Node: ${snapshot.nodeId}`,
        `Voice: ${snapshot.voice.connected ? `connected:${snapshot.voice.channelId ?? 'unknown'}` : 'disconnected'}`,
        `Current: ${snapshot.current?.title ?? 'none'}`,
        `Queue: ${snapshot.queue.length}`,
        `Paused: ${snapshot.paused}`,
        `Volume: ${snapshot.volume}`,
        `Position: ${snapshot.positionMs}ms`,
        `Repeat: ${snapshot.repeatMode}`
      ].join('\n');
      await message.reply(response);
      return;
    }
    case 'metrics': {
      const extension = yukita.getExtension<MetricsApi>('metrics');
      if (!extension.ok) {
        await message.reply(`Metrics unavailable: ${formatError(extension.error)}`);
        return;
      }
      if (args[0]?.toLowerCase() === 'reset') {
        extension.value.reset();
        await message.reply('Metrics reset.');
        return;
      }
      await message.reply(`Metrics: \`${JSON.stringify(extension.value.getSnapshot())}\``);
      return;
    }
    case 'cache': {
      const extension = yukita.getExtension<ResolveCacheApi>('resolveCache');
      if (!extension.ok) {
        await message.reply(`Cache extension unavailable: ${formatError(extension.error)}`);
        return;
      }
      const action = args[0]?.toLowerCase();
      if (action === 'clear') {
        extension.value.clear();
        await message.reply('Resolve cache cleared.');
        return;
      }
      await message.reply(`Resolve cache stats: \`${JSON.stringify(extension.value.stats())}\``);
      return;
    }
    case 'node': {
      const action = args[0]?.toLowerCase();
      if (!action) {
        await message.reply('Usage: node <list|strategy|add|remove> ...');
        return;
      }
      if (action === 'list') {
        const lines = yukita.nodePool.listNodes().map((node) => [
          node.id,
          `state=${node.state}`,
          `latency=${node.latencyMs ?? -1}`,
          `penalty=${node.penalty}`
        ].join(' '));
        await message.reply(lines.length ? lines.join('\n') : 'No nodes.');
        return;
      }
      if (action === 'strategy') {
        const strategy = args[1] as NodeSelectionStrategy | undefined;
        if (!strategy || !['penalty', 'least-load', 'latency', 'round-robin'].includes(strategy)) {
          await message.reply('Usage: node strategy <penalty|least-load|latency|round-robin>');
          return;
        }
        yukita.nodePool.setStrategy(strategy);
        await message.reply(`Node strategy set to ${strategy}`);
        return;
      }
      if (action === 'add') {
        if (!connector || !discord.user) {
          await message.reply('Connector is not initialized yet.');
          return;
        }
        const [id, host, portRaw, password, secureRaw] = args.slice(1);
        const port = Number(portRaw);
        if (!id || !host || !portRaw || !password || !Number.isInteger(port)) {
          await message.reply('Usage: node add <id> <host> <port> <password> [secure]');
          return;
        }
        const result = await yukita.nodePool.addNode({
          id,
          host,
          port,
          secure: secureRaw === '1' || secureRaw === 'true',
          password,
          userId: discord.user.id,
          clientName: 'YukiTa/1.0'
        });
        await message.reply(result.ok ? `Node ${id} added.` : `Node add failed: ${formatError(result.error)}`);
        return;
      }
      if (action === 'remove') {
        const id = args[1];
        if (!id) {
          await message.reply('Usage: node remove <id>');
          return;
        }
        const result = await yukita.nodePool.removeNode(id);
        await message.reply(result.ok ? `Node ${id} removed.` : `Node remove failed: ${formatError(result.error)}`);
        return;
      }
      await message.reply('Unknown node action.');
      return;
    }
    default:
      await message.reply('Unknown command. Use `help`.');
  }
}

async function sendToActiveGuildChannel(guildId: string, text: string): Promise<void> {
  const channelId = activeTextChannels.get(guildId);
  if (!channelId) {
    return;
  }
  const channel = await discord.channels.fetch(channelId);
  if (!channel || !channel.isTextBased()) {
    return;
  }
  if (!('send' in channel)) {
    return;
  }
  await channel.send(text);
}

async function main(): Promise<void> {
  const pluginMetrics = await yukita.use(new MetricsPlugin());
  if (!pluginMetrics.ok) {
    throw new Error(`Failed to install metrics plugin: ${formatError(pluginMetrics.error)}`);
  }

  const pluginCache = await yukita.use(new ResolveCachePlugin());
  if (!pluginCache.ok) {
    throw new Error(`Failed to install resolve-cache plugin: ${formatError(pluginCache.error)}`);
  }

  const started = await yukita.start();
  if (!started.ok) {
    throw new Error(`Failed to start Yukita client: ${formatError(started.error)}`);
  }

  yukita.on('track.started', async ({ contextId, track }) => {
    const guildId = contextId.replace(/^guild:/, '');
    await sendToActiveGuildChannel(guildId, `Started: **${track.title}**`);
  });

  yukita.on('track.ended', async ({ contextId, track, reason }) => {
    const guildId = contextId.replace(/^guild:/, '');
    await sendToActiveGuildChannel(guildId, `Ended: **${track.title}** (${reason})`);
  });

  yukita.on('node.connected', ({ nodeId, resumed }) => {
    console.log(`[node.connected] ${nodeId} resumed=${resumed}`);
  });

  yukita.on('node.disconnected', ({ nodeId, code, reason }) => {
    console.warn(`[node.disconnected] ${nodeId} code=${code} reason=${reason}`);
  });

  yukita.on('node.error', ({ nodeId, error }) => {
    console.error(`[node.error] ${nodeId}`, error);
  });

  discord.on('ready', () => {
    if (!discord.user) {
      return;
    }

    connector = new DiscordVoiceConnector(
      yukita,
      {
        sendGatewayPayload: (shardId, payload) => {
          const shard = discord.ws.shards.get(shardId);
          if (!shard) {
            throw new Error(`Discord shard ${shardId} not found`);
          }
          shard.send(payload as unknown as Record<string, unknown>);
        }
      },
      {
        botUserId: discord.user.id
      }
    );

    console.log(`Discord bot ready as ${discord.user.tag}`);
    console.log(`Prefix: ${PREFIX}`);
  });

  discord.on('raw', (packet) => {
    if (!connector || !packet.t || !packet.d) {
      return;
    }

    if (packet.t === 'VOICE_STATE_UPDATE') {
      const payload = packet.d as DiscordVoiceStateUpdate;
      if (!payload.guild_id) {
        return;
      }
      const shardId = getGuildShardId(payload.guild_id);
      void connector.handleVoiceStateUpdate({
        contextId: contextIdFromGuild(payload.guild_id),
        shardId,
        payload
      });
      return;
    }

    if (packet.t === 'VOICE_SERVER_UPDATE') {
      const payload = packet.d as DiscordVoiceServerUpdate;
      if (!payload.guild_id) {
        return;
      }
      void connector.handleVoiceServerUpdate({
        contextId: contextIdFromGuild(payload.guild_id),
        payload
      });
    }
  });

  discord.on('messageCreate', (message) => {
    void handleCommand(message).catch((error: unknown) => {
      console.error('Command handler failed', error);
      if (message.channel.isTextBased()) {
        void message.reply('Internal command error.');
      }
    });
  });

  const shutdown = async (): Promise<void> => {
    console.log('Shutting down...');
    try {
      await discord.destroy();
    } catch {
      // ignore
    }
    await yukita.shutdown();
    process.exit(0);
  };

  process.once('SIGINT', () => {
    void shutdown();
  });
  process.once('SIGTERM', () => {
    void shutdown();
  });

  await discord.login(DISCORD_TOKEN);
}

void main().catch((error: unknown) => {
  console.error('Failed to start discord example bot', error);
  process.exit(1);
});
