#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const version = process.argv[2];
if (!version) {
  console.error('Usage: pnpm version:all <x.y.z>');
  process.exit(1);
}

if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version)) {
  console.error('Invalid semver version: ' + version);
  process.exit(1);
}

const manifestPaths = [
  'package.json',
  'packages/core/package.json',
  'packages/protocol/package.json',
  'packages/plugin-kit/package.json',
  'packages/gateway/package.json',
  'packages/connectors/connector-discord/package.json',
  'packages/plugins/metrics/package.json',
  'packages/plugins/resolve-cache/package.json'
];

for (const relativePath of manifestPaths) {
  const absolutePath = path.resolve(relativePath);
  const source = fs.readFileSync(absolutePath, 'utf8');
  const manifest = JSON.parse(source);
  manifest.version = version;
  fs.writeFileSync(absolutePath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log('Updated ' + relativePath + ' -> ' + version);
}