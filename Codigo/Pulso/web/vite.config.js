import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    include: ['tests/**/*.test.{js,jsx}', 'tests/**/*.spec.{js,jsx}'],
    coverage: {
      provider: 'v8',
      include: [
        'src/utils/**',
        'src/services/**',
        'src/store/**',
        'src/schemas/**',
        'src/hooks/**',
        'src/design-system/utils/**',
      ],
      exclude: [
        '**/*.styles.jsx',
        '**/index.js',
        'src/main.jsx',
        'src/utils/reminderCategories.jsx',
      ],
      thresholds: {
        lines: 90,
        statements: 90,
        functions: 90,
        branches: 85,
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3333',
        changeOrigin: true,
      },
    },
  },
})