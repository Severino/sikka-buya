require('dotenv').config()
const start = require('../backend/express')
const applyDummyData = require('./tasks/applyDummyData')
const setupDatabase = require('./tasks/testDatabase')

module.exports = function (grunt) {

    // Add the grunt-mocha-test tasks.
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.loadNpmTasks('grunt-keepalive');

    grunt.initConfig({
        mochaTest: {
            test: {
                src: ["./test/**/*.js"]
            }
        }
    })

    grunt.registerTask('test', [
        'setup-test'
    ])

    grunt.registerTask('setup-test', [
        'setup-test-database',
        'run-backend-server',
        'test-setup',
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

    grunt.registerTask('run-backend-server', function () {
        let done = this.async()
        start({
            dbUser: process.env.user,
            dbPassword: process.env.password,
            dbPort: process.env.port,
            dbHost: process.env.host,
            dbName: process.env.database,
            expressPort: 4000,
            jwtSecret: "totally_save_test_secret"
        }).then(done)
    })

    /** 
     * Test
     */

    grunt.registerTask('test-setup', 'mochaTest')
}