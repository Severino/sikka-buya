const Frontend = require('./frontend')
const fs = require("fs")
const { join } = require('path')

class Language {

    static baseDir = join("..", "data", "lang")

    static init() {
        fs.mkdirSync(join(__dirname, this.baseDir), { recursive: true })
    }

    static getLanguageFile(lang) {
        return join(__dirname, this.baseDir, this.getLanguageFileName(lang))
    }

    static getLanguageFileName(lang) {
        return `${lang}.json`
    }

    static set(path, lang, singular, plural) {
        const file = Language.getLanguageFile(lang)

        let obj = {}
        if (fs.existsSync(file)) {
            let txt = fs.readFileSync(file)
            obj = JSON.parse(txt)
        }

        let target = obj
        const parts = path.split(".")
        if (parts.length < 2) throw new Error("Path is too short!")
        let key = parts.pop()

        parts.forEach(part => {
            if (!target[part]) {
                target[part] = {}
            }
            target = target[part]
        });
        let value = singular
        if (plural) value = `${singular} | ${plural}`
        target[key] = value
        fs.writeFileSync(file, JSON.stringify(obj))
    }

    static get messages() {
        const base = join(__dirname, this.baseDir)
        const list = fs.readdirSync(base)

        const i18n = {}
        list.forEach(languageFile => {
            const [lang] = languageFile.split(".")
            const txt = fs.readFileSync(join(base, languageFile))
            try {
                const obj = JSON.parse(txt)
                i18n[lang] = obj
            } catch (e) {
                console.error(e)
            }
        })

        return JSON.stringify(i18n)
    }
}

module.exports = Language