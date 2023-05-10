
require("dotenv").config()
const pgp = require("pg-promise")({})


const user = process.env.DB_USER
const host = process.env.POSTGRES_HOST || process.env.DB_HOST
const database = process.env.DB_NAME
const password = process.env.DB_PASSWORD
const port = process.env.POSTGRES_PORT || process.env.DB_PORT


console.log({ user, host, database, password, port }})

const db = pgp({
    user,
    host,
    database,
    password,
    port,
})

async function main() {
    await db.none(`DROP TABLE IF EXISTS test`);
    await db.none(`CREATE TABLE test (text TEXT)`);
    await db.none(`INSERT INTO test VALUES ('Hello World')`);
    const result = await db.manyOrNone(`SELECT * FROM test`)

    console.log(result)
}


main().catch((e) => { throw Error(e) })
