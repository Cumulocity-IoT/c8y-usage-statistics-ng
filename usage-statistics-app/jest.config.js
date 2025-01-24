// jest.config.js
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.js'],
  transformIgnorePatterns: ['/!node_modules\\/lodash-es/'],
  collectCoverageFrom: [
    '!**/node_modules/**',
    '!**/__snapshots__/**',
    '!src/**/*.component.ts',
    'src/**/*.service.ts'
  ]
};
