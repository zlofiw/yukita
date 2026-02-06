import { createHmac } from 'crypto';
import type { GatewayClaims } from './types';

/**
 * Creates HMAC token for gateway auth mode `hmac`.
 */
export function createGatewayHmacToken(claims: GatewayClaims, secret: string): string {
  const payload = Buffer.from(JSON.stringify(claims), 'utf8').toString('base64url');
  const signature = createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}
