/**
 * The cli script is currenlty only used for debugging.
 * Use index.js for production!
 */

const { program } = require('commander');

program.version('0.0.1');

program
    .requiredOption("-d --database <string>", "Database to be used.")
    .requiredOption("-u --user <string>", "User for querying the database.")
    .requiredOption("-H --host <string>", "URI of the database.") // -H is used as -h is often used for the help function.
    .requiredOption("-P --port <number>", "Port to be used when accessing the database.")
    .requiredOption("-p --password <string>", "Password to be used when accessing the database.")
    .option("-s --secret <string>", "The secret that is used on the server to create the JWT token.", "weak_secret")
    .option("-a --app-port <number>", "The port the express app is running on.", "4000")
    .parse()


let options = program.opts()

process.env.useCli = true
process.env.database = {}


let map = {
    "database": "DB_NAME",
    "user": "DB_USER",
    "host": "DB_HOST",
    "port": "DB_PORT",
    "password": "DB_PASSWORD",
    "secret": "JWT_SECRET",
    "appPort": "EXPRESS_PORT"
}

for (let [optionsKey, mappedKeyOrFunc] of Object.entries(map)) {
    let optionsValue = options[optionsKey]
    process.env[mappedKeyOrFunc] = optionsValue
}

require("./index.js")