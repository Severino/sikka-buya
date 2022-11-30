const cliProgress = require('cli-progress')
const _colors = require("colors")
const fs = require("fs")
const path = require("path")
const { Database, pgp } = require("../../src/utils/database")

class TypeIterator {
    constructor(name, {
        logDir = "logs",
        logFileName = null,
        onStart = null,
        onEach = null
    } = {}) {
        this.progress = new cliProgress.SingleBar({
            format: '{name} |' + _colors.brightGreen('{bar}') + '| {percentage}% [{value}/{total}]',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            hideCursor: true
        })

        this.name = name
        this.logFileName = logFileName
        this.logDir = path.join(__dirname, logDir)
        this.onStart = onStart
        this.onEach = onEach
    }



    async exec() {
        console.log(`Execute '${this.name}' ...`)
        let { writeStream, errorousTypes } = await this.start()

        let items = await this.getTypesList()

        await this.loop(items)

        let exitMessage = ""
        if (errorousTypes == 0) {
            exitMessage = "\n\nFinished successfully without any erros!\n"
        } else {
            exitMessage = `\n\nFinished, but encountered ${errorousTypes} types that had errors.`
            if (this.logging) {
                exitMessage += `Check the logfile for more details:\n${this.logFile}.\n`
            }
        }
        if (this.logging) {
            writeStream.write(exitMessage)
            writeStream.end()
        }

        console.log("Updated all types.\nThanks for keeping SIKKA:BUYA up to date!")

    }

    async start() {
        let writeStream;
        if (this.logging) {
            this.logFile = path.join(this.logDir, `${this.logFileName}_${new Date().toISOString().replace(/[:\.]/g, "-")}.txt`)
            this.createLoggingFolderIfMissing()
            writeStream = fs.createWriteStream(this.logFile, { flags: "a" })
        }

        let errorousTypes = 0
        await this.callEvent("onStart")
        return { writeStream, errorousTypes }
    }

    async loop(items) {
        this.progress.start(items.length, 0)

        for (let [index, type] of items.entries()) {
            const obj = await this.callEvent("onEach", type, index) || {}
            obj.name = this.name
            this.progress.update(index + 1, obj)
        }

        this.progress.stop()
    }

    async getTypesList() {
        return await Database.manyOrNone(`SELECT * FROM type`)
    }

    get availableEvents() {
        return ["onStart", "onEach"]
    }

    callEvent(eventName, ...args) {
        if (this.availableEvents.indexOf(eventName) == -1) this.logError(`Event '${eventName}' is not supported!`)
        else {
            if (typeof (this[eventName]) == "function")
                return this[eventName](...args)
        }
    }

    on(eventName, callback) {
        eventName = eventName.toLowerCase().trim()
        const validEvents = ["start", "each"]
        if (validEvents.indexOf(eventName) == -1) {
            this.logError(`Event ${eventName} is not supported!`)
        } else {
            const functionName = "on" + eventName[0].toUpperCase() + eventName.slice(1)
            this[functionName] = callback
        }
        return this
    }

    get logging() {
        return this.logFileName !== null
    }

    logError(e) {
        throw new Error(e)
    }



    createLoggingFolderIfMissing() {
        if (!fs.existsSync(this.logDir)) {
            console.log("Create log directory...")
            fs.mkdirSync(this.logDir)
        }
    }
}


module.exports = TypeIterator