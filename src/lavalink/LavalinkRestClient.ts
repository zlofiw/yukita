import { randomUUID } from 'crypto';
import { DEFAULT_RETRY_POLICY, buildBackoffDelay } from './backoff';
import { llErr, llOk, type LavalinkResponse, type LavalinkResponseError, type RestRequestContext, type RestResponseContext } from './responses';
import { CORE_VERSION } from '../version';
import type {
  LavalinkLoadResult,
  LavalinkNodeConfig,
  LavalinkNodeStats,
  LavalinkPlayer,
  LavalinkRestErrorPayload,
  LavalinkRoutePlannerStatus,
  LavalinkSession,
  LavalinkTrack,
  LavalinkUpdatePlayer,
  RetryPolicy
} from './types';

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

type RequestExpectation = 'json' | 'text' | 'none';

export interface LavalinkRestClientHooks {
  onRequest?: (ctx: RestRequestContext) => void | Promise<void>;
  onResponse?: <T>(ctx: RestResponseContext<T>, res: LavalinkResponse<T>) => void | Promise<void>;
  onError?: (ctx: RestRequestContext, error: LavalinkResponseError) => void | Promise<void>;
}

/**
 * REST client for Lavalink v4.
 *
 * - `/v4/*` endpoints: baseUrl
 * - `/version` endpoint: rootUrl (unprefixed)
 */
export class LavalinkRestClient {
  private readonly config: LavalinkNodeConfig;
  private readonly rootUrl: string;
  private readonly baseUrl: string;
  private readonly requestTimeoutMs: number;
  private readonly retryPolicy: RetryPolicy;
  private readonly concurrency: number;

  private hooks: LavalinkRestClientHooks | null = null;

  private active = 0;
  private readonly queue: Array<() => Promise<void>> = [];

  public constructor(config: LavalinkNodeConfig) {
    this.config = config;
    const protocol = config.secure ? 'https' : 'http';
    this.rootUrl = `${protocol}://${config.host}:${config.port}`;
    const restVersion = config.restVersion ?? 4;
    this.baseUrl = `${this.rootUrl}/v${restVersion}`;
    this.requestTimeoutMs = config.requestTimeoutMs ?? 10_000;
    this.retryPolicy = {
      ...DEFAULT_RETRY_POLICY,
      ...(config.retryPolicy ?? {})
    };
    this.concurrency = Math.max(1, config.restConcurrency ?? 4);
  }

  public setHooks(hooks: LavalinkRestClientHooks | null): void {
    this.hooks = hooks;
  }

  /**
   * `/version` (unprefixed) - returns Lavalink version string.
   */
  public async getVersion(): Promise<LavalinkResponse<string>> {
    return this.request<string>({
      base: 'root',
      path: '/version',
      method: 'GET',
      expect: 'text',
      idempotent: true
    });
  }

  /**
   * `/v4/info`
   */
  public async getInfo(): Promise<LavalinkResponse<JsonValue>> {
    return this.request<JsonValue>({
      path: '/info',
      method: 'GET',
      idempotent: true
    });
  }

  /**
   * `/v4/stats`
   */
  public async getStats(): Promise<LavalinkResponse<LavalinkNodeStats>> {
    return this.request<LavalinkNodeStats>({
      path: '/stats',
      method: 'GET',
      idempotent: true
    });
  }

  /**
   * `/v4/loadtracks`
   */
  public async resolve(identifier: string): Promise<LavalinkResponse<LavalinkLoadResult>> {
    return this.request<LavalinkLoadResult>({
      path: `/loadtracks?identifier=${encodeURIComponent(identifier)}`,
      method: 'GET',
      idempotent: true
    });
  }

  /**
   * `/v4/decodetrack`
   */
  public async decodeTrack(encodedTrack: string): Promise<LavalinkResponse<LavalinkTrack>> {
    return this.request<LavalinkTrack>({
      path: `/decodetrack?encodedTrack=${encodeURIComponent(encodedTrack)}`,
      method: 'GET',
      idempotent: true
    });
  }

  /**
   * `/v4/decodetracks`
   */
  public async decodeTracks(encodedTracks: string[]): Promise<LavalinkResponse<LavalinkTrack[]>> {
    return this.request<LavalinkTrack[]>({
      path: '/decodetracks',
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(encodedTracks),
      idempotent: true
    });
  }

  /**
   * `/v4/sessions/{sessionId}/players/{guildId}`
   */
  public async updatePlayer(input: {
    sessionId: string;
    guildId: string;
    noReplace?: boolean;
    payload: LavalinkUpdatePlayer;
  }): Promise<LavalinkResponse<LavalinkPlayer>> {
    const noReplace = input.noReplace ? 'true' : 'false';
    return this.request<LavalinkPlayer>({
      path: `/sessions/${encodeURIComponent(input.sessionId)}/players/${encodeURIComponent(input.guildId)}?noReplace=${noReplace}`,
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(input.payload),
      expect: 'json',
      idempotent: false
    });
  }

  /**
   * `/v4/sessions/{sessionId}/players`
   */
  public async getPlayers(sessionId: string): Promise<LavalinkResponse<LavalinkPlayer[]>> {
    return this.request<LavalinkPlayer[]>({
      path: `/sessions/${encodeURIComponent(sessionId)}/players`,
      method: 'GET',
      idempotent: true
    });
  }

  /**
   * `/v4/sessions/{sessionId}/players/{guildId}`
   */
  public async getPlayer(input: { sessionId: string; guildId: string }): Promise<LavalinkResponse<LavalinkPlayer>> {
    return this.request<LavalinkPlayer>({
      path: `/sessions/${encodeURIComponent(input.sessionId)}/players/${encodeURIComponent(input.guildId)}`,
      method: 'GET',
      idempotent: true
    });
  }

  /**
   * `/v4/sessions/{sessionId}/players/{guildId}`
   */
  public async destroyPlayer(input: { sessionId: string; guildId: string }): Promise<LavalinkResponse<void>> {
    return this.request<void>({
      path: `/sessions/${encodeURIComponent(input.sessionId)}/players/${encodeURIComponent(input.guildId)}`,
      method: 'DELETE',
      expect: 'none',
      idempotent: true
    });
  }

  /**
   * `/v4/sessions/{sessionId}`
   */
  public async updateSession(input: {
    sessionId: string;
    resuming: boolean;
    timeoutMs: number;
  }): Promise<LavalinkResponse<LavalinkSession>> {
    return this.request<LavalinkSession>({
      path: `/sessions/${encodeURIComponent(input.sessionId)}`,
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        resuming: input.resuming,
        timeout: Math.max(0, Math.ceil(input.timeoutMs / 1000))
      }),
      expect: 'json',
      idempotent: false
    });
  }

  /**
   * `/v4/routeplanner/status`
   */
  public async getRoutePlannerStatus(): Promise<LavalinkResponse<LavalinkRoutePlannerStatus | null>> {
    const res = await this.request<LavalinkRoutePlannerStatus>({
      path: '/routeplanner/status',
      method: 'GET',
      idempotent: true
    });
    if (res.ok && (res.value as unknown) === undefined) {
      return llOk(null, res.meta);
    }
    return res as LavalinkResponse<LavalinkRoutePlannerStatus | null>;
  }

  /**
   * `/v4/routeplanner/free/address`
   */
  public async unmarkFailedAddress(address: string): Promise<LavalinkResponse<void>> {
    return this.request<void>({
      path: '/routeplanner/free/address',
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ address }),
      expect: 'none',
      idempotent: false
    });
  }

  /**
   * `/v4/routeplanner/free/all`
   */
  public async unmarkAllFailedAddresses(): Promise<LavalinkResponse<void>> {
    return this.request<void>({
      path: '/routeplanner/free/all',
      method: 'POST',
      expect: 'none',
      idempotent: false
    });
  }

  /**
   * Low-level request helper for full REST coverage (escape hatch).
   */
  public async raw<T = JsonValue>(input: {
    path: string;
    method: string;
    headers?: Record<string, string>;
    body?: string;
    expect?: RequestExpectation;
    idempotent?: boolean;
  }): Promise<LavalinkResponse<T>> {
    const payload: {
      path: string;
      method: string;
      headers?: Record<string, string>;
      body?: string;
      expect?: RequestExpectation;
      idempotent?: boolean;
    } = {
      path: input.path,
      method: input.method
    };
    if (typeof input.headers !== 'undefined') {
      payload.headers = input.headers;
    }
    if (typeof input.body !== 'undefined') {
      payload.body = input.body;
    }
    if (typeof input.expect !== 'undefined') {
      payload.expect = input.expect;
    }
    if (typeof input.idempotent !== 'undefined') {
      payload.idempotent = input.idempotent;
    }
    return this.request<T>(payload);
  }

  private async request<T>(input: {
    base?: 'root' | 'rest';
    path: string;
    method: string;
    headers?: Record<string, string>;
    body?: string;
    expect?: RequestExpectation;
    idempotent?: boolean;
  }): Promise<LavalinkResponse<T>> {
    return this.schedule(async () => {
      const base = input.base ?? 'rest';
      const url = `${base === 'root' ? this.rootUrl : this.baseUrl}${input.path}`;
      const method = input.method.toUpperCase();
      const endpoint = `${method} ${input.path}`;
      const requestId = randomUUID();

      const isIdempotent =
        typeof input.idempotent !== 'undefined'
          ? input.idempotent
          : method === 'GET' || method === 'HEAD' || method === 'OPTIONS' || method === 'DELETE' || method === 'PUT';

      const expect = input.expect ?? 'json';

      for (let attempt = 0; attempt <= this.retryPolicy.maxRetries; attempt += 1) {
        const startedAt = Date.now();

        const headers: Record<string, string> = {
          Authorization: this.config.password,
          'User-Id': this.config.userId,
          'Client-Name': this.config.clientName ?? `YukitaSan/${CORE_VERSION}`,
          ...(input.headers ?? {})
        };

        const requestCtx: RestRequestContext = {
          requestId,
          nodeId: this.config.id,
          endpoint,
          method,
          path: input.path,
          url,
          attempt,
          startedAt,
          timeoutMs: this.requestTimeoutMs,
          headers,
          meta: {}
        };

        await this.hooks?.onRequest?.(requestCtx);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.requestTimeoutMs);

        try {
          const response = await fetch(url, {
            method,
            headers,
            signal: controller.signal,
            ...(typeof input.body !== 'undefined' ? { body: input.body } : {})
          });

          const tookMs = Date.now() - startedAt;
          const meta = {
            ...requestCtx.meta,
            requestId,
            nodeId: this.config.id,
            endpoint,
            tookMs
          };

          if (!response.ok) {
            const errorPayload = await this.safeJson<LavalinkRestErrorPayload>(response);
            const error: LavalinkResponseError = {
              code: `http:${response.status}`,
              message: errorPayload?.message ?? `Lavalink request failed with status ${response.status}`,
              details: {
                status: response.status,
                path: input.path,
                nodeId: this.config.id,
                lavalinkError: errorPayload?.error
              }
            };

            await this.hooks?.onError?.(requestCtx, error);

            if (isIdempotent && attempt < this.retryPolicy.maxRetries && this.shouldRetryStatus(response.status)) {
              const retryAfter = this.parseRetryAfterMs(response.headers.get('retry-after'));
              const delay = typeof retryAfter === 'number' ? retryAfter : buildBackoffDelay(attempt, this.retryPolicy);
              await this.sleep(delay);
              continue;
            }

            const res = llErr<T>('error', error, meta);
            await this.hooks?.onResponse?.({ request: requestCtx, status: response.status, tookMs, payload: undefined as T }, res);
            return res;
          }

          if (expect === 'none' || response.status === 204) {
            const res = llOk<T>(undefined as T, meta);
            await this.hooks?.onResponse?.({ request: requestCtx, status: response.status, tookMs, payload: undefined as T }, res);
            return res;
          }

          if (expect === 'text') {
            const text = (await response.text()) as unknown as T;
            const res = llOk<T>(text, meta);
            await this.hooks?.onResponse?.({ request: requestCtx, status: response.status, tookMs, payload: text }, res);
            return res;
          }

          const parsed = await this.safeJson<T>(response);
          if (typeof parsed === 'undefined') {
            const error: LavalinkResponseError = {
              code: 'invalid_payload',
              message: 'Invalid JSON payload from Lavalink',
              details: {
                status: response.status,
                path: input.path,
                nodeId: this.config.id
              }
            };
            await this.hooks?.onError?.(requestCtx, error);
            const res = llErr<T>('invalidPayload', error, meta);
            await this.hooks?.onResponse?.({ request: requestCtx, status: response.status, tookMs, payload: undefined as T }, res);
            return res;
          }

          const res = llOk(parsed, meta);
          await this.hooks?.onResponse?.({ request: requestCtx, status: response.status, tookMs, payload: parsed }, res);
          return res;
        } catch (error) {
          const tookMs = Date.now() - startedAt;
          const meta = {
            ...requestCtx.meta,
            requestId,
            nodeId: this.config.id,
            endpoint,
            tookMs
          };

          const kind: LavalinkResponse<T>['kind'] = controller.signal.aborted ? 'timeout' : 'error';
          const normalized: LavalinkResponseError = {
            code: controller.signal.aborted ? 'timeout' : 'network_error',
            message: controller.signal.aborted ? 'Request timed out' : 'Network error',
            cause: error,
            details: {
              path: input.path,
              nodeId: this.config.id
            }
          };

          await this.hooks?.onError?.(requestCtx, normalized);

          if (isIdempotent && attempt < this.retryPolicy.maxRetries) {
            const delay = buildBackoffDelay(attempt, this.retryPolicy);
            await this.sleep(delay);
            continue;
          }

          const res = llErr(kind, normalized, meta);
          await this.hooks?.onResponse?.({ request: requestCtx, status: 0, tookMs, payload: undefined as T }, res);
          return res;
        } finally {
          clearTimeout(timeout);
        }
      }

      const meta = {
        requestId,
        nodeId: this.config.id,
        endpoint,
        tookMs: 0
      };
      return llErr<T>('timeout', { code: 'timeout', message: 'Retry attempts exhausted' }, meta);
    });
  }

  private schedule<T>(fn: () => Promise<T>): Promise<T> {
    if (this.concurrency <= 1) {
      return fn();
    }

    return new Promise<T>((resolve, reject) => {
      const run = async () => {
        this.active += 1;
        try {
          resolve(await fn());
        } catch (error) {
          reject(error);
        } finally {
          this.active -= 1;
          this.pump();
        }
      };

      this.queue.push(run);
      this.pump();
    });
  }

  private pump(): void {
    while (this.active < this.concurrency && this.queue.length) {
      const next = this.queue.shift();
      void next?.();
    }
  }

  private async safeJson<T>(response: Response): Promise<T | undefined> {
    try {
      return (await response.json()) as T;
    } catch {
      return undefined;
    }
  }

  private shouldRetryStatus(status: number): boolean {
    return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
  }

  private parseRetryAfterMs(value: string | null): number | null {
    if (!value) {
      return null;
    }
    const seconds = Number(value);
    if (Number.isFinite(seconds)) {
      return Math.max(0, Math.round(seconds * 1000));
    }
    return null;
  }

  private async sleep(ms: number): Promise<void> {
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), ms);
    });
  }
}
