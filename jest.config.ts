import type { Config } from 'jest';

const jestConfig: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  resetMocks: true,
  rootDir: '.',
  testMatch: ['**/*.spec.ts'],
  roots: ['<rootDir>/src/'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  modulePathIgnorePatterns: [],
  transformIgnorePatterns: [
    'node_modules/(?!(camelcase)/)'
  ],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/shared/**'
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '~/src/(.*)': '<rootDir>/src/$1'
  },
};

export default jestConfig;
