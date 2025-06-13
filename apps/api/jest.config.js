// eslint-disable-next-line import/no-anonymous-default-export
export default {
    preset: 'ts-jest/presets/default-esm',
    extensionsToTreatAsEsm: ['.ts'],
    testEnvironment: 'node',
    transform: {
      '^.+\\.ts$': ['ts-jest', {
        useESM: true
      }]
    },
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    setupFilesAfterEnv: ['./jest.setup.js'],
    testMatch: [
      '**/__tests__/**/*.ts',
      '**/test/**/*.ts',
      '**/?(*.)+(spec|test).ts'
    ],
    collectCoverageFrom: [
      'src/**/*.ts',
      '!src/**/*.d.ts'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html']
  };