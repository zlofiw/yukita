export interface LavalinkResponseMeta {
  requestId: string;
  nodeId: string;
  endpoint: string;
  tookMs: number;
  // Plugins may attach extra metadata fields for tracing/metrics.
  [key: string]: unknown;
}

export interface LavalinkResponseError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  cause?: unknown;
}

export type LavalinkResponse<T> =
  | {
      ok: true;
      kind: 'ok';
      value: T;
      meta: LavalinkResponseMeta;
    }
  | {
      ok: false;
      kind: 'error' | 'timeout' | 'aborted' | 'invalidPayload';
      error: LavalinkResponseError;
      meta: LavalinkResponseMeta;
    };

export interface RestRequestContext {
  requestId: string;
  nodeId: string;
  endpoint: string;
  method: string;
  path: string;
  url: string;
  attempt: number;
  startedAt: number;
  timeoutMs: number;
  headers: Record<string, string>;
  meta: Record<string, unknown>;
}

export interface RestResponseContext<T> {
  request: RestRequestContext;
  status: number;
  tookMs: number;
  payload: T;
}

export function llOk<T>(value: T, meta: LavalinkResponseMeta): LavalinkResponse<T> {
  return { ok: true, kind: 'ok', value, meta };
}

export function llErr<T = never>(
  kind: LavalinkResponse<T>['kind'],
  error: LavalinkResponseError,
  meta: LavalinkResponseMeta
): LavalinkResponse<T> {
  return { ok: false, kind: kind as Exclude<LavalinkResponse<T>['kind'], 'ok'>, error, meta };
}
