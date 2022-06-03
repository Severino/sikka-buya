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
    const name = `${prefix}_${date.getUTCFullYear()}${zeroPad(date.getUTCMonth() + 1)}${zeroPad(date.getUTCDate())}T${zeroPad(date.getUTCHours())}${zeroPad(date.getUTCMinutes())}${zeroPad(date.getUTCSeconds())}.${ext}`
    return path.join(os.homedir(), name)
}

function dump(name, ext, options) {
    const fileName = constructFileName(name, ext)
    const command = `pg_dump --username ${process.env.DB_USER} --no-password ${options} --file ${fileName} ${process.env.DB_NAME} --exclude-table-data app_user`
    execute(command).then(() => {
        console.log(`Successfully exported ${name} to: ${fileName}`)
        process.exit()
    }).catch(err => {
        console.error(`Command encountered errors.`)
        process.exit()
    })
}

const modes = {
    "schema": function () {
        dump("schema", "sql", "--no-owner --schema-only")
    },
    "data": function () {
        dump("data", "dump", "--format=custom --data-only")
    },
    "default": function () {
        dump("database", "dump", "--format=custom")
    }
}

const mapping = {
    "--schema": modes["schema"],
    "-s": modes["schema"],
    "--data": modes["data"],
    "-d": modes["data"]
}


let args = process.argv.slice(2)
args = args.filter((mode) => {
    const exists = Object.keys(mapping).indexOf(mode) !== -1
    if (!exists) console.warn(`Mode ${mode} is not supported and will be ignored!`)
    return exists
})

if (args.length === 0) {
    modes["default"]()
} else {
    if (args.length > 1) console.warn(`Only one mode is supported! ${args[0]} will be used.Others are ignored!`)
    mapping[args[0]]()
}

