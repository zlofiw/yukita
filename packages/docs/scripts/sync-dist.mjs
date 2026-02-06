import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(scriptDir, '..');
const repoRoot = path.resolve(packageRoot, '..', '..');
const sourceDir = path.join(repoRoot, 'docs', '.vitepress', 'dist');
const targetDir = path.join(packageRoot, 'dist');

try {
  await fs.access(sourceDir);
} catch {
  throw new Error('Missing docs/.vitepress/dist. Run `pnpm docs:build` first.');
}

await fs.rm(targetDir, {
  recursive: true,
  force: true
});
await fs.cp(sourceDir, targetDir, {
  recursive: true
});

console.log(`[docs-module] Synced ${sourceDir} -> ${targetDir}`);