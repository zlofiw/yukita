#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const version = process.argv[2];
if (!version) {
  console.error('Usage: pnpm version:set <x.y.z>');
  process.exit(1);
}

if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version)) {
  console.error('Invalid semver version: ' + version);
  process.exit(1);
}

const manifestPaths = [
  'package.json'
];

for (const relativePath of manifestPaths) {
  const absolutePath = path.resolve(relativePath);
  const source = fs.readFileSync(absolutePath, 'utf8');
  const manifest = JSON.parse(source);
  manifest.version = version;
  fs.writeFileSync(absolutePath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log('Updated ' + relativePath + ' -> ' + version);
}

// Keep runtime core version in sync with package.json version.
const versionFile = path.resolve('src/version.ts');
if (fs.existsSync(versionFile)) {
  const source = fs.readFileSync(versionFile, 'utf8');
  const next = source.replace(
    /export const CORE_VERSION = '([^']+)';/u,
    `export const CORE_VERSION = '${version}';`
  );
  if (next !== source) {
    fs.writeFileSync(versionFile, next, 'utf8');
    console.log('Updated src/version.ts -> ' + version);
  } else {
    console.warn('Warning: src/version.ts did not contain CORE_VERSION assignment');
  }
}
