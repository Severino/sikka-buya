const { QueryFile } = require('pg-promise');
const { join: joinPath } = require("path")

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

let {
    user,
    password,
    port,
    host,
    database
} = process.env

async function setupDatabase() {

    let dbconf = {
        user,
        password,
        port,
        host,
        database: user
    };
    console.log(dbconf)

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

    return db;
}

module.exports = setupDatabase