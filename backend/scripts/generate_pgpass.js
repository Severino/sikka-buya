/**
 * Create the .pgpass file (pgpass.conf on windows) from 
 * the .env file.
 */

const path = require('path')
const readline = require("readline")
const fs = require("fs").promises
const util = require("util")
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = util.promisify(rl.question).bind(rl)
const os = require("os");

let envFiles = ["../.env", "../../test/.env"]

const fileExists = async function (file) {
    return new Promise((resolve) => {
        fs.access(file, fs.F_OK)
            .then(() => resolve(true))
            .catch(() => resolve(false))
    })
}

async function main() {
    let confirm = await question(`This script will expose the database data stored in the envFiles (${envFiles.join(", ")}) and store it in a .pgpass file in the user's home directory.\nAre you sure you want to continue? [y/n]`)
    envFiles = envFiles.map(file => path.join(__dirname, file))

    let pg_pass_lines = []
    for (let envFile of envFiles) {
        const result = await fileExists(envFile)

        // confirm = confirm.toLowerCase()
        if (!(confirm === "y" || confirm === "yes")) {
            throw new Error(`User aborted the operation.`)
        }
        if (!result) throw new Error(`Make sure to setup an .env file at ${envFile}`)

        const fileText = await fs.readFile(envFile, { encoding: "utf-8" })
        const lines = fileText.split(os.EOL)
        const config = {
            DB_USER: null,
            DB_HOST: null,
            DB_NAME: null,
            DB_PASSWORD: null,
            DB_PORT: null,
        }

        lines.forEach(line => {
            parts = line.split("=")
            if (parts.length >= 2) {
                const name = parts[0].trim()
                const val = parts[1].trim()
                if (config[name] !== undefined) {
                    config[name] = val
                }
            }
        })

        pg_pass_lines.push([config.DB_HOST, config.DB_PORT, config.DB_NAME, config.DB_USER, config.DB_PASSWORD].join(":"))
    }


    let pgPassPath = null
    switch (os.platform()) {
        case "win32":
            pgPassPath = path.join(os.homedir(), "AppData", "Roaming", "postgresql", "pgpass.conf");
            await fs.mkdir(path.dirname(pgPassPath), { recursive: true })
            break;
        case "linux": pgPassPath = path.join(os.homedir(), ".pgpass"); break;
        default:
            throw new Error(`You are on a unsupported platform!`)
    }

    await fs.writeFile(pgPassPath, pg_pass_lines.join(os.EOL))
    console.log(`Successfully wrote the pgpass file to '${pgPassPath}'.`)
}

main()
    .then(() => {
        console.log('Progam exited correctly.')
        process.exit()
    }).catch((e) => {
        console.error(e)
        process.exit()
    })