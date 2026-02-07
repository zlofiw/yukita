import { sign } from 'jsonwebtoken';
import { ok, type Result } from '../shared';
import { createGatewayHmacToken, YukitaGatewayServer, type GatewayClaims, type GatewayServerOptions } from '../gateway';
import type { YukitaPlugin } from './types';
import { CORE_COMPATIBLE_RANGE, CORE_VERSION } from '../version';

export interface WebsocketGatewayPluginOptions extends GatewayServerOptions {
  /**
   * Extension namespace registered via `client.getExtension(namespace)`.
   * Defaults to `websocketGateway`.
   */
  namespace?: string;
  /**
   * Start gateway automatically on `client.start()`.
   * Defaults to `true`.
   */
  autoStart?: boolean;
}

export class WebsocketGatewayPlugin implements YukitaPlugin {
  public readonly name = 'websocket-gateway';
  public readonly version = CORE_VERSION;
  public readonly compatibleRange = CORE_COMPATIBLE_RANGE;

  private readonly options: WebsocketGatewayPluginOptions;
  private gateway: YukitaGatewayServer | null = null;

  public constructor(options: WebsocketGatewayPluginOptions) {
    this.options = options;
  }

  public async init(ctx: Parameters<YukitaPlugin['init']>[0]): Promise<Result<void>> {
    const namespace = this.options.namespace ?? 'websocketGateway';
    const autoStart = this.options.autoStart ?? true;

    const gateway = new YukitaGatewayServer(ctx.client, this.options);
    this.gateway = gateway;

    ctx.registerHooks({
      onInit: async () => {
        if (autoStart) {
          await gateway.start();
        }
      },
      onShutdown: async () => {
        await gateway.stop();
      }
    });

    const extension = ctx.extendApi(namespace, {
      server: gateway,
      start: () => gateway.start(),
      stop: () => gateway.stop(),
      createToken: (claims: GatewayClaims): string => {
        if (this.options.auth.mode === 'hmac') {
          return createGatewayHmacToken(claims, this.options.auth.secret);
        }

        return sign(claims, this.options.auth.secret, {
          issuer: this.options.auth.issuer,
          audience: this.options.auth.audience
        });
      }
    });
    if (!extension.ok) {
      return extension;
    }

    return ok(undefined);
  }
}

export function createWebsocketGatewayPlugin(options: WebsocketGatewayPluginOptions): YukitaPlugin {
  return new WebsocketGatewayPlugin(options);
}
