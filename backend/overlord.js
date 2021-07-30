const SQLUtils = require("./src/utils/sql")

class Overlord {

    static extract(result, {
        target = null,
        prefix = "" } = {}) {

        const config = [
            {
                prefix: `${prefix}`,
                target: target,
                keys: ["role", "rank"]
            }
        ]

        SQLUtils.objectifyBulk(result, config)

        const arrays = [
            {
                target: "honorifics",
                prefix: `${prefix}honorific_`,
                keys: ["ids", "names"],
                to: ["id", "name"]
            },
            {
                target: "titles",
                prefix: `${prefix}title_`,
                keys: ["ids", "names"],
                to: ["id", "name"]
            },
        ]

        SQLUtils.listifyBulk(result, arrays)

        return result
    }
}

module.exports = Overlord