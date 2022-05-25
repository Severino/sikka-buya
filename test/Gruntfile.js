require('dotenv').config()
const { setupTestDatabase, runBackendServer } = require('./tasks/setup')

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
        'setup-and-test'
    ])

    grunt.registerTask('setup', [
        // Creates a test database as defined in .env
        'setup-test-database',
        // The backend server must run to handle GraphQL requests
        'run-backend-server',
    ])

    grunt.registerTask('setup-and-keepalive', [
        'setup',
        //// You may want to keep the server alive after the tests, to run some manual queries on the test database.
        'keepalive'
    ])

    grunt.registerTask('setup-and-test', [
        'setup',
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
        setupTestDatabase().then(done)
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
        runBackendServer().then(done)
    })

    /** 
     * Test
     */

    grunt.registerTask('run-mocha', 'mochaTest')
}