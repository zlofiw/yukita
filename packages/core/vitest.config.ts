import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@yukita/plugin-kit': path.resolve(currentDir, '../plugin-kit/src/index.ts'),
      '@yukita/protocol': path.resolve(currentDir, '../protocol/src/index.ts')
    }
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts']
  }
});
