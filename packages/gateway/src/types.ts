import type { Server } from 'http';
import type { LavalinkFilters } from '@yukita/protocol';
import type { PlayInput } from '@yukita/core';

/**
 * Gateway operation values.
 */
export type GatewayOp = 'event' | 'cmd' | 'ack' | 'err';

/**
 * Role values used for authz.
 */
export type GatewayRole = 'web:read' | 'bot:control' | 'admin';

/**
 * Envelope for all gateway frames.
 */
export interface GatewayEnvelope<TPayload extends object = Record<string, unknown>> {
  op: GatewayOp;
  t: string;
  id: string;
  ts: number;
  d: TPayload;
}

/**
 * Auth mode for WS sessions.
 */
export type GatewayAuthMode = 'jwt' | 'hmac';

/**
 * Auth token claims.
 */
export interface GatewayClaims {
  sub: string;
  roles: GatewayRole[];
  exp?: number;
  iat?: number;
  iss?: string;
  aud?: string;
}

/**
 * Gateway auth config.
 */
export interface GatewayAuthOptions {
  mode: GatewayAuthMode;
  secret: string;
  issuer?: string;
  audience?: string;
}

/**
 * Fixed-window rate limit policy.
 */
export interface GatewayRateLimitOptions {
  maxCommands: number;
  windowMs: number;
}

/**
 * Gateway server options.
 */
export interface GatewayServerOptions {
  port?: number;
  host?: string;
  path?: string;
  server?: Server;
  auth: GatewayAuthOptions;
  allowedOrigins?: string[];
  rateLimit?: Partial<GatewayRateLimitOptions>;
}

/**
 * Command payload map.
 */
export interface GatewayCommandMap {
  play: {
    contextId: string;
    input: PlayInput;
  };
  pause: {
    contextId: string;
  };
  resume: {
    contextId: string;
  };
  stop: {
    contextId: string;
  };
  seek: {
    contextId: string;
    positionMs: number;
  };
  volume: {
    contextId: string;
    volume: number;
  };
  'queue.add': {
    contextId: string;
    input: PlayInput;
  };
  'queue.remove': {
    contextId: string;
    index: number;
  };
  'queue.move': {
    contextId: string;
    fromIndex: number;
    toIndex: number;
  };
  'queue.clear': {
    contextId: string;
  };
  'queue.shuffle': {
    contextId: string;
  };
  'filters.apply': {
    contextId: string;
    filters: LavalinkFilters;
  };
  'filters.clear': {
    contextId: string;
  };
  subscribe: {
    topic: string;
  };
  unsubscribe: {
    topic: string;
  };
}
