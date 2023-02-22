const path = require("path")
const fs = require("fs")
const { createDirectoryStructure } = require('./utils/dir-builder')
const { finished } = require('stream/promises')

class CMS {

    static get config() {
        return {
            data: {
                cms: {
                    images: true
                }
            }
        }
    }

    static init() {
        if (process.env.RELATIVE_FRONTEND_PUBLIC_LOCATION) {
            process.env.FRONTEND_PUBLIC_LOCATION = path.join(__dirname, "..", process.env.RELATIVE_FRONTEND_PUBLIC_LOCATION)
        } else if (!process.env.FRONTEND_PUBLIC_LOCATION) {
            throw new Error("Frontend location not set in .env file. Please set either RELATIVE_FRONTEND_PUBLIC_LOCATION or FRONTEND_PUBLIC_LOCATION")
        }

        if (!fs.existsSync(process.env.FRONTEND_PUBLIC_LOCATION)) {
            throw new Error("Frontend location is invalid this path does not exist: " + process.env.FRONTEND_PUBLIC_LOCATION)
        }

        createDirectoryStructure(process.env.FRONTEND_PUBLIC_LOCATION, this.config)

    }

    static getPublicPath(...parts) {
        return path.join("/data", ...parts)
    }

    static get dataPath() {
        return path.join(process.env.FRONTEND_PUBLIC_LOCATION, "data")
    }

    /**
     * 
     * @param {array} parts - takes the path as array 
     */
    static getDataPath(...parts) {
        return path.join(this.dataPath, ...parts)
    }

    static async findFilesAt(parts, key, extensions = ["png", "jpg", "jpeg"]) {
        const path = CMS.getDataPath(...parts)
        console.log(path)
        const files = await fs.promises.readdir(path)
        console.log(files)
        let regex = new RegExp(`^${key}.(${extensions.join("|")})$`, 'g')
        const matches = files.filter((fileName) => {
            return fileName.match(regex)
        })
        return matches
    }

    static async writeFileFromPromise(parts, filename, promise) {
        const fileStream = await promise.promise
        const ext = path.extname(fileStream.filename)
        const fileURI = this.getDataPath(...parts, filename + ext)

        const stream = fileStream.createReadStream()
        const writeStream = fs.createWriteStream(fileURI)
        stream.pipe(writeStream)
        await finished(writeStream)
        return fileURI
    }

    /**
     * 
     * @param {array} parts - path as array to directory
     * @param {string} filename - filename without extension
     * @param {array*} extensions - array of filenames (optional)  
     */
    static async removeExistingFiles(parts, filename, extensions = ["png", "jpg", "jpeg"]) {
        const files = await this.findFilesAt(parts, filename, extensions)

        for (let file of files) {
            const absoluteFilePath = this.getDataPath(...parts, file)
            await fs.promises.unlink(absoluteFilePath)
        }

    }

    static get identityPathSeparator() {
        return "[$]"
    }

    static decomposeIdentity(identity) {
        const parts = identity.split(this.identityPathSeparator)
        const filename = parts.pop()
        return { parts, filename }
    }
}

module.exports = CMS