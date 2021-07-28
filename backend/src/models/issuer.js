import SQLUtils from "../utils/sql"

export default class Issuer {
    extract(result, prefix = "") {

        const config = [
            {
                prefix: `${prefix}person_`,
                target: "person",
                keys: ["id", "name", "role"]
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