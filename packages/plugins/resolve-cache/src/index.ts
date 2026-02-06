import { ok, type YukitaPlugin, type YukitaResolveModel } from '@yukita/plugin-kit';

type CacheEntry = {
  expiresAt: number;
  value: YukitaResolveModel;
};

/**
 * Resolve cache plugin options.
 */
export interface ResolveCachePluginOptions {
  namespace?: string;
  ttlMs?: number;
  maxEntries?: number;
}

/**
 * Runtime resolve cache stats.
 */
export interface ResolveCacheStats {
  size: number;
  hits: number;
  misses: number;
}

/**
 * Resolve cache plugin using before/after resolve hooks.
 */
export class ResolveCachePlugin implements YukitaPlugin {
  public readonly name = 'resolve-cache';
  public readonly version = '1.0.0';
  public readonly compatibleRange = '^1.0.0';

  private readonly namespace: string;
  private readonly ttlMs: number;
  private readonly maxEntries: number;
  private readonly cache = new Map<string, CacheEntry>();
  private hits = 0;
  private misses = 0;

  public constructor(options: ResolveCachePluginOptions = {}) {
    this.namespace = options.namespace ?? 'resolveCache';
    this.ttlMs = options.ttlMs ?? 45_000;
    this.maxEntries = options.maxEntries ?? 1_000;
  }

  public init(ctx: Parameters<YukitaPlugin['init']>[0]) {
    ctx.registerHooks({
      beforeResolve: (payload) => {
        const key = this.makeKey(payload.query, payload.sourceHints);
        const entry = this.cache.get(key);
        if (!entry || entry.expiresAt < Date.now()) {
          if (entry) {
            this.cache.delete(key);
          }
          this.misses += 1;
          return payload;
        }

        this.hits += 1;
        return {
          ...payload,
          shortCircuitResult: entry.value
        };
      },
      afterResolve: (request, result) => {
        if (result.kind === 'loadFailed') {
          return result;
        }
        const key = this.makeKey(request.query, request.sourceHints);
        this.cache.set(key, {
          expiresAt: Date.now() + this.ttlMs,
          value: result
        });
        this.trim();
        return result;
      }
    });

    const extension = ctx.extendApi(this.namespace, {
      clear: (): void => this.cache.clear(),
      invalidate: (query: string, sourceHints?: string[]): void => {
        this.cache.delete(this.makeKey(query, sourceHints));
      },
      stats: (): ResolveCacheStats => ({
        size: this.cache.size,
        hits: this.hits,
        misses: this.misses
      })
    });
    if (!extension.ok) {
      return extension;
    }
    return ok(undefined);
  }

  private makeKey(query: string, sourceHints?: string[]): string {
    const hints = sourceHints?.join(',') ?? '';
    return `${query.toLowerCase()}::${hints.toLowerCase()}`;
  }

  private trim(): void {
    if (this.cache.size <= this.maxEntries) {
      return;
    }
    const overflow = this.cache.size - this.maxEntries;
    const iterator = this.cache.keys();
    for (let index = 0; index < overflow; index += 1) {
      const key = iterator.next().value;
      if (key) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * Factory helper.
 */
export function createResolveCachePlugin(options?: ResolveCachePluginOptions): YukitaPlugin {
  return new ResolveCachePlugin(options);
}
