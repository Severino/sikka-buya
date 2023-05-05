

const pgp = require("pg-promise")

const db = pgp({
    user: "postgres",
    host: "postgres",
    database: "postgres",
    password: "postgres",
    port: 5432,
})

db.none(`CREATE TABLE test (text TEXT)`);
db.none(`INSERT INTO test VALUES ('Hello World')`);
const result = db.manyOrNone(`SELECT * FROM test`)

console.log(result)