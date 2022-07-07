const { pgp, Database } = require('./database')
const SQLUtils = require('./sql')

class Person {

    static async searchWithoutRole(_, args) {
        const searchString = args.text
        let result = await Database.manyOrNone(`
SELECT * FROM person WHERE role IS NULL AND unaccent(name) ILIKE $1 ORDER BY name ASC
LIMIT ${process.env.MAX_SEARCH}
`, `%${searchString}%`)

        result.forEach((item, idx) => {
            result[idx]["role"] = { id: null, name: null }
        })

        console.log(result)
        return result
    }

    static async searchCaliph(_, args) {
        args.include = ["caliph"]
        return this.searchWithRole(_, args)
    }

    static async searchWithRole(_, args) {
        args.hasRole = true
        return this.search(_, args)
    }


    static async search(_, args) {
        const include = args.include
        const exclude = args.exclude

        let query = pgp.as.format(`
    SELECT 
    p.*, 
    r.id AS role_id, 
    r.name AS role_name, 
    d.id AS dynasty_id, 
    d.name AS dynasty_name ,
    c.color AS color
    FROM person p
    LEFT JOIN person_role r ON p.role = r.id
    LEFT JOIN dynasty d ON p.dynasty = d.id
    LEFT JOIN person_color c ON c.person = p.id
    WHERE r 
    ${args.hasRole ? "IS NOT NULL" : "IS NULL"}`)

        if (args.text) {
            const search = `%${args.text}%`
            query = `${query} ${pgp.as.format("AND unaccent(p.name) ILIKE $1", search)}`
        }


        if (include) {
            query = `${query} ${pgp.as.format("AND r.name IN ($1:list) IS true", include)}`
        } else if (exclude) {
            query = `${query} ${pgp.as.format("AND r.name IN ($1:list) IS NOT true", exclude)}`
        }

        query = `${query} ORDER BY p.name ASC`

        let result = await Database.manyOrNone(query)

        result.forEach((item, idx) => {

            result[idx].shortName = result[idx].short_name

            result[idx] = SQLUtils.objectifyBulk(item, [{
                prefix: "role_",
                target: "role",
                keys: ["id", "name"]
            }, {
                prefix: "dynasty_",
                target: "dynasty",
                keys: ["id", "name"]
            }])
        })

        return result
    }
}

module.exports = Person