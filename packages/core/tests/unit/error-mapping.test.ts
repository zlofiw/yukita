import { describe, expect, it } from 'vitest';
import { YukitaError, YukitaErrorCode, toYukitaError } from '@yukita/plugin-kit';

describe('error mapping', () => {
  it('returns YukitaError as-is', () => {
    const source = new YukitaError({
      code: YukitaErrorCode.INVALID_ARGUMENT,
      message: 'invalid'
    });
    const mapped = toYukitaError(source, {
      code: YukitaErrorCode.INTERNAL_ERROR,
      message: 'fallback'
    });
    expect(mapped).toBe(source);
  });

  it('maps unknown errors to YukitaError', () => {
    const mapped = toYukitaError(new Error('boom'), {
      code: YukitaErrorCode.INTERNAL_ERROR,
      message: 'fallback'
    });
    expect(mapped).toBeInstanceOf(YukitaError);
    expect(mapped.code).toBe('INTERNAL_ERROR');
  });
});
