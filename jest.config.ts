import type { Config } from 'jest';

const config: Config = {
  testTimeout: 10_000,
  moduleFileExtensions: [
    'js',
    'json',
    'ts'
  ],
  roots: ['src', 'test'],
  testRegex: '.*\\.(spec|test)\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  coveragePathIgnorePatterns: [
    'main.ts',
    'db.data-source.ts',
    '\\.types\\.ts',
    'dto',
  ],
  collectCoverageFrom: [
    'src/**/*.(t|j)s'
  ],
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      statements: 75,
    },
  },
  testEnvironment: 'node',
};

export default config;