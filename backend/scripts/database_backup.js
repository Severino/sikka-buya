/**
 * Creates a backup of the database
 * based on the configured .env file.
 * 
 * Must be run with on of the flags:
 * --data (-d) : Backs up all data
 * --schema (-s) : Backs up only the structure of the database without the data.
 */

try {
    require("dotenv").config()
} catch (e) {
    console.error("Create an .env file. Check the README.md for required values.")
}

const os = require("os")
const util = require("util")
const exec = util.promisify(require("child_process").exec);

const path = require('path');


function execute(command) {
    console.log(command)
    return new Promise((resolve, reject) => {
        exec(command).then(({ stdout, stderr }) => {
            if (stdout) console.log(`${stdout}`);
            if (stderr) console.error(`ERROR: ${stderr}`);
            resolve()
        }).catch(reject)
    })
}

function zeroPad(val) {
    return (val).toString().padStart(2, "0")
}

function constructFileName(prefix, ext) {
    let date = new Date()
    const name = `${prefix}${date.getUTCFullYear()}${zeroPad(date.getUTCMonth() + 1)}${zeroPad(date.getUTCDate())}T${zeroPad(date.getUTCHours())}${zeroPad(date.getUTCMinutes())}${zeroPad(date.getUTCSeconds())}${ext}`
    return path.join(os.homedir(), name)
}

const modes = {
    "schema": function () {
        const fileName = constructFileName("schema_", ".sql")
        execute(`pg_dump --username ${process.env.DB_USER} --no-password --no-owner --schema-only  --file ${fileName} ${process.env.DB_NAME} `).then(() => {
            console.log(`Successfully exported schema to: ${fileName}`)
            process.exit()
        }).catch(err => {
            console.error(`Command encountered errors.`)
            process.exit()
        })
    },
    "data": function () {
        const fileName = constructFileName("data_", ".dump")
        execute(`pg_dump --username ${process.env.DB_USER} --no-password --format=custom  --file ${fileName}  ${process.env.DB_NAME} `).then(() => {
            console.log(`Successfully exported data to: ${fileName}`)
            process.exit()
        }).catch(err => {
            console.error(`Command encountered errors.`)
            process.exit()
        })
    }
}

const mapping = {
    "--schema": modes["schema"],
    "-s": modes["schema"],
    "--data": modes["data"],
    "-d": modes["data"]
}
let file = null
let args = process.argv.slice(2)
args = args.filter((mode) => {
    const exists = Object.keys(mapping).indexOf(mode) !== -1
    if (!exists) console.warn(`Mode ${mode} is not supported and will be ignored!`)
    return exists
})

if (args.length > 0) {
    if (args.length > 1) console.warn(`Only one mode is supported! ${args[0]} will be used.Others are ignored!`)
    mapping[args[0]]()
} else {
    console.error(`Provide a valid mode, supported modes are: ${Object.keys(mapping).join(", ")} `)
}

