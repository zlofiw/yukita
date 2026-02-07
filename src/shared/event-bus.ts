import { toYukitaError } from './result';
import { YukitaErrorCode } from './errors';

export type Listener<TPayload> = (payload: TPayload) => void | Promise<void>;

/**
 * Async-safe typed event bus.
 */
export class AsyncEventBus<TEvents extends object> {
  private readonly listeners = new Map<keyof TEvents, Set<Listener<any>>>();

  /**
   * Registers a listener.
   */
  public on<TKey extends keyof TEvents>(event: TKey, listener: Listener<TEvents[TKey]>): () => void {
    const current = this.listeners.get(event) ?? new Set<Listener<TEvents[TKey]>>();
    current.add(listener);
    this.listeners.set(event, current as Set<Listener<any>>);
    return () => this.off(event, listener);
  }

  /**
   * Removes a listener.
   */
  public off<TKey extends keyof TEvents>(event: TKey, listener: Listener<TEvents[TKey]>): void {
    const current = this.listeners.get(event);
    if (!current) {
      return;
    }
    current.delete(listener);
    if (!current.size) {
      this.listeners.delete(event);
    }
  }

  /**
   * Emits event to all listeners.
   */
  public async emit<TKey extends keyof TEvents>(
    event: TKey,
    payload: TEvents[TKey],
    onError?: (error: Error) => void
  ): Promise<void> {
    const current = this.listeners.get(event);
    if (!current || !current.size) {
      return;
    }

    for (const listener of current) {
      try {
        await listener(payload);
      } catch (error) {
        const normalized = toYukitaError(error, {
          code: YukitaErrorCode.INTERNAL_ERROR,
          message: 'Event listener failed',
          meta: { event: String(event) }
        });
        onError?.(normalized);
      }
    }
  }

  /**
   * Removes all listeners.
   */
  public clear(): void {
    this.listeners.clear();
  }
}
