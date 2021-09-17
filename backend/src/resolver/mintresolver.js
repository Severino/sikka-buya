const Resolver = require("../resolver.js")
const { Database } = require("../utils/database.js")
const SQLUtils = require('../utils/sql.js')

class MintResolver extends Resolver {

    async add(_, args) {
        this.fixGeoJSON(args.data)
        super.add(...arguments)
    }

    async update(_, args) {
        const data = args.data
        this.fixGeoJSON(data)

        if (!data.id || data.id <= 0) throw new Error("error.invalid_id")

        const query = `UPDATE mint 
        SET name=$[name],
        location=ST_GeomFromGeoJSON($[location]),
        uncertain=$[uncertain],
        uncertain_area=$[uncertain_area],
        province=$[province]
        WHERE id=$[id]`
        return this.request(query, data)
    }


    get SELECT_QUERY() {
        return `mi.*,
        ST_AsGeoJSON(location) AS location,
        ST_AsGeoJSON(uncertain_area) AS uncertain_area,
        p.id AS province_id,
        p.name AS province_name`
    }

    get JOIN() {
        return `LEFT JOIN province p ON mi.province = p.id`
    }

    get ORDER() {
        return `ORDER BY mi.name ASC`
    }

    get LIMIT() {
        return `LIMIT ${process.env.MAX_SEARCH}`
    }

    async get(_, args) {

        const query = `
        SELECT 
        mi.*,
        ST_AsGeoJSON(location) AS location,
        ST_AsGeoJSON(uncertain_area) AS uncertain_area,
        p.id AS province_id,
        p.name AS province_name
        FROM ${this.name} mi
        ${this.JOIN}
        WHERE mi.id=$1;`

        let mint = await Database.one(query, [args.id])

        this.postProcessGet(mint)
        return mint
    }

    async search(_, args) {
        const text = args.text

        if (text == '' || text) {
            let p = await Database.manyOrNone(`
            SELECT 
            ${this.SELECT_QUERY}
             FROM ${this.name} mi
             ${this.JOIN}
             WHERE unaccent(mi.name) ILIKE  unaccent($1) 
             ${this.ORDER}
            ${this.LIMIT}`, `%${text}%`)

            return this.postProcessMany(p)
        } else return []
    }

    async list(_, args) {
        let p = await Database.manyOrNone(`
        SELECT 
        ${this.SELECT_QUERY}
         FROM ${this.name} mi
         ${this.JOIN}
         ${this.ORDER}
         ${this.LIMIT}
         `, [args.id])

        return this.postProcessMany(p)
    }

    async postProcessMany(arr) {
        arr = arr.map(item => {
            this.postProcessGet(item)
            return item
        })
        return arr
    }

    async postProcessGet(item) {
        item.uncertainArea = item.uncertain_area

        item = SQLUtils.objectify(item, {
            prefix: "province_",
            target: "province",
            keys: [
                "name",
                "id"
            ]
        })

        return item
    }

    fixGeoJSON(obj) {

        obj["uncertain_area"] = obj.uncertainArea
        delete obj.uncertainArea

    }
}

module.exports = MintResolver