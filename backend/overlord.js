const SQLUtils = require("./src/utils/sql")

class Overlord {

    static extractList(arr, options){
        arr.forEach((obj, idx) => {
            arr[idx] = this.extract(obj, options)
            console.log("ASDASD", arr[idx])
        });
        return arr
    }

    static extract(result) {
        const config = [
            {
                prefix: `person_`,
                target: null,
                keys: ["id", "name", "role", "rank"]
            }
        ]

        SQLUtils.objectifyBulk(result, config)

        const arrays = [
            {
                target: "honorifics",
                prefix: `honorific_`,
                keys: ["ids", "names"],
                to: ["id", "name"]
            },
            {
                target: "titles",
                prefix: `title_`,
                keys: ["ids", "names"],
                to: ["id", "name"]
            },
        ]

        SQLUtils.listifyBulk(result, arrays)

        return result
    }
}

module.exports = Overlord