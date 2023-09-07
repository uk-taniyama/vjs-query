// eslint-disable-next-line import/no-extraneous-dependencies
const yargs = require('yargs');

const args = yargs(process.argv).parse();

const coverage = args.coverage === true;
const reporters = ['default'];
if (coverage) {
  reporters.push(['jest-html-reporters', {
    publicPath: './log',
    filename: 'report.html',
    openReport: true,
  }]);
}

const esmodules = [
].join('|');

/** @type {import('jest').Config} */
module.exports = {
  testMatch: ['<rootDir>/src/**/*.test.(tsx|ts)'],
  testEnvironment: 'jest-environment-jsdom',
  transformIgnorePatterns: [
    // `node_modules/(?!(${esmodules})/)`,
  ],
  collectCoverage: coverage,
  coverageProvider: 'v8',
  coverageDirectory: './log/coverage/',
  reporters,
  transform: {
    '.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        sourceMaps: 'inline',
        module: {
          type: 'commonjs',
        },
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
};
