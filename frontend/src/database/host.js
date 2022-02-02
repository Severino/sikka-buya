const required = ["VUE_APP_GRAPHQL_URL"]
const missing = []

required.forEach(str => {
    if (process.env[str] == null) missing.push(str)
})

if (missing.length > 0) console.error(`One or more env variables are not set. Program will not work correctly: ${missing.join(", ")}`)

export const graphqlEndpoint = process.env.VUE_APP_GRAPHQL_URL

