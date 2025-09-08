import { resolve } from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src'),
      },
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test.setup.ts',
    coverage: {
      provider: 'istanbul',
    },
  },
});
