---
layout: home

hero:
  name: YukiTa
  text: TypeScript Lavalink Toolkit
  tagline: Core, protocol, gateway, connectors and plugins with strict Result-based API.
  actions:
    - theme: brand
      text: Quick Start
      link: /quick-start
    - theme: alt
      text: Plugin Guide
      link: /guides/plugin-development

features:
  - title: Multi-node Core
    details: Runtime node add/remove, health checks, reconnect with backoff+jitter, and failover with playback consistency.
  - title: Predictable API
    details: Public methods return Result<T, YukitaError> with stable error codes and structured metadata.
  - title: Gateway + Plugins
    details: WebSocket control/event bridge, role-aware auth, and extension points without monkey patching.
---

## Packages

- `@yukita/core`
- `@yukita/protocol`
- `@yukita/plugin-kit`
- `@yukita/gateway`
- `@yukita/connector-discord`
- `@yukita/plugins-metrics`
- `@yukita/plugins-resolve-cache`

## Monorepo

This repository uses pnpm workspaces and ships each package independently to npm.