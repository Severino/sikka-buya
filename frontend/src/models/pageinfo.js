export default class PageInfo {

    static attributes = [
        "count",
        "page",
        "last",
        "total",
    ]

    static equals(a, b) {

        return this.attributes.every(key => {
            return a[key] === b[key]
        })
    }

    static isPageInfo(obj) {
        return this.attributes.every(key => {
            return obj[key] != null
        })
    }
}