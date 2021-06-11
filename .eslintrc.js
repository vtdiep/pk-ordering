module.exports = {
  root:true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'linebreak-style': ["error", "windows"],
    "import/prefer-default-export": "off",
  },
};
