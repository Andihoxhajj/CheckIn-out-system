/** @type {import('eslint').Linter.Config} */
export default {
  root: true,
  env: {
    browser: true,
    es2022: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react-refresh'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended', 'eslint-config-prettier'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
};

