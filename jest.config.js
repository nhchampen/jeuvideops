module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.js$': ['babel-jest', { rootMode: 'upward' }]
    },
    roots: [
        '<rootDir>/games/spaceword',
        '<rootDir>/games/two-ships-passing-in-the-night'
    ],
    testMatch: [
        '**/__tests__/**/*.js',
        '**/?(*.)+(spec|test).js'
    ],
    reporters: [
        'default',
        ['jest-junit', {
            outputDirectory: '<rootDir>/test-results',
            outputName: 'junit.xml'
        }]
    ]
};