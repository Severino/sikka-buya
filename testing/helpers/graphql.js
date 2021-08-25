const { default: axios } = require('axios');
const AxiosHelper = require('./axios');

let authToken = null

function authenticate(token) {
    authToken = token
}

function graphql(query, variables = {}, auth = false) {
    headers = {}

    if (auth) {
        if (!authToken) throw new Error("Requested auth, but auth was not set.")
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


module.exports = { graphql, authenticate }

