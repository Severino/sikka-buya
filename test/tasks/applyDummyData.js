const { QueryFile } = require('pg-promise');
const { join: joinPath } = require("path")
const { readdir } = require('fs').promises;


async function applyDummyData(Database) {
    /**
   * Probably the connection times out due to the schema file being quite big.
   * Therefore we need to reconnect the db. 
   * I'm not quite certain of this (SO)
   */
    Database.connect()

    const sqlDummyDataPath = joinPath(__dirname, "..", "data")
    const dummyFiles = await readdir(sqlDummyDataPath)
    console.log(`Data files will be applied: ${dummyFiles.join(", ")}`)
    for (const file of dummyFiles) {
        const absFilePath = joinPath(sqlDummyDataPath, file)
        console.log(`Apply SQL file: ${file} / ${absFilePath}`)
        const queryFile = new QueryFile(absFilePath, { minify: true, compress: true, debug: true })
        await Database.any(queryFile)
    }
    console.log(`Dummy data applied!`)
}

module.exports = applyDummyData
