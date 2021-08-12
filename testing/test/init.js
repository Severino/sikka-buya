const pgp = require('pg-promise')({
    connect(client) {
        console.log("Connect to database...", client.connectionParameters.database)
    },
    disconnect(client) {
        console.log("Disconnect from database...", client.connectionParameters.database)

    },
    query: function (e) {
        // console.log(e.query);
    }
});

const { join: joinPath } = require("path")
const { default: axios } = require('axios');
const { expect } = require('chai');
const { QueryFile } = require('pg-promise');
const start = require('../../backend/express');
require('dotenv').config()
const { readdir } = require('fs').promises;

let authToken;


let {
    user,
    password,
    port,
    host,
    database
} = process.env


async function main() {
    await setup()
    // await tests()
}

async function setup() {

    let dbconf = {
        user,
        password,
        port,
        host,
        database: user
    };

    SuperDatabase = pgp(dbconf, {})

    console.log(`Remove database ${database} if exists ...`)
    await SuperDatabase.none(`DROP DATABASE IF EXISTS $1:name`, database)

    console.log(`Create database ${database} ...`)
    await SuperDatabase.none(`CREATE DATABASE $1:name`, database)

    // Switch to the test database.
    dbconf.database = database
    let db = pgp(dbconf, {})

    console.log(`Create database schema ...`)
    let dbSchemaFile = new QueryFile(joinPath(__dirname, "..", "..", "backend", "migrations", "schema.sql"), { minify: true, compress: true })
    await db.any(dbSchemaFile)

    /**
     * Probably the connection times out due to the schema file being quite big.
     * Therefore we need to reconnect the db. 
     * I'm not quite certain of this (SO)
     */


    db.connect()
    await applyDummyData(db)




    // Stat backend server on test database
    await start({
        dbUser: user,
        dbPassword: password,
        dbPort: port,
        dbHost: host,
        dbName: database,
        expressPort: 4000,
        jwtSecret: "totally_save_test_secret"
    })
}

async function applyDummyData(Database) {
    const sqlDummyDataPath = joinPath(__dirname, "..", "data")
    const dummyFiles = await readdir(sqlDummyDataPath)
    console.log(`Data files will be applied: ${dummyFiles.join(", ")}`)
    for (const file of dummyFiles) {
        const absFilePath = joinPath(sqlDummyDataPath, file)
        console.log(`Apply SQL file: ${file} / ${absFilePath}`)
        const queryFile = new QueryFile(absFilePath, { minify: true, compress: true, debug: true })
        await Database.any(queryFile)
    }
    console.log("DONE")
}


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
        console.log(query)
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

async function tests() {
    describe(`Run tests on GraphQL interface`, async function () {

        // after(function () {
        //     process.exit()
        // })

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

            })


            const User = {
                email: "tom.testa@example.com",
                password: "secure_password"
            }

            describe("Create Data.", function () {

                let result;

                it(`Test if application is running properly`, async function () {
                    let result = await graphql(`{
                ping
                }`)

                    expect(result?.data?.data?.ping).to.not.be.undefined
                })

                it(`Setup the application with super user`, async function () {

                    result = await graphql(`mutation{
            setup(data:{
                email: ${User.email},
                password: ${User.password}
            })
            }`)

                    expect(result.success).to.be.true
                })

                it(`Token is set`, function () {
                    expect(result.token).to.be.string;
                })

                it(`Setup user is super user`, async function () {
                    let auth = await graphql(`{auth (token: ${result.token}){ id email super }}`)

                    expect(auth.data.data.auth).to.deep.equal({
                        id: 1,
                        email: User.email,
                        super: true
                    })
                })
            })

            // describe(`Test Login`, function () {

            //     it()
            // })


        })

    })
}





// Create a async environment
(async function () {
    await main().catch(console.error)
})()


