const pgp = require('pg-promise')({
    query: function (e) {
        console.log(e.query);
    }
});

const { QueryFile } = pgp
const mocha = require("mocha")
const { expect } = require('chai');
const path = require("path")
require('dotenv').config()

let Database;

describe("Setup Test Environment", function () {
    before(async function () {
        const {
            user,
            password,
            port,
            host,
            database,
            schema_file
        } = process.env

        let dbconf = {
            user,
            password,
            port,
            host,
            database: user
        };

        Database = pgp(dbconf, {})

        await Database.none(`DROP DATABASE IF EXISTS $1:name`, database)
        await Database.none(`CREATE DATABASE $1:name`, database)

        // Switch to test database:
        dbconf.database = database
        Database = pgp(dbconf, {})


        const schemaFile = new QueryFile(path.join(__dirname, schema_file))
        await Database.any(schemaFile).catch(console.log)
    })

    describe("This is a test", function () {

        it("If this is a test, juhuu;", function () {
            expect(true).to.be.true
        })
    })

    // describe("Shutting down Mocha", function(){
    //     // process.exit()
    // })
})




// /**
//  * Creates an async environment that allows us to
//  * use await/async.
//  */
// async function before() {


// }


// // Create a async environment
// (async function () {
//     await main().catch(console.error)
// })()


