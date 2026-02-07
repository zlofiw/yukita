import { YukitaError, YukitaErrorCode, err, ok, type Result, type YukitaTrackModel } from '../shared';
import type { RepeatMode } from '../types';

/**
 * Queue model with repeat and mutation operations.
 */
export class PlayerQueue {
  private readonly items: YukitaTrackModel[] = [];
  private repeatMode: RepeatMode = 'none';

  /**
   * Returns readonly queue items.
   */
  public get value(): readonly YukitaTrackModel[] {
    return this.items;
  }

  /**
   * Returns current repeat mode.
   */
  public get repeat(): RepeatMode {
    return this.repeatMode;
  }

  /**
   * Sets repeat mode.
   */
  public setRepeat(mode: RepeatMode): void {
    this.repeatMode = mode;
  }

  /**
   * Adds one or more tracks.
   */
  public add(track: YukitaTrackModel | YukitaTrackModel[]): Result<number> {
    const list = Array.isArray(track) ? track : [track];
    this.items.push(...list);
    return ok(this.items.length);
  }

  /**
   * Removes track by index.
   */
  public remove(index: number): Result<YukitaTrackModel> {
    if (index < 0 || index >= this.items.length) {
      return err(
        new YukitaError({
          code: YukitaErrorCode.QUEUE_OUT_OF_RANGE,
          message: `Queue index ${index} is out of range`,
          meta: {
            index,
            size: this.items.length
          }
        })
      );
    }

    const [removed] = this.items.splice(index, 1);
    return ok(removed!);
  }

  /**
   * Moves track from index to index.
   */
  public move(fromIndex: number, toIndex: number): Result<void> {
    if (
      fromIndex < 0 ||
      fromIndex >= this.items.length ||
      toIndex < 0 ||
      toIndex >= this.items.length
    ) {
      return err(
        new YukitaError({
          code: YukitaErrorCode.QUEUE_OUT_OF_RANGE,
          message: 'Queue move indexes are out of range',
          meta: {
            fromIndex,
            toIndex,
            size: this.items.length
          }
        })
      );
    }

    const [item] = this.items.splice(fromIndex, 1);
    this.items.splice(toIndex, 0, item!);
    return ok(undefined);
  }

  /**
   * Clears queue.
   */
  public clear(): void {
    this.items.length = 0;
  }

  /**
   * Shuffles queue in-place.
   */
  public shuffle(): void {
    for (let index = this.items.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [this.items[index], this.items[randomIndex]] = [this.items[randomIndex]!, this.items[index]!];
    }
  }

  /**
   * Consumes next track based on repeat mode.
   */
  public next(current: YukitaTrackModel | null): YukitaTrackModel | null {
    if (this.repeatMode === 'track' && current) {
      return current;
    }

    if (this.repeatMode === 'queue' && current) {
      this.items.push(current);
    }

    return this.items.shift() ?? null;
  }
}
