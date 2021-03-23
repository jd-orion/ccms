module.exports = {
  preset: 'ts-jest',
  verbose: true,
  collectCoverage: true,
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy'
  }
}
