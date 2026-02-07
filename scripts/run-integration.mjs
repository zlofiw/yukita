#!/usr/bin/env node
import { spawn } from 'node:child_process';

const pnpmBin = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const args = ['exec', 'vitest', 'run', 'tests/integration'];

const child = spawn(pnpmBin, args, {
  stdio: 'inherit',
  env: {
    ...process.env,
    RUN_INTEGRATION: '1'
  }
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});

