module.exports = {
  root: true,
  env: {
    node: true,
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard',
  ],
  globals: {
    'VERSION': 'readonly',
    'OneSignal': 'readonly',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'space-before-function-paren': ['error', 'never'],
    'keyword-spacing': ['error', { 'overrides': {
      'if': { 'after': false },
      'for': { 'after': false },
      'while': { 'after': false },
      'switch': { 'after': false },
      'catch': { 'after': false },
    } }],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
}
