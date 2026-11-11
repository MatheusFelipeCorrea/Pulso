import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
    plugins: [react(), tailwindcss()],
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
                'src/services/viagemService.js',
                'src/services/moedaService.js',
                'src/services/syncService.js',
                'src/services/purchasePlanningService.js',
                'src/services/expenseSplitService.js',
                'src/services/notificationService.js',
                'src/utils/tripWikipediaImage.js',
                'src/utils/tripCommonsImage.js',
                'src/utils/tripCountryImages.js',
                'src/utils/tripBrazilCityCatalog.js',
                'src/utils/tripDestinationImages.js',
                'src/hooks/useUserSync.js',
                'src/hooks/useNotifications.js',
                'src/store/hooks.js',
            ],
            reporter: ['text', 'text-summary', 'json-summary', 'lcov'],
            reportsDirectory: './coverage',
        },
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:3333',
                changeOrigin: true,
                ws: true,
            },
        },
    },
})
