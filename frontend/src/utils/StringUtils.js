
export default class StringUtils {
    static capitalize(str) {
        if (!str.length) return ""
        else return `${str[0].toUpperCase()}${str.substr(1).toLowerCase()}`
    }
}