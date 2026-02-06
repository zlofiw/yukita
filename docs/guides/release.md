# Release Guide

## Prerequisites

- npm organization and package names are available.
- `NPM_TOKEN` secret is configured in GitHub repository settings.
- All package versions are aligned.

## Local Validation

```bash
pnpm install
pnpm check
pnpm docs:build
```

## Version Bump

Use the workspace helper:

```bash
pnpm version:all 1.0.1
pnpm install --lockfile-only
```

`version:all` updates root + all publishable `@yukita/*` package manifests in one step.

## Tag and Push

```bash
git tag v1.0.1
git push origin v1.0.1
```

`publish.yml` validates that every `@yukita/*` package version matches the pushed tag and then publishes to npm.

## GitHub Pages

`docs-pages.yml` builds VitePress from `docs/` on `main` branch pushes and deploys to GitHub Pages.
