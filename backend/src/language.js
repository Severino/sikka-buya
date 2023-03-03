const Frontend = require('./frontend')
const { join, sep, normalize } = require("path")
const fs = require("fs")

class Language {

    static baseDir = "lang"

    static createByParts(parts) {
        let allParts = [this.baseDir, ...parts]
        let path = Frontend.createByParts(allParts)
        return path
    }

    static updateIndexFiles(parts, lang) {
        parts = parts.slice()
        let previous = null
        while (parts.length > 0) {
            this.setIndexFile(parts, lang, previous)
            previous = parts.pop()
        }

        // this.setIndexFile([], lang, previous)

    }

    static setIndexFile(parts, lang = null, previous = null) {
        parts = parts.slice()
        let name = parts[parts.length - 1]

        let relativeLocation
        if (previous) {
            relativeLocation = join(this.baseDir, ...parts)
        } else {
            let relativeParts = [this.baseDir, ...parts]
            relativeParts.pop()
            relativeLocation = join(...relativeParts)

        }

        if (sep === "\\") relativeLocation = relativeLocation.replace(/\\/g, "/")


        parts.pop()
        let filesystemPath = this.createByParts(parts)
        const indexFileName = this.createIndexFile(lang)
        filesystemPath = join(filesystemPath, indexFileName)

        let content = ""
        if (fs.existsSync(filesystemPath)) {

            const file = fs.readFileSync(filesystemPath, { encoding: "utf-8" })
            const moduleString = file.match(/export\s+default.+{(.*)}/s)

            const moduleSet = new Set(moduleString[1].split(",").map(mod => mod.trim()).filter(str => str != ""))

            if (!moduleSet.has(name)) {
                moduleSet.add(name)

                const imports = []
                for (let module of Array.from(moduleSet)) {
                    imports.push(this.createImportStatement(relativeLocation, module, lang, previous))
                }

                content = `${imports.join("\n")}\nexport default {\n${Array.from(moduleSet).map(mod => `\t${mod}`).join(",\n")},\n}`
            }

        } else {
            const importStatement = this.createImportStatement(relativeLocation, name, lang, previous)
            content = `${importStatement}\nexport default {\n\t${name},\n}`
        }

        if (content != "")
            fs.writeFileSync(filesystemPath, content)
    }

    static createImportStatement(relativeLocation, name, lang, previous) {
        return (previous) ?
            `import {default as ${name}} from "${relativeLocation}/index${lang ? `.${lang}` : ""}.js"` :
            `import {default as ${name}} from "${relativeLocation}/${name}.${lang}.json"`
    }

    static writeIndexFile() {

    }

    static createIndexFile(lang = null) {
        return `index${(lang) ? `.${lang}` : ""}.js`
    }

    static set(path, lang, singular, plural = null) {
        const pathParts = path.split(".")
        if (pathParts.length < 2) throw new Error(`Path is to short: It needs the form 'some.path.to.file.key' and the file and key part are required.`)
        const key = pathParts.pop()
        const file = pathParts.pop()
        const dirPath = this.createByParts(pathParts)
        const filePath = join(dirPath, this.createFileName(file, lang))
        let json = {}
        if (fs.existsSync(filePath)) {
            const file = fs.readFileSync(filePath)
            json = JSON.parse(file)
        }


        this.updateIndexFiles([...pathParts, file], lang)
        json[key] = (plural) ? `${singular} | ${plural} ` : singular
        fs.writeFileSync(filePath, JSON.stringify(json))
    }

    static createFileName(name, lang) {
        return `${name}.${lang}.json`
    }

}

module.exports = Language