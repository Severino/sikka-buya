const { expect } = require('chai')

/**
    * The env file describes how the database is accessed!
    * 
    * We have to verify first, that it was created properly.
    */
describe("Check .env variables", function () {
    ["DB_USER",
        "DB_PASSWORD",
        "DB_PORT",
        "DB_HOST",
        "DB_NAME",
        "MAX_SEARCH"].forEach(var_name => {
            it(`Is env variable is set: ${var_name}`, function () {
                expect(process.env[var_name]).to.not.be.undefined
            })
        })
})