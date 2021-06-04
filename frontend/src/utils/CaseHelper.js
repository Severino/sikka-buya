

export default class CaseHelper {
    static camelToSnake(a,b){
        return a.replace(/([A-Z])/g, (match)=>{
            return `_${match.toLowerCase()}`
        })
    }
}


