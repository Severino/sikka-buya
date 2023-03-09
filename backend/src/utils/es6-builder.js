const fs = require("fs")

class ES6Builder {

    static getDefaultImports(filepath) {
        const file = fs.readFileSync(filepath, { encoding: "utf-8" })
        const importsString = file.matchAll(/\s*import\s*{\s*default\s+as\s+(.*?)\s*}.*?from\s+"(.*)"/g)
        return Array.from(importsString).filter(res => res[1] != null && res[1] != "").map((res) => {
            return {
                name: res[1], path: res[2]
            }
        })
    }

    /**
     * Get's the default imported modules by name.
     * 
     * Currently only works for: import { default as _name } from "_src_"
     * 
     * @param {string} filepath - Location of the file to use.
     * @returns 
     */
    static getDefaultImportNames(filepath) {
        return this.getDefaultImports(filepath).map(obj => obj.name)
    }

    /**
     * Creates a import string with the default name 'name' from the file path at 'file'.
     * 
     * @param {string} name 
     * @param {string} file - uri to the file
     * @returns string
     */
    static createDefaultImportStatement(name, file) {
        return `import {default as ${name}} from "${file}"`
    }


    static createDefaultImportStatements(arr) {
        const imports = []
        arr.forEach(({ name, path } = {}) => {
            imports.push(this.createDefaultImportStatement(name, path))
        })

        return imports
    }

    /**
     * Creates the export object from a JS object. If the value of a given key is null, 
     * the key is used as the name of the object.
     * 
     * @param {object} exports 
     * @returns string 
     */
    static createDefaultExportObject(exports) {
        return `export default {\n${Object.entries(exports).map(([key, value]) => value ? `\t${key}: ${value}` : `\t${key}`).join(",\n")},\n}`
    }

    /**
     * Creates the file text for given imports and exports.
     * 
     * @param {array} imports - Arrays of all the imports. 
     * @param {array | object} exports - Object of all the exports or alternatively an array of all the keys.
     * @returns string
     */
    static createFile(imports, exports) {

        if (Array.isArray(exports))
            exports = exports.reduce((obj, value) => {
                obj[value] = null
                return obj
            }, {})

        return `${imports.join("\n")}\n\n${this.createDefaultExportObject(exports)}\n`
    }

}

module.exports = ES6Builder