require('dotenv').config()


const start = require('../backend/express');
const setupDatabase = require('./tasks/testDatabase');
const applyDummyData = require('./tasks/applyDummyData');
const { default: axios } = require('axios');
const setupTests = require('./test/setupTest');
let authToken;


async function main() {
    await setup()
    await setupTests()
}

async function setup() {

    const db = await setupDatabase()
    await applyDummyData(db)

    // Stat backend server on test database

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





// Create a async environment
(async function () {
    await main().catch(console.error)
})()


