import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    alias: {
      'obsidian': path.resolve(__dirname, './tests/obsidian-mock.ts')
    },
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts']
  }
});
