import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/../../src/$1',
  },
  testEnvironment: 'node',
  testRegex: '.db.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};

export default config;
