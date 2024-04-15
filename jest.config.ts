module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testMatch: ['**/*.tests.ts'],
  moduleFileExtensions: ['ts', 'js'],
  modulePathIgnorePatterns: ['../dist/'],
  transform: {
    '^.+\\.{ts|tsx}?$': [
      'ts-jest',
      {
        tsConfig: 'tsconfig.json',
      },
    ],
  },
};
