
export default class StringUtils {

    static get missingText() {
        return '–'
    }

    static clip(str, length, ellipsis = '…') {
        if (str.length > length) {
            return str.substr(0, length) + ellipsis
        }
        return str
    }

    static capitalize(str) {
        if (!str.length) return ""
        else return `${str[0].toUpperCase()}${str.substr(1).toLowerCase()}`
    }

    static removePrefix(str, prefix) {
        const regex = new RegExp(`^(?:^|[^a-zA-Z]+)(${prefix})`, "g")
        let strWihtoutPrefix = str.replace(regex, "")
        return strWihtoutPrefix
    }

    static removeSpecialCharacters(str) {
        return str.replace(/[ʿ*]/g, "")
    }
}