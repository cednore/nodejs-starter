module.exports = {
  env: {
    es2021: true,
    browser: false,
    node: true,
    mocha: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'off',
    camelcase: 'off',
  },
  plugins: ['prettier'],
};
