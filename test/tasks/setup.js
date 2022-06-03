const { join: joinPath } = require("path");
const start = require('../../backend/express');
const { Database, QueryFile, QueryFileMap, getQueryFile, addQueryFile } = require('../../backend/src/utils/database');
const { readdir } = require('fs').promises;


const SuperDatabase = Database.$config.pgp({
    host: process.env.DB_HOST,
    database: process.env.DB_SUPER_NAME,
    user: process.env.DB_SUPER_USER,
    password: process.env.DB_SUPER_PASSWORD,
    port: process.env.DB_PORT,
    allowExitOnIdle: true
})

let resetLock = false

async function createTestDatabaseIfNecesarry() {
    const { count } = await SuperDatabase.one("SELECT count(*) FROM pg_database WHERE datname=$1", Database.$cn.database)
    if (count == 0) {
        await createTestDatabase()
    }
}

async function createTestDatabase() {
    await SuperDatabase.one("CREATE DATABASE $1:name", Database.$cn.database)
}

async function resetTestDatabase(backupFile) {

    if (!resetLock) {
        resetLock = true
        try {
            await createTestDatabaseIfNecesarry()

            // Taken from Thirumal:
            // https://dba.stackexchange.com/questions/154061/delete-all-data-in-postgres-database
            await Database.manyOrNone(`
            DROP SCHEMA public CASCADE;
            CREATE SCHEMA public;
            GRANT ALL ON SCHEMA public TO postgres;
            GRANT ALL ON SCHEMA public TO public;
            `)

            const migrationPath = joinPath(__dirname, "..", "..", "backend")
            backupFilePath = backupFile || joinPath(migrationPath, "schema.sql")
            await applySchemaFile(Database, backupFilePath)
            resetLock = false
        } catch (e) {
            resetLock = false
            throw new Error(`Could not reset database: ${e}`)
        }

    } else {
        throw new Error("Resetting is locked!")
    }
}

async function applyDummyData() {
    /**
   * Probably the connection times out due to the schema file being quite big. 
   * Therefore we need to reconnect the db. 
   * I'm not quite certain of this (SO) 
   */
    const sqlDummyDataPath = joinPath(__dirname, "..", "data")
    const dummyFiles = await readdir(sqlDummyDataPath)
    console.log(`Data files will be applied: ${dummyFiles.join(", ")}`)
    for (const file of dummyFiles) {
        const absFilePath = joinPath(sqlDummyDataPath, file)
        console.log(`Apply SQL file: ${file} / ${absFilePath}`)
        await applySchemaFile(Database, absFilePath)
    }
    console.log(`Dummy data applied!`)
}

async function applySchemaFile(db, file) {
    /**
   * (a) I did use the QueryFile successfully until it stopped working
   * with the error message: 'Fatal error: Invalid query format.'
   * 
   * It is rumored that using different versions of pg-promise causes this issue.
   * I couldn't get it to work after reinstalling pg-promise with a fixed version 
   * in the package json files. 
   * 
   * For the meantime, I think it's fine to just read the file manually. (SO)
   * 
   */

    let dbSchemaFile = getQueryFile(file)
    if (!dbSchemaFile) {
        dbSchemaFile = new QueryFile(file, { minify: true, compress: true, debug: true })
        addQueryFile(file, dbSchemaFile)
    }

    await db.none(dbSchemaFile)
    return true
}

async function setupTestDatabase() {
    return new Promise((resolve, reject) => {
        resetTestDatabase().then(db => {
            applyDummyData(db).then(resolve).catch(reject)
        }).catch(reject)
    })
}

async function runBackendServer() {
    return start({
        dbUser: process.env.DB_USER,
        dbPassword: process.env.DB_PASSWORD,
        dbPort: process.env.DB_PORT,
        dbHost: process.env.DB_HOST,
        dbName: process.env.DB_NAME,
        expressPort: 4000,
        jwtSecret: "totally_secure_test_secret",
        testEnvironment: true
    })
}


module.exports = { applyDummyData, resetTestDatabase, setupTestDatabase, runBackendServer }