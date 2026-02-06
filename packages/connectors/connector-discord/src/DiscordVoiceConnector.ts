import type { YukitaClient } from '@yukita/core';
import { YukitaError, YukitaErrorCode, err, ok, type Result } from '@yukita/plugin-kit';
import type {
  DiscordConnectorOptions,
  DiscordGatewaySender,
  DiscordVoiceServerUpdate,
  DiscordVoiceStateCommand,
  DiscordVoiceStateUpdate
} from './types';

/**
 * Stateless mapper for Discord dispatch to core voice update shape.
 */
export class DiscordVoiceMapper {
  /**
   * Maps voice state event to core payload.
   */
  public static mapState(input: {
    contextId: string;
    shardId: number;
    payload: DiscordVoiceStateUpdate;
  }) {
    return {
      contextId: input.contextId,
      guildId: input.payload.guild_id,
      channelId: input.payload.channel_id,
      sessionId: input.payload.session_id,
      shardId: input.shardId,
      selfMute: input.payload.self_mute ?? false,
      selfDeaf: input.payload.self_deaf ?? false
    };
  }

  /**
   * Maps voice server event to core payload.
   */
  public static mapServer(input: { contextId: string; payload: DiscordVoiceServerUpdate }) {
    return {
      contextId: input.contextId,
      guildId: input.payload.guild_id,
      token: input.payload.token,
      endpoint: input.payload.endpoint
    };
  }
}

/**
 * Discord connector that feeds voice events into `@yukita/core`.
 */
export class DiscordVoiceConnector {
  private readonly client: YukitaClient;
  private readonly sender: DiscordGatewaySender;
  private readonly options: DiscordConnectorOptions;

  public constructor(client: YukitaClient, sender: DiscordGatewaySender, options: DiscordConnectorOptions) {
    this.client = client;
    this.sender = sender;
    this.options = options;
  }

  /**
   * Handles Discord VOICE_STATE_UPDATE.
   */
  public async handleVoiceStateUpdate(input: {
    contextId: string;
    shardId: number;
    payload: DiscordVoiceStateUpdate;
  }): Promise<Result<void>> {
    if (input.payload.user_id !== this.options.botUserId) {
      return ok(undefined);
    }
    return this.client.applyVoiceStateUpdate(DiscordVoiceMapper.mapState(input));
  }

  /**
   * Handles Discord VOICE_SERVER_UPDATE.
   */
  public async handleVoiceServerUpdate(input: {
    contextId: string;
    payload: DiscordVoiceServerUpdate;
  }): Promise<Result<void>> {
    return this.client.applyVoiceServerUpdate(DiscordVoiceMapper.mapServer(input));
  }

  /**
   * Sends join command to Discord gateway.
   */
  public async joinVoice(input: {
    shardId: number;
    guildId: string;
    channelId: string;
    selfMute?: boolean;
    selfDeaf?: boolean;
  }): Promise<Result<void>> {
    return this.sendVoiceState({
      shardId: input.shardId,
      guildId: input.guildId,
      channelId: input.channelId,
      selfMute: input.selfMute ?? false,
      selfDeaf: input.selfDeaf ?? true
    });
  }

  /**
   * Sends move command to Discord gateway.
   */
  public async moveVoice(input: {
    shardId: number;
    guildId: string;
    channelId: string;
    selfMute?: boolean;
    selfDeaf?: boolean;
  }): Promise<Result<void>> {
    return this.sendVoiceState({
      shardId: input.shardId,
      guildId: input.guildId,
      channelId: input.channelId,
      selfMute: input.selfMute ?? false,
      selfDeaf: input.selfDeaf ?? true
    });
  }

  /**
   * Sends leave command to Discord gateway.
   */
  public async leaveVoice(input: {
    shardId: number;
    guildId: string;
    selfMute?: boolean;
    selfDeaf?: boolean;
  }): Promise<Result<void>> {
    return this.sendVoiceState({
      shardId: input.shardId,
      guildId: input.guildId,
      channelId: null,
      selfMute: input.selfMute ?? false,
      selfDeaf: input.selfDeaf ?? false
    });
  }

  private async sendVoiceState(input: {
    shardId: number;
    guildId: string;
    channelId: string | null;
    selfMute: boolean;
    selfDeaf: boolean;
  }): Promise<Result<void>> {
    const payload: DiscordVoiceStateCommand = {
      op: 4,
      d: {
        guild_id: input.guildId,
        channel_id: input.channelId,
        self_mute: input.selfMute,
        self_deaf: input.selfDeaf
      }
    };

    try {
      await this.sender.sendGatewayPayload(input.shardId, payload);
      return ok(undefined);
    } catch (error) {
      return err(
        new YukitaError({
          code: YukitaErrorCode.INTERNAL_ERROR,
          message: 'Failed to send Discord voice state payload',
          cause: error
        })
      );
    }
  }
}
