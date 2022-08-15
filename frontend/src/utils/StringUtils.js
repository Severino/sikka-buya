
export default class StringUtils {

    static get missingText() {
        return '–'
    }

    static capitalize(str) {
        if (!str.length) return ""
        else return `${str[0].toUpperCase()}${str.substr(1).toLowerCase()}`
    }

    static removeAlPrefix(str) {
        return str.replace("al-", "")
    }

    static removeLeftHalfRing(str) {
        return str.replace("ʿ", "")
    }
}