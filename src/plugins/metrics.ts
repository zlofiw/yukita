import { YukitaErrorCode, err, ok, type Result } from '../shared';
import type { YukitaPlugin } from './types';
import { CORE_COMPATIBLE_RANGE, CORE_VERSION } from '../version';

/**
 * Runtime metrics snapshot.
 */
export interface MetricsSnapshot {
  resolves: number;
  resolveFailures: number;
  plays: number;
  nodeEvents: number;
  playerEvents: number;
  trackEvents: number;
  queueEvents: number;
}

/**
 * Metrics plugin options.
 */
export interface MetricsPluginOptions {
  namespace?: string;
}

/**
 * Reference plugin that tracks operation counters.
 */
export class MetricsPlugin implements YukitaPlugin {
  public readonly name = 'metrics';
  public readonly version = CORE_VERSION;
  public readonly compatibleRange = CORE_COMPATIBLE_RANGE;
  private readonly namespace: string;
  private readonly counters: MetricsSnapshot = {
    resolves: 0,
    resolveFailures: 0,
    plays: 0,
    nodeEvents: 0,
    playerEvents: 0,
    trackEvents: 0,
    queueEvents: 0
  };

  public constructor(options: MetricsPluginOptions = {}) {
    this.namespace = options.namespace ?? 'metrics';
  }

  public async init(ctx: Parameters<YukitaPlugin['init']>[0]): Promise<Result<void>> {
    ctx.registerHooks({
      beforeResolve: (payload) => {
        this.counters.resolves += 1;
        return payload;
      },
      afterResolve: (_payload, result) => {
        if (result.kind === 'loadFailed') {
          this.counters.resolveFailures += 1;
        }
        return result;
      },
      beforePlay: (payload) => {
        this.counters.plays += 1;
        return payload;
      },
      onNodeEvent: () => {
        this.counters.nodeEvents += 1;
      },
      onPlayerEvent: () => {
        this.counters.playerEvents += 1;
      },
      onTrackEvent: () => {
        this.counters.trackEvents += 1;
      },
      onQueueEvent: () => {
        this.counters.queueEvents += 1;
      }
    });

    const extension = ctx.extendApi(this.namespace, {
      getSnapshot: (): MetricsSnapshot => ({ ...this.counters }),
      reset: (): void => {
        this.counters.resolves = 0;
        this.counters.resolveFailures = 0;
        this.counters.plays = 0;
        this.counters.nodeEvents = 0;
        this.counters.playerEvents = 0;
        this.counters.trackEvents = 0;
        this.counters.queueEvents = 0;
      }
    });
    if (!extension.ok) {
      return extension;
    }
    return ok(undefined);
  }
}

/**
 * Factory helper.
 */
export function createMetricsPlugin(options?: MetricsPluginOptions): YukitaPlugin {
  return new MetricsPlugin(options);
}

export { YukitaErrorCode, err };
