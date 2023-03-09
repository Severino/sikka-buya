const Frontend = require('./frontend')
const { join, sep, normalize } = require("path")
const fs = require("fs")
const ES6Builder = require('./utils/es6-builder')
const { createDefaultImportStatements } = require('./utils/es6-builder')

class Language {

    static DEBUG_NO_WRITE = false
    static baseDir = "lang"

    static createByParts(...parts) {
        let path = Frontend.createByParts(this.baseDir, ...parts)
        return path
    }

    static getLangLocation(...parts) {
        return Frontend.getByParts(this.baseDir, ...parts)
    }

    static updateMainIndex(lang) {
        const mainFileLocation = this.getLangLocation("index.js")
        let imports = ES6Builder.getDefaultImports(mainFileLocation)
        const languages = imports.map(obj => obj.name)

        if (!languages.includes(lang)) {
            languages.push(lang)
            imports.push({name: lang, path: `./${this.createIndexFile(lang)}`})
            const imports = ES6Builder.createDefaultImportStatements(imports)
            const fileContents = ES6Builder.createFile(imports, languages)

            if (this.DEBUG_NO_WRITE)
                console.log(mainFileLocation, fileContents)
            else
                fs.writeFileSync(mainFileLocation, fileContents)
        }

    }

    static updateIndexFiles(parts, lang) {

        this.updateMainIndex(lang)

        parts = parts.slice()
        let previous = null
        while (parts.length > 0) {
            this.setIndexFile(parts, lang, previous)
            previous = parts.pop()
        }
    }

    static setIndexFile(parts, lang = null, previous = null) {
        parts = parts.slice()
        let name = parts[parts.length - 1]

        let relativeLocation
        if (previous) {
            relativeLocation = "./" + join(...parts)

        } else {
            let relativeParts = [...parts]
            relativeParts.pop()
            relativeParts.pop()
            relativeLocation = join(...relativeParts)
        }

        if (sep === "\\") relativeLocation = relativeLocation.replace(/\\/g, "/")


        parts.pop()
        let filesystemPath = this.createByParts(...parts)
        const indexFileName = this.createIndexFile(lang)
        filesystemPath = join(filesystemPath, indexFileName)

        const importPath = this.createImportPath(relativeLocation, name, lang, previous)
        const importStatement = ES6Builder.createDefaultImportStatement(name, importPath)

        let content = ""
        if (fs.existsSync(filesystemPath)) {

            const imports = ES6Builder.getDefaultImports(filesystemPath)
            const moduleSet = new Set(imports.map((mod => mod.name)))
            if (!moduleSet.has(name)) {
                moduleSet.add(name)
                imports.push({ name, path: importPath })
                const importStatements = ES6Builder.createDefaultImportStatements(imports)
                content = ES6Builder.createFile(importStatements, Array.from(moduleSet))
            }

        } else {
            content = ES6Builder.createFile([importStatement], [name])
        }

        if (this.DEBUG_NO_WRITE)
            console.log(filesystemPath, content)
        else if (content != "")
            fs.writeFileSync(filesystemPath, content)

    }

    static createImportPath(relativeLocation, name, lang, previous) {
        let filename = (previous) ? `index${lang ? `.${lang}` : ""}.js` : `${name}.${lang}.json`
        return "./" + join(relativeLocation, filename).replace(/\\/g, "/")
    }


    static createIndexFile(lang = null) {
        return `index${(lang) ? `.${lang}` : ""}.js`
    }

    static set(path, lang, singular, plural = null) {
        const pathParts = path.split(".")
        if (pathParts.length < 2) throw new Error(`Path is to short: It needs the form 'some.path.to.file.key' and the file and key part are required.`)
        const key = pathParts.pop()
        const file = pathParts.pop()
        const dirPath = this.createByParts(...pathParts)
        const filePath = join(dirPath, this.createFileName(file, lang))
        let json = {}
        if (fs.existsSync(filePath)) {
            const file = fs.readFileSync(filePath)
            json = JSON.parse(file)
        }


        this.updateIndexFiles([...pathParts, file], lang)
        json[key] = (plural) ? `${singular} | ${plural} ` : singular

        if (this.DEBUG_NO_WRITE)
            console.log(filePath, json)
        else
            fs.writeFileSync(filePath, JSON.stringify(json))

    }

    static createFileName(name, lang) {
        return `${name}.${lang}.json`
    }

}

module.exports = Language