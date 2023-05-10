
require("dotenv").config()
const pgp = require("pg-promise")({})

const db = pgp({
    user: process.env.DB_USER,
    host: process.env.POSTGRES_HOST || process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.POSTGRES_PORT || process.env.DB_PORT,
})

async function main() {
    await db.none(`DROP TABLE IF EXISTS test`);
    await db.none(`CREATE TABLE test (text TEXT)`);
    await db.none(`INSERT INTO test VALUES ('Hello World')`);
    const result = await db.manyOrNone(`SELECT * FROM test`)

    console.log(result)
}


main().catch((e) => { throw Error(e) })
