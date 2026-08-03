import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/lib/riskEngine.ts',
    'src/lib/priorityEngine.ts',
    'src/lib/dependencyGraph.ts',
    'src/lib/schemas.ts',
    'src/lib/auth.ts',
  ],
  coverageReporters: ['text', 'lcov'],
};

export default createJestConfig(config);
