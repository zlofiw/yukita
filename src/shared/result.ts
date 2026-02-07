import { YukitaError, type YukitaErrorCode } from './errors';

/**
 * Result primitive used by all public methods.
 */
export type Result<TValue> =
  | {
      ok: true;
      value: TValue;
    }
  | {
      ok: false;
      error: YukitaError;
    };

/**
 * Builds a successful result.
 */
export function ok<TValue>(value: TValue): Result<TValue> {
  return { ok: true, value };
}

/**
 * Builds a failed result.
 */
export function err<TValue = never>(error: YukitaError): Result<TValue> {
  return { ok: false, error };
}

/**
 * Converts unknown errors to `YukitaError`.
 */
export function toYukitaError(
  error: unknown,
  fallback: {
    code: YukitaErrorCode;
    message: string;
    meta?: Record<string, unknown>;
  }
): YukitaError {
  if (error instanceof YukitaError) {
    return error;
  }

  const payload: ConstructorParameters<typeof YukitaError>[0] = {
    code: fallback.code,
    message: fallback.message,
    cause: error
  };
  if (typeof fallback.meta !== 'undefined') {
    payload.meta = fallback.meta;
  }

  return new YukitaError(payload);
}
