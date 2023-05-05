
require("dotenv").config()
const pgp = require("pg-promise")({})

const db = pgp({
    user: process.env.DB_SUPER_USER,
    host: "postgres",
    database: "postgres",
    password: "postgres",
    port: 5432,
})

async function main() {

    await db.none(`CREATE TABLE test (text TEXT)`);
    await db.none(`INSERT INTO test VALUES ('Hello World')`);
    const result = await db.manyOrNone(`SELECT * FROM test`)

    console.log(result)
}


main().catch(console.error)