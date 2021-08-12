const pgp = require('pg-promise')({
    query: function (e) {
        // console.log(e.query);
    }
});

const { default: axios } = require('axios');
const { expect } = require('chai');
const start = require('../../backend/express');
require('dotenv').config()

let authToken;


const {
    user,
    password,
    port,
    host,
    database
} = process.env

const database_schema_file = "../coins_schema.sql"
const graphql_schema_file = "../../backend/"

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

    Database = pgp(dbconf, {})

    console.log(`Remove database ${database} if exists ...`)
    await Database.none(`DROP DATABASE IF EXISTS $1:name`, database)

    console.log(`Create database ${database} ...`)
    await Database.none(`CREATE DATABASE $1:name`, database)

    // Switch to test database:
    dbconf.database = database
    Database = pgp(dbconf, {})

    await start()
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


