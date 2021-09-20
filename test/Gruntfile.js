require('dotenv').config()
const start = require('../backend/express')
const applyDummyData = require('./tasks/applyDummyData')
const setupDatabase = require('./tasks/testDatabase')

module.exports = function (grunt) {

    // Add the grunt-mocha-test tasks.
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-keepalive');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        mochaTest: {
            options: {
                noFail: true,
                showDiff: true
            },
            test: {
                src: ["./tests/**/*.js"]
            }
        },
        watch: {
            gruntfile: {
                tasks: ['backend'],
                files: ['../**/*.js'],
                options: {
                    reload: true
                }
            }
        }
    })

    grunt.registerTask('test', [
        'setup-test'
    ])

    grunt.registerTask('setup-test', [
        // Creates a test database as defined in .env
        'setup-test-database',
        // The backend server must run to handle GraphQL requests
        'run-backend-server',
        // Run all mocha tests.
        'run-mocha',
        //// You may want to keep the server alive after the tests, to run some manual queries on the test database.
        'keepalive'
    ])

    /**
     * Setup 
     */

    grunt.registerTask('setup-test-database', function () {
        let done = this.async()
        setupDatabase().then(db => {
            applyDummyData(db).then(done)
        })
    })

    grunt.registerTask('backend', [
        'run-backend-server',
        'keepalive'
    ])

    grunt.registerTask('backend:watch', [
        'run-backend-server',
        'keepalive'
    ])

    grunt.registerTask('run-backend-server', function () {
        let done = this.async()
        start({
            dbUser: process.env.user,
            dbPassword: process.env.password,
            dbPort: process.env.port,
            dbHost: process.env.host,
            dbName: process.env.database,
            expressPort: 4000,
            jwtSecret: "totally_save_test_secret",
            testEnvironment: true
        }).then(done)
    })

    /** 
     * Test
     */

    grunt.registerTask('run-mocha', 'mochaTest')
}