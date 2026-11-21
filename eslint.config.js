// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettier = require('eslint-config-prettier');

module.exports = defineConfig([
  expoConfig,
  prettier,
  {
    // Where eslint-config-expo registers the TypeScript plugin
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // The component template keeps an empty Props type
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowObjectTypes: 'always' },
      ],
      // The template imports React; react-jsx doesn't need it
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { varsIgnorePattern: '^React$' },
      ],
      // The template destructures empty Props: ({}: Props)
      'no-empty-pattern': ['warn', { allowObjectPatternsAsParameters: true }],
    },
  },
  {
    ignores: ['dist/*', 'ios/*', 'android/*'],
  },
]);
