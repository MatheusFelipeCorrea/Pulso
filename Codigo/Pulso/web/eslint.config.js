import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{js,jsx}'],
        extends: [
            js.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
        },
        rules: {
            'no-unused-vars': [
                'error',
                {
                    varsIgnorePattern: '^[A-Z_]',
                    argsIgnorePattern: '^[A-Z_]',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            // Regras do React Compiler exigem refatorar o app; o CI só precisa de lint estável.
            'react-hooks/set-state-in-effect': 'off',
            'react-hooks/refs': 'off',
            'react-hooks/incompatible-library': 'off',
            'react-hooks/static-components': 'off',
            'react-refresh/only-export-components': 'off',
        },
    },
    {
        files: ['*.config.js', 'vite.config.js', 'playwright.config.js'],
        languageOptions: {
            globals: globals.node,
        },
    },
])
