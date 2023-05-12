
require("dotenv").config()
const pgp = require("pg-promise")({})


const user = process.env.DB_SUPER_USER
const host = process.env.DB_HOST
const database = process.env.DB_NAME
const password = process.env.DB_SUPER_PASSWORD
const port = process.env.DB_PORT


console.log({ user, host, database, password, port })

const db = pgp({
    user,
    host,
    database,
    password,
    port,
})

db.one("SHOW LC_COLLATE").then((result) => {
    console.log(result)
}).catch((e) => { console.error(e) })


