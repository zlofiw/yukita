/**
 * Stable error code list for all public YukiTa APIs.
 */
export const YukitaErrorCode = {
  INVALID_ARGUMENT: 'INVALID_ARGUMENT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  TIMEOUT: 'TIMEOUT',
  AUTH_FAILED: 'AUTH_FAILED',
  RATE_LIMITED: 'RATE_LIMITED',
  COMMAND_NOT_ALLOWED: 'COMMAND_NOT_ALLOWED',
  NODE_NOT_FOUND: 'NODE_NOT_FOUND',
  NODE_UNAVAILABLE: 'NODE_UNAVAILABLE',
  NODE_CONNECT_FAILED: 'NODE_CONNECT_FAILED',
  NODE_DISCONNECTED: 'NODE_DISCONNECTED',
  NODE_REST_FAILED: 'NODE_REST_FAILED',
  NODE_WS_FAILED: 'NODE_WS_FAILED',
  RESOLVE_FAILED: 'RESOLVE_FAILED',
  LOAD_FAILED: 'LOAD_FAILED',
  PLAYER_NOT_FOUND: 'PLAYER_NOT_FOUND',
  PLAYER_ALREADY_EXISTS: 'PLAYER_ALREADY_EXISTS',
  PLAYER_OPERATION_FAILED: 'PLAYER_OPERATION_FAILED',
  PLAYER_UPDATE_FAILED: 'PLAYER_UPDATE_FAILED',
  QUEUE_OUT_OF_RANGE: 'QUEUE_OUT_OF_RANGE',
  PLUGIN_INIT_FAILED: 'PLUGIN_INIT_FAILED',
  INCOMPATIBLE_PLUGIN: 'INCOMPATIBLE_PLUGIN'
} as const;

/**
 * Stable error code union for `YukitaError`.
 */
export type YukitaErrorCode = (typeof YukitaErrorCode)[keyof typeof YukitaErrorCode];

/**
 * Structured error object used across all packages.
 */
export class YukitaError extends Error {
  public readonly code: YukitaErrorCode;
  public readonly meta?: Record<string, unknown>;

  public override readonly cause?: unknown;

  public constructor(input: {
    code: YukitaErrorCode;
    message: string;
    meta?: Record<string, unknown>;
    cause?: unknown;
  }) {
    super(input.message);
    this.name = 'YukitaError';
    this.code = input.code;
    if (typeof input.meta !== 'undefined') {
      this.meta = input.meta;
    }
    if (typeof input.cause !== 'undefined') {
      this.cause = input.cause;
    }
  }
}
