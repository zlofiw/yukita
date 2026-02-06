import { YukitaError, YukitaErrorCode, err, ok, toYukitaError, type Result } from '@yukita/plugin-kit';
import type {
  LavalinkLoadResult,
  LavalinkNodeConfig,
  LavalinkNodeStats,
  LavalinkRestErrorPayload,
  LavalinkUpdatePlayer
} from './types';

/**
 * REST client for Lavalink v4+.
 */
export class LavalinkRestClient {
  private readonly config: LavalinkNodeConfig;
  private readonly baseUrl: string;
  private readonly requestTimeoutMs: number;

  public constructor(config: LavalinkNodeConfig) {
    this.config = config;
    const protocol = config.secure ? 'https' : 'http';
    const restVersion = config.restVersion ?? 4;
    this.baseUrl = `${protocol}://${config.host}:${config.port}/v${restVersion}`;
    this.requestTimeoutMs = config.requestTimeoutMs ?? 10_000;
  }

  /**
   * Resolves tracks for identifier.
   */
  public async resolve(identifier: string): Promise<Result<LavalinkLoadResult>> {
    return this.request<LavalinkLoadResult>(`/loadtracks?identifier=${encodeURIComponent(identifier)}`, {
      method: 'GET'
    });
  }

  /**
   * Fetches node stats.
   */
  public async getStats(): Promise<Result<LavalinkNodeStats>> {
    return this.request<LavalinkNodeStats>('/stats', {
      method: 'GET'
    });
  }

  /**
   * Updates player on lavalink.
   */
  public async updatePlayer(input: {
    sessionId: string;
    guildId: string;
    noReplace?: boolean;
    payload: LavalinkUpdatePlayer;
  }): Promise<Result<void>> {
    const noReplace = input.noReplace ? 'true' : 'false';
    const path = `/sessions/${encodeURIComponent(input.sessionId)}/players/${encodeURIComponent(input.guildId)}?noReplace=${noReplace}`;
    const response = await this.request(path, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(input.payload)
    });

    return response.ok ? ok(undefined) : response;
  }

  /**
   * Removes player from lavalink.
   */
  public async destroyPlayer(input: { sessionId: string; guildId: string }): Promise<Result<void>> {
    const path = `/sessions/${encodeURIComponent(input.sessionId)}/players/${encodeURIComponent(input.guildId)}`;
    const response = await this.request(path, {
      method: 'DELETE'
    });
    return response.ok ? ok(undefined) : response;
  }

  /**
   * Updates session resume settings.
   */
  public async updateSession(input: {
    sessionId: string;
    resuming: boolean;
    timeoutMs: number;
  }): Promise<Result<void>> {
    const path = `/sessions/${encodeURIComponent(input.sessionId)}`;
    const response = await this.request(path, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        resuming: input.resuming,
        timeout: input.timeoutMs
      })
    });
    return response.ok ? ok(undefined) : response;
  }

  private async request<TResponse>(path: string, init: RequestInit): Promise<Result<TResponse>> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.requestTimeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        ...init,
        signal: controller.signal,
        headers: {
          Authorization: this.config.password,
          'User-Id': this.config.userId,
          'Client-Name': this.config.clientName ?? 'YukiTa/1.0',
          ...(init.headers ?? {})
        }
      });

      if (!response.ok) {
        let body: LavalinkRestErrorPayload | null = null;
        try {
          body = (await response.json()) as LavalinkRestErrorPayload;
        } catch {
          body = null;
        }

        return err(
          new YukitaError({
            code: YukitaErrorCode.NODE_REST_FAILED,
            message: body?.message ?? `Lavalink request failed with status ${response.status}`,
            meta: {
              status: response.status,
              path,
              nodeId: this.config.id,
              lavalinkError: body?.error
            }
          })
        );
      }

      if (response.status === 204) {
        return ok(undefined as TResponse);
      }

      const payload = (await response.json()) as TResponse;
      return ok(payload);
    } catch (error) {
      return err(
        toYukitaError(error, {
          code: YukitaErrorCode.NODE_REST_FAILED,
          message: 'Lavalink REST request failed',
          meta: {
            path,
            nodeId: this.config.id
          }
        })
      );
    } finally {
      clearTimeout(timeout);
    }
  }
}
