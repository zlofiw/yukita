# Release Guide

## Prerequisites

- npm account has publish access for `@yukita/*`.
- Local npm auth is ready: `npm whoami`.
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

## Local Publish

Dry-run first:

```bash
pnpm publish:dry-run
```

Then publish:

```bash
pnpm publish:npm
```

## Tag and Push Repository

```bash
git tag v1.0.1
git push origin main
git push origin v1.0.1
```

## Docs (Local Build)

```bash
pnpm docs:build
```

Built static site is in `docs/.vitepress/dist`. Deploy it manually to your hosting target.
