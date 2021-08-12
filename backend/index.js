
const run = require("./express")

if (!process.env.useCli) {
    require("dotenv").config()
}

/**
 * Requires all env arguments to be set
 */

let env_variable = ["EXPRESS_PORT",
    "JWT_SECRET",
    "DB_NAME",
    "DB_USER",
    "DB_HOST",
    "DB_PORT",
    "DB_PASSWORD"]


env_variable.forEach(prop => {
    if (!process.env[prop]) throw new Error(`Property was not set on process.env '${prop}'.`)
})


run();