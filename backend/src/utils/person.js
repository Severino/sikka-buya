const { pgp, Database } = require('./database')
const SQLUtils = require('./sql')

class Person {

    static async searchWithoutRole(_, args) {
        args.hasRole = false
        return this.search(_, args)
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

        let query = `
            SELECT 
            person.*, 
            role.id AS role_id, 
            role.name AS role_name, 
            dynasty.id AS dynasty_id, 
            dynasty.name AS dynasty_name ,
            color.color AS color
            FROM person
            LEFT JOIN person_role role ON person.role = role.id
            LEFT JOIN dynasty ON person.dynasty = dynasty.id
            LEFT JOIN person_color color ON color.person = person.id`

        const whereClauses = []

        if (args.hasRole != null) {
            if (args.hasRole === true)
                whereClauses.push("role IS NOT NULL")
            else
                whereClauses.push("role IS NULL")
        }

        if (args.text) {
            const search = `%${args.text}%`
            whereClauses.push(`${pgp.as.format("unaccent(person.name) ILIKE $1", search)}`)
        }

        if (args.dynasty) {
            whereClauses.push(pgp.as.format("dynasty.id = $[dynasty]", args))
        }

        if (include) {
            whereClauses.push(pgp.as.format("role.name IN ($1:list) IS true", [include]))
        } else if (exclude) {
            whereClauses.push(pgp.as.format("role.name IN ($1:list) IS NOT true", [exclude]))
        }


        if(whereClauses.length > 0){
            query = `${query} WHERE ${whereClauses.join(" AND ")}`
        }

        query = `${query} ORDER BY person.name ASC`

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