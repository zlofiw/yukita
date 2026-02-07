import type { Client } from 'discord.js';
import type { LavalinkNode } from '../lavalink/LavalinkNode';
import type { YukitaSan } from '../YukitaSan';
import type { Connector } from './Connector';

type RawGatewayPacket = {
  t?: string | null;
  d?: any;
  shardId?: number;
};

/**
 * Discord.js connector (Shoukaku-style) for voice updates and OP 4 dispatch.
 */
export class DiscordJSConnector implements Connector {
  private readonly client: Client;
  private manager: YukitaSan | null = null;
  private listening = false;

  public constructor(client: Client) {
    this.client = client;
  }

  public set(manager: YukitaSan): void {
    this.manager = manager;
  }

  public getId(): string {
    const id = this.client.user?.id;
    if (!id) {
      throw new Error('DiscordJSConnector.getId() called before client is ready');
    }
    return id;
  }

  public listen(_nodes: readonly LavalinkNode[]): void {
    if (this.listening) {
      return;
    }
    this.listening = true;
    this.client.on('raw', (packet: RawGatewayPacket) => {
      void this.onRaw(packet);
    });
  }

  public async sendPacket(guildId: string, payload: unknown): Promise<void> {
    const guild = this.client.guilds.cache.get(guildId);
    const shardId = guild?.shardId ?? 0;

    const shard = this.client.ws.shards.get(shardId);
    if (!shard) {
      throw new Error(`Discord shard ${String(shardId)} not found for guild ${guildId}`);
    }

    shard.send(payload as any);
  }

  private async onRaw(packet: RawGatewayPacket): Promise<void> {
    const manager = this.manager;
    if (!manager) {
      return;
    }

    const type = packet.t;
    const data = packet.d;
    if (!type || !data) {
      return;
    }

    if (type === 'VOICE_STATE_UPDATE') {
      const userId = data.user_id as string | undefined;
      if (!userId || userId !== this.getId()) {
        return;
      }

      const guildId = data.guild_id as string | undefined;
      const sessionId = data.session_id as string | undefined;
      if (!guildId || !sessionId) {
        return;
      }

      const shardId = typeof packet.shardId === 'number' ? packet.shardId : 0;
      await manager.applyVoiceStateUpdate({
        contextId: guildId,
        guildId,
        channelId: (data.channel_id as string | null) ?? null,
        sessionId,
        shardId,
        selfMute: Boolean(data.self_mute),
        selfDeaf: Boolean(data.self_deaf)
      });
    }

    if (type === 'VOICE_SERVER_UPDATE') {
      const guildId = data.guild_id as string | undefined;
      const token = data.token as string | undefined;
      const endpoint = data.endpoint as string | undefined;
      if (!guildId || !token || !endpoint) {
        return;
      }

      await manager.applyVoiceServerUpdate({
        contextId: guildId,
        guildId,
        token,
        endpoint
      });
    }
  }
}

