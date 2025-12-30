module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',

    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
    },

    env: {
        browser: true,
        es2021: true,
    },

    plugins: ['@typescript-eslint', 'react', 'react-hooks'],

    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'prettier',
    ],

    settings: {
        react: {
            version: 'detect',
        },
    },

    rules: {
        // TypeScript
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/no-unused-vars': [
            'error',
            { argsIgnorePattern: '^_' },
        ],

        // React
        'react/react-in-jsx-scope': 'off',
        'react/jsx-uses-react': 'off',
        'react/prop-types': 'off',

        // General
        'no-console': ['warn', { allow: ['warn', 'error'] }],
    },

    ignorePatterns: [
        'dist',
        'node_modules',
        '*.config.js',
        '*.config.cjs',
        'public',
    ],
};
