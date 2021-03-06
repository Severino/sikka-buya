const Resolver = require("../resolver.js")
const { Database } = require("../utils/database.js")
const SQLUtils = require('../utils/sql.js')

class MintResolver extends Resolver {

    async add(_, args) {
        const data = args.data
        this.fixGeoJSON(data)

        const query = `
        INSERT INTO mint (name,
            location,
            uncertain,
            uncertain_area,
            province
            )  
        VALUES
        (
            $[name],
            ${data.location ? "ST_GeomFromGeoJSON($[location])" : null} ,
            $[uncertain],
            ${data.uncertain_area ? "ST_GeomFromGeoJSON($[uncertain_area])" : null} ,
            $[province]
        )
        RETURNING id;`
        let result = await this.request(query, data)
        return (result.length > 0) ? result[0].id : null

    }

    async update(_, args) {
        const data = args.data
        this.fixGeoJSON(data)

        if (!data.id || data.id <= 0) throw new Error("error.invalid_id")

        const query = `UPDATE mint 
        SET name=$[name],
        location=${data.location ? "ST_GeomFromGeoJSON($[location])" : null} ,
        uncertain=$[uncertain],
        uncertain_area=${data.uncertain_area ? "ST_GeomFromGeoJSON($[uncertain_area])" : null},
        province=$[province]
        WHERE id=$[id]
        RETURNING id;`
        await this.request(query, data)
        return data.id
    }


    get SELECT_QUERY() {
        return `mi.*,
        ST_AsGeoJSON(location) AS location,
        ST_AsGeoJSON(uncertain_area) AS uncertain_area,
        p.id AS province_id,
        p.name AS province_name
        `
    }

    get JOIN() {
        return `LEFT JOIN province p ON mi.province = p.id`
    }

    get ORDER() {
        return `ORDER BY mi.name ASC`
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
             `, `%${text}%`)

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
        obj["uncertain_area"] = (obj.uncertainArea) ? obj.uncertainArea.replace(/'/g, '"') : null
        delete obj.uncertainArea
        obj["location"] = (obj["location"]) ? obj.location.replace(/'/g, '"') : null
    }
}

module.exports = MintResolver