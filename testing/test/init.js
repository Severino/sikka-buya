const pgp = require('pg-promise')({
    query: function (e) {
        console.log(e.query);
    }
});

const { QueryFile } = pgp
const fs = require("fs/promises")
const { expect, should } = require('chai');
const path = require("path")
require('dotenv').config()
import {
    graphqlSync,
    getIntrospectionQuery,
    IntrospectionQuery
} from 'graphql';


let Database;

describe("Setup Test Environment", function () {
    before(async function () {
        const {
            user,
            password,
            port,
            host,
            database,
            database_schema_file
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


        const dbSchemaFile = new QueryFile(path.join(__dirname, database_schema_file))
        await Database.any(dbSchemaFile).catch(console.log)
    })

    describe("Test Schema", function () {

        let graphql_schema_json;

        before(async function () {
            const graphql_schema_file = process.env.graphql_schema_file
            console.log(graphql_schema_file)
            graphql_schema_json = await fs.readFile(graphql_schema_file, { encoding: "UTF-8" })
            const introspection = graphqlSync(graphql_schema_file, getIntrospectionQuery()).data;
            console.log(introspection)

        })

        it("GraphQL schema was created successfully", function () {
            console.log(graphql_schema_json)
            expect(graphql_schema_json).to.not.be.undefined
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


