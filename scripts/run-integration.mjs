#!/usr/bin/env node
import { spawn } from 'node:child_process';

const isWin = process.platform === 'win32';
const command = isWin ? 'cmd.exe' : 'pnpm';
const args = isWin
  ? ['/d', '/s', '/c', 'pnpm exec vitest run tests/integration']
  : ['exec', 'vitest', 'run', 'tests/integration'];

const child = spawn(command, args, {
  stdio: 'inherit',
  env: {
    ...process.env,
    RUN_INTEGRATION: '1'
  }
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});
