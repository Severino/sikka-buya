
export default class StringUtils {

    static get missingText() {
        return '–'
    }

    static capitalize(str) {
        if (!str.length) return ""
        else return `${str[0].toUpperCase()}${str.substr(1).toLowerCase()}`
    }

    static removePrefix(str, prefix) {
        const regex = new RegExp(`(?:^|[^a-zA-Z]+)(${prefix})`, "g")

        let strWihtoutPrefix = str.replace(regex, "")
        if (str != strWihtoutPrefix) console.log(str, strWihtoutPrefix)
        return strWihtoutPrefix
    }

    static removeLeftHalfRing(str) {
        return str.replace("ʿ", "")
    }
}