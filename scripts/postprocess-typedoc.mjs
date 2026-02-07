#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const outputDir = path.resolve('docs', 'api', 'reference');
const readmePath = path.join(outputDir, 'README.md');
const indexPath = path.join(outputDir, 'index.md');

if (!fs.existsSync(outputDir)) {
  console.error('[typedoc] output directory not found: ' + outputDir);
  process.exit(1);
}

if (!fs.existsSync(readmePath)) {
  // Nothing to do.
  process.exit(0);
}

const readme = fs.readFileSync(readmePath, 'utf8');
fs.writeFileSync(indexPath, readme, 'utf8');
fs.unlinkSync(readmePath);

const walk = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith('.md')) {
      continue;
    }
    const source = fs.readFileSync(full, 'utf8');
    const next = source.replace(/\.\.\/README\.md/g, '../index.md');
    if (next !== source) {
      fs.writeFileSync(full, next, 'utf8');
    }
  }
};

walk(outputDir);
console.log('[typedoc] post-processed: README.md -> index.md');

