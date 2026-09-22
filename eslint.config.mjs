import withNuxt from './.nuxt/eslint.config.mjs'
import eslintConfigPrettier from 'eslint-config-prettier'

export default withNuxt([
  {
    files: ['**/*.ts', '**/*.js', '**/*.vue'],

    rules: {
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],

          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
            },
            {
              pattern: '~/**',
              group: 'internal',
            },
            {
              pattern: '~~/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'padding-line-between-statements': ['error', { blankLine: 'always', prev: '*', next: 'return' }],
    },
  },

  eslintConfigPrettier,
])
