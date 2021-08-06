const pgp = require('pg-promise')({
    query: function (e) {
        // console.log(e.query);
    }
});

const { QueryFile } = pgp
const { default: axios } = require('axios');
const { expect } = require('chai');
const path = require("path")
require('dotenv').config()

let authToken;

let Database;

const {
    user,
    password,
    port,
    host,
    database
} = process.env

const database_schema_file = "../coins_schema.sql"
const graphql_schema_file = "../../backend/"


class AxiosHelper {

    static ok(result) {
        if (result.data.errors && result.data.errors.length > 0) {
            return false
        } else return true
    }


    static getErrors(result) {
        console.log(result)
        let errors = [];
        if (result.data.errors && result.data.errors.length > 0) {
            errors = result.data.errors.map(errObj => errObj.message)
        }
        return errors
    }
}

function graphql(query, variables = {}, auth = false) {
    headers = {}

    if (auth) {
        headers.auth = authToken
    }

    return new Promise((resolve, reject) => {
        axios({
            url: "http://localhost:4000/graphql",
            method: "post",
            headers,
            data: {
                query,
                variables
            },
        }).then(result => {
            if (AxiosHelper.ok(result)) {
                resolve(result)
            } else {
                let errors = AxiosHelper.getErrors(result)
                reject(errors)
            }
        }).catch(reject)
    })
}


/**
 * The env file describes how the database is accessed!
 * 
 * We have to verify first, that it was created properly.
 */
describe("Check .env variables", function () {
    ["user",
        "password",
        "port",
        "host",
        "database"].forEach(var_name => {
            it(`Test for variable ${var_name}`, function () {
                expect(process.env[var_name]).to.not.be.undefined
            })
        })
})

describe("Setup Test Environment", function () {
    before(async function () {


        await graphql(`{ping}`).catch((err) => {
            console.log(err)
            throw new Error(`Background process is not running. Start it and try again!`)
        })


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


    const User = {
        email: "tom.testa@example.com",
        password: "secure_password"
    }

    describe("Create Data.", function () {
        it(`Test if application is running properly`, async function () {
            let result = await graphql(`{
                ping
                }`)

                expect(result?.data?.data?.ping).to.not.be.undefined
        })

        it(`Setup the application with super user`, async function () {

            let result = await graphql(`mutation{
            setup(data:{
                email: ${User.email},
                password: ${User.password}
            })
            }`)

            console.log(result)
        })


    })

    describe("Shutting down Mocha", function () {
        // process.exit()
    })
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


