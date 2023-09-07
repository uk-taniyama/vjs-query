module.exports = {
  env: {
    // browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  // "parser": "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
    project: ['./tsconfig.eslint.json'],
  },
  plugins: [
    'unused-imports',
  ],
  ignorePatterns: ['grammars/**'],
  settings: {
    'import/resolver': {
      typescript: true,
    },
  },
  rules: {
    // 'linebreak-style': 'off',
    'max-len': [
      'warn', {
        code: 100, ignoreComments: true, ignoreTrailingComments: true, ignoreStrings: true,
      },
    ],
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
    'import/order': [
      'error', {
        groups: [
          'builtin',
          'external',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
        alphabetize: { order: 'asc' },
        'newlines-between': 'always',
      },
    ],
    'import/no-named-as-default': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    '@typescript-eslint/type-annotation-spacing': 'error',
    '@typescript-eslint/ban-ts-comment': [
      'error', {
        'ts-expect-error': { descriptionFormat: '^: TS\\d+' },
      },
    ],
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/semi': ['error'],
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn', {
        vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_',
      },
    ],
    'arrow-body-style': 'off',
    'no-underscore-dangle': 'off',
    'max-classes-per-file': 'off',
  },
  overrides: [
    {
      files: [
        '.eslint.cjs',
        'rollup.config.mjs',
        'jest.config.cjs',
        'vite*.config.ts',
        'src/test-utils/**/*',
        '*.spec.ts',
        '*.spec.tsx',
      ],
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'no-console': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
      },
    },
  ],
};
