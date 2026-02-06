/**
 * Discord VOICE_STATE_UPDATE dispatch payload.
 */
export interface DiscordVoiceStateUpdate {
  guild_id: string;
  channel_id: string | null;
  user_id: string;
  session_id: string;
  self_mute?: boolean;
  self_deaf?: boolean;
}

/**
 * Discord VOICE_SERVER_UPDATE dispatch payload.
 */
export interface DiscordVoiceServerUpdate {
  token: string;
  guild_id: string;
  endpoint: string;
}

/**
 * Discord gateway OP 4 payload.
 */
export interface DiscordVoiceStateCommand {
  op: 4;
  d: {
    guild_id: string;
    channel_id: string | null;
    self_mute: boolean;
    self_deaf: boolean;
  };
}

/**
 * Connector options.
 */
export interface DiscordConnectorOptions {
  botUserId: string;
}

/**
 * Gateway sender abstraction.
 */
export interface DiscordGatewaySender {
  sendGatewayPayload: (shardId: number, payload: DiscordVoiceStateCommand) => Promise<void> | void;
}
