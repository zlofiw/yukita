import type { RetryPolicy } from './types';

/**
 * Default retry policy for reconnect and retry flows.
 */
export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxRetries: 15,
  baseDelayMs: 500,
  maxDelayMs: 20_000,
  jitterRatio: 0.2
};

/**
 * Builds exponential delay with jitter.
 */
export function buildBackoffDelay(attempt: number, policy: RetryPolicy): number {
  const exp = policy.baseDelayMs * Math.pow(2, Math.max(0, attempt));
  const bounded = Math.min(policy.maxDelayMs, exp);
  const jitterWindow = bounded * policy.jitterRatio;
  const jitter = (Math.random() * 2 - 1) * jitterWindow;
  return Math.max(0, Math.round(bounded + jitter));
}
