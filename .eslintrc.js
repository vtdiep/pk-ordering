module.exports = {
  root:true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb',
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
    'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],
    "import/prefer-default-export": 'off',
    'class-methods-use-this': 'off',
    'prefer-const': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
    '@typescript-eslint/no-use-before-define': 'off',
    'import/no-extraneous-dependencies': [
      'error', {'devDependencies': ['**/*.test.ts', '**/*.spec.ts', '**/*-spec.ts', './src/utils/**/**.ts', '**/mock*.ts']}
    ],
  },
  "overrides": [{
    "files": ["*.spec.ts"],
    "rules": {
      'no-param-reassign': ['error', { props: true, ignorePropertyModificationsForRegex: ["^draft"] }],
    }
  },
  { "files": ["{src,apps,libs,test}/**/*.spec.ts"],
    "plugins": ["jest"],
    "rules": {
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
      "jest/expect-expect": "error"    
      // "jest/no-disabled-tests": "warn",
      // "jest/no-focused-tests": "error",
    }
  }
],
  // settings: {
  //   react: {
  //    version: "999",
  //   },
  // }
};
