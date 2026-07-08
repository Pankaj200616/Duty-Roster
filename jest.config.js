export default {
  testEnvironment: 'jsdom',
  testMatch: ['**/*.test.js'],
  transform: {},
  moduleFileExtensions: ['js'],
  collectCoverageFrom: ['static/js/**/*.js'],
  setupFiles: ['<rootDir>/jest.setup.js'],
};
