import type { Config } from 'jest';

const config: Config = {
  // use jest-preset inside of root dir
  preset: '<rootDir>',
  displayName: 'Database Tests',

  // We need to respecify rootDir, b/c default rootDir is '.'
  // If you also have specified rootDir, the resolution of this file will be relative to that root directory.
  // https://jestjs.io/docs/configuration/#preset-string
  rootDir: '../../',
  testRegex: ['.db.spec.ts$', '.controller.spec.ts$'],
};

export default config;
