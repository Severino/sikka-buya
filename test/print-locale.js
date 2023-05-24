
require("dotenv").config()
const { WriteableDatabase } = require('../backend/src/utils/database')
const { createTestDatabaseIfNecessary } = require('./tasks/setup')


async function main() {
    await createTestDatabaseIfNecessary()

    WriteableDatabase.one("SHOW LC_COLLATE").then((result) => {
        console.log(result)
    }).catch((e) => { console.error(e) })
}

main().catch((e) => { console.error(e) })


