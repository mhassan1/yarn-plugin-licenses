module.exports = {
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  ...(process.env.CI && { maxWorkers: 1 }),
  testRegex: '(/__tests__/.*|(\\.|/)test)\\.ts$',
  moduleFileExtensions: ['ts', 'js'],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 95,
      lines: 95,
      statements: 90
    }
  },
  coverageReporters: ['text']
}
