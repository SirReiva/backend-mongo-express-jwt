const tsconfig = require('./tsconfig.test.json');
const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig);

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testTimeout: 30000,
    moduleNameMapper,
};
