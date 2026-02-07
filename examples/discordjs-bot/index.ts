import { Client, GatewayIntentBits } from 'discord.js';
import { DiscordJSConnector, YukitaSan, createMetricsPlugin, createResolveCachePlugin } from '../../src';

const token = process.env.DISCORD_TOKEN;
if (!token) {
  throw new Error('Missing DISCORD_TOKEN');
}

const discord = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const yukita = new YukitaSan({
  connector: new DiscordJSConnector(discord),
  nodes: [
    {
      id: 'main',
      host: process.env.LAVALINK_HOST ?? '127.0.0.1',
      port: Number(process.env.LAVALINK_PORT ?? 2333),
      password: process.env.LAVALINK_PASSWORD ?? 'youshallnotpass',
      userId: process.env.LAVALINK_USER_ID ?? '123456789012345678'
    }
  ]
});

await yukita.use(createMetricsPlugin());
await yukita.use(createResolveCachePlugin());

discord.on('ready', async () => {
  const started = await yukita.start();
  if (!started.ok) {
    console.error('Failed to start YukitaSan', started.error);
    process.exit(1);
  }
  console.log(`Logged in as ${discord.user?.tag}`);
});

discord.on('messageCreate', async (message) => {
  if (!message.guildId || message.author.bot) return;
  if (!message.content.startsWith('!')) return;

  const [cmd, ...rest] = message.content.slice(1).trim().split(/\s+/g);
  const query = rest.join(' ');
  const contextId = message.guildId;
  const guildId = message.guildId;
  const shardId = message.guild?.shardId ?? 0;

  if (!cmd) return;

  if (cmd === 'join') {
    const channelId = message.member?.voice?.channelId;
    if (!channelId) {
      await message.reply('Join a voice channel first.');
      return;
    }

    const created = await yukita.createPlayer(contextId, { guildId, shardId, initialChannelId: channelId });
    if (!created.ok) {
      await message.reply(`createPlayer failed: ${created.error.code}`);
      return;
    }

    const joined = await created.value.connect(channelId);
    if (!joined.ok) {
      await message.reply(`connect failed: ${joined.error.code}`);
      return;
    }

    await message.reply('Requested voice join.');
    return;
  }

  if (cmd === 'leave') {
    const playerResult = yukita.getPlayer(contextId);
    if (!playerResult.ok) {
      await message.reply('No player.');
      return;
    }
    await playerResult.value.disconnect();
    await yukita.destroyPlayer(contextId);
    await message.reply('Requested voice leave.');
    return;
  }

  if (cmd === 'play') {
    if (!query) {
      await message.reply('Usage: !play <query/url>');
      return;
    }
    const played = await yukita.play(contextId, { query });
    await message.reply(played.ok ? 'Play requested.' : `play failed: ${played.error.code}`);
    return;
  }

  if (cmd === 'pause') {
    const res = await yukita.pause(contextId);
    await message.reply(res.ok ? 'Paused.' : `pause failed: ${res.error.code}`);
    return;
  }

  if (cmd === 'resume') {
    const res = await yukita.resume(contextId);
    await message.reply(res.ok ? 'Resumed.' : `resume failed: ${res.error.code}`);
    return;
  }

  if (cmd === 'stop') {
    const res = await yukita.stop(contextId);
    await message.reply(res.ok ? 'Stopped.' : `stop failed: ${res.error.code}`);
    return;
  }

  if (cmd === 'queue') {
    const player = yukita.getPlayer(contextId);
    if (!player.ok) {
      await message.reply('No player.');
      return;
    }
    const snapshot = player.value.snapshot();
    await message.reply(`Queue size: ${snapshot.queue.length}`);
    return;
  }
});

await discord.login(token);

