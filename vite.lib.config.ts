import { resolve } from 'path';
import { defineConfig } from 'vite';
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
  build: {
    target: 'es2015',
    lib: {
      entry: [
        'src/WebBuilder.tsx',
        'src/View.tsx',
        'src/components/View/Box/useBoxStyle.ts',
        'src/components/View/Box/Box.tsx',
        'src/components.tsx',
      ],
      formats: ['cjs', 'es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        exports: 'named',
        globals: {
          react: 'React',
        },
      },
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [
          [
            'babel-plugin-styled-components',
            {
              displayName: false,
              namespace: 'web-builder',
            }
          ],
        ]
      }
    }),
  ],
});
