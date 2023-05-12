
require("dotenv").config()
const { WriteableDatabase } = require('../backend/src/utils/database')
const { recreateTestDatabase } = require('./tasks/setup')


async function main() {
    await recreateTestDatabase()

    WriteableDatabase.one("SHOW LC_COLLATE").then((result) => {
        console.log(result)
    }).catch((e) => { console.error(e) })
}

main().catch((e) => { console.error(e) })


