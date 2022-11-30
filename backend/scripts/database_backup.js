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
    const fileName = constructFileName(`${process.env.DB_NAME}_${name}`, ext)
    const command = `pg_dump --username ${process.env.DB_USER} --no-privileges --exclude-table-data app_user --no-password ${options}  --file ${fileName} ${process.env.DB_NAME} `
    execute(command).then(() => {
        console.log(`Successfully exported ${name} to: ${fileName}`)
        process.exit()
    }).catch(err => {
        console.error(`Command encountered errors: ${err}`)
        process.exit()
    })
}

let args = process.argv.slice(2)
const options = {
    mode: "both",
    owner: false,
    format: "custom",
    inserts: false
}

args = args.forEach(element => {
    let [key, value] = element.split("=")
    if (key && value) {
        key = key.replace("--", "")
        options[key] = value
    } else throw new Error(`Argument needs a value: ${element}`)
});

let additionalOptions = []

let name = (options.mode === "data") ? "data" : (options.mode === "schema") ? "schema" : "both"
let ext = (options.format === "custom") ? "dump" : "sql"

if (!options.owner) {
    additionalOptions.push("--no-owner")
}

if (options.mode === "schema")
    additionalOptions.push("--schema-only")
else if (options.mode === "data")
    additionalOptions.push("--data-only")

if (options.format === "custom") {
    additionalOptions.push("--format=custom")
}

if (options.inserts) {
    additionalOptions.push("--inserts")
}


dump(name, ext, additionalOptions.join(" "))


