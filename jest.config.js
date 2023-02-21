module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest'
  },
  coveragePathIgnorePatterns: [
    'index.js'
  ]
}
