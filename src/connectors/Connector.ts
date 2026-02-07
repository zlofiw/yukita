import type { LavalinkNode } from '../lavalink/LavalinkNode';
import type { YukitaSan } from '../YukitaSan';

/**
 * Shoukaku-style connector interface: thin Discord library adapter.
 */
export interface Connector {
  getId(): string;
  listen(nodes: readonly LavalinkNode[]): void;
  sendPacket(guildId: string, payload: unknown): void | Promise<void>;
  set(manager: YukitaSan): void;
}

