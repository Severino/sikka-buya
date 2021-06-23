export default class Web {
    static extractDomainName(str){
        const match = str.match(/^https?:\/\/(?:www.)?(.+?)\/?$/g)
        console.log(match)
        return match[1] || null
    }
}