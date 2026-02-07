import { AsyncEventBus, YukitaError, YukitaErrorCode, err, ok, type Result } from '../shared';
import { LavalinkNode, type LavalinkNodeEvents } from './LavalinkNode';
import type { LavalinkNodeConfig } from './types';
import type { NodeSelectionRequest, NodeSelectionStrategy } from '../types';

/**
 * Node pool event map.
 */
export interface NodePoolEvents {
  'node.connected': { nodeId: string; resumed: boolean };
  'node.disconnected': { nodeId: string; code: number; reason: string };
  'node.error': { nodeId: string; error: Error };
  'node.stats': { nodeId: string; stats: LavalinkNodeEvents['stats']['stats'] };
  'node.playerUpdate': { nodeId: string; payload: LavalinkNodeEvents['playerUpdate']['payload'] };
  'node.playerEvent': { nodeId: string; payload: LavalinkNodeEvents['playerEvent']['payload'] };
  'node.raw': { nodeId: string; payload: unknown };
}

/**
 * Multi-node manager with selection and failover helpers.
 */
export class NodePool {
  public readonly events = new AsyncEventBus<NodePoolEvents>();
  private readonly nodes = new Map<string, LavalinkNode>();
  private strategy: NodeSelectionStrategy;
  private roundRobinCursor = 0;

  public constructor(input: { nodes: LavalinkNodeConfig[]; strategy: NodeSelectionStrategy }) {
    this.strategy = input.strategy;
    for (const nodeConfig of input.nodes) {
      const node = new LavalinkNode(nodeConfig);
      this.nodes.set(node.id, node);
      this.bindNode(node);
    }
  }

  /**
   * Sets default selection strategy.
   */
  public setStrategy(strategy: NodeSelectionStrategy): void {
    this.strategy = strategy;
  }

  /**
   * Returns shallow copy of all nodes.
   */
  public listNodes(): LavalinkNode[] {
    return [...this.nodes.values()];
  }

  /**
   * Gets node by id.
   */
  public getNode(nodeId: string): LavalinkNode | undefined {
    return this.nodes.get(nodeId);
  }

  /**
   * Connects all configured nodes.
   */
  public async connectAll(): Promise<Result<void>> {
    const results = await Promise.all(this.listNodes().map((node) => node.connect()));
    const failed = results.filter((result) => !result.ok);
    if (failed.length === results.length && failed.length > 0) {
      return err(
        new YukitaError({
          code: YukitaErrorCode.NODE_CONNECT_FAILED,
          message: 'All nodes failed to connect',
          meta: {
            failedNodes: failed.length
          }
        })
      );
    }
    return ok(undefined);
  }

  /**
   * Adds node at runtime.
   */
  public async addNode(config: LavalinkNodeConfig): Promise<Result<LavalinkNode>> {
    if (this.nodes.has(config.id)) {
      return err(
        new YukitaError({
          code: YukitaErrorCode.INVALID_ARGUMENT,
          message: `Node "${config.id}" already exists`,
          meta: { nodeId: config.id }
        })
      );
    }

    const node = new LavalinkNode(config);
    this.nodes.set(node.id, node);
    this.bindNode(node);
    const connectResult = await node.connect();
    if (!connectResult.ok) {
      return connectResult;
    }
    return ok(node);
  }

  /**
   * Removes and destroys node.
   */
  public async removeNode(nodeId: string): Promise<Result<void>> {
    const node = this.nodes.get(nodeId);
    if (!node) {
      return err(
        new YukitaError({
          code: YukitaErrorCode.NODE_NOT_FOUND,
          message: `Node "${nodeId}" not found`,
          meta: { nodeId }
        })
      );
    }

    this.nodes.delete(nodeId);
    await node.destroy();
    return ok(undefined);
  }

  /**
   * Selects best available node.
   */
  public select(input: NodeSelectionRequest = {}): Result<LavalinkNode> {
    const preferred = input.preferredNodeId ? this.nodes.get(input.preferredNodeId) : undefined;
    if (preferred && preferred.state === 'connected') {
      return ok(preferred);
    }

    const excluded = new Set(input.excludeNodeIds ?? []);
    const available = this.listNodes().filter((node) => node.state === 'connected' && !excluded.has(node.id));
    if (!available.length) {
      return err(
        new YukitaError({
          code: YukitaErrorCode.NODE_UNAVAILABLE,
          message: 'No connected nodes available',
          meta: {
            preferredNodeId: input.preferredNodeId,
            excludedNodeIds: [...excluded]
          }
        })
      );
    }

    const strategy = input.strategy ?? this.strategy;
    if (typeof strategy === 'function') {
      const selected = strategy(available, input);
      if (!selected) {
        return err(
          new YukitaError({
            code: YukitaErrorCode.NODE_UNAVAILABLE,
            message: 'Custom node selection strategy returned no node',
            meta: {
              preferredNodeId: input.preferredNodeId,
              excludedNodeIds: [...excluded]
            }
          })
        );
      }
      if (selected.state !== 'connected') {
        return err(
          new YukitaError({
            code: YukitaErrorCode.NODE_UNAVAILABLE,
            message: 'Custom node selection strategy returned a disconnected node',
            meta: {
              nodeId: selected.id,
              state: selected.state,
              preferredNodeId: input.preferredNodeId,
              excludedNodeIds: [...excluded]
            }
          })
        );
      }
      if (excluded.has(selected.id)) {
        return err(
          new YukitaError({
            code: YukitaErrorCode.NODE_UNAVAILABLE,
            message: 'Custom node selection strategy returned an excluded node',
            meta: {
              nodeId: selected.id,
              preferredNodeId: input.preferredNodeId,
              excludedNodeIds: [...excluded]
            }
          })
        );
      }
      return ok(selected);
    }

    let selected: LavalinkNode;
    switch (strategy) {
      case 'round-robin': {
        this.roundRobinCursor = this.roundRobinCursor % available.length;
        selected = available[this.roundRobinCursor]!;
        this.roundRobinCursor = (this.roundRobinCursor + 1) % available.length;
        break;
      }
      case 'least-load':
        selected = [...available].sort((a, b) => (a.stats?.players ?? Number.MAX_SAFE_INTEGER) - (b.stats?.players ?? Number.MAX_SAFE_INTEGER))[0]!;
        break;
      case 'latency':
        selected = [...available].sort((a, b) => (a.latencyMs ?? Number.MAX_SAFE_INTEGER) - (b.latencyMs ?? Number.MAX_SAFE_INTEGER))[0]!;
        break;
      case 'penalty':
      default:
        selected = [...available].sort((a, b) => a.penalty - b.penalty)[0]!;
        break;
    }

    return ok(selected);
  }

  /**
   * Destroys all nodes and clears listeners.
   */
  public async destroy(): Promise<void> {
    const nodes = this.listNodes();
    this.nodes.clear();
    await Promise.all(nodes.map((node) => node.destroy()));
    this.events.clear();
  }

  private bindNode(node: LavalinkNode): void {
    node.events.on('connected', async (payload) => {
      await this.events.emit('node.connected', payload);
    });
    node.events.on('disconnected', async (payload) => {
      await this.events.emit('node.disconnected', payload);
    });
    node.events.on('error', async (payload) => {
      await this.events.emit('node.error', payload);
    });
    node.events.on('stats', async (payload) => {
      await this.events.emit('node.stats', payload);
    });
    node.events.on('playerUpdate', async (payload) => {
      await this.events.emit('node.playerUpdate', payload);
    });
    node.events.on('playerEvent', async (payload) => {
      await this.events.emit('node.playerEvent', payload);
    });
    node.events.on('raw', async (payload) => {
      await this.events.emit('node.raw', payload);
    });
  }
}
