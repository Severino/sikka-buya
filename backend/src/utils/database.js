require("dotenv").config()

const pgp = require("pg-promise")({
    // This logs the queries that are executed.
    query: function (e) {
        // console.log(e.query);
    }
})

if (!process.env.DB_USER) {
    throw new Error("Make sure to run the script from the root of the project, that contains the .env file.")
}

const Database = pgp({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

module.exports = { Database, pgp }