export default class Web {
    static extractDomainName(str) {
        const match = str.match(/^https?:\/\/(?:www.)?(.+?)\/?$/g)
        return match[1] || null
    }
}