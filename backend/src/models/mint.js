const { Database, WriteableDatabase } = require("../utils/database.js")
const SQLUtils = require('../utils/sql.js')

class Mint {

    static async add(mint) {
        this.fixGeoJSON(mint)

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
            ${mint.location ? "ST_GeomFromGeoJSON($[location])" : null} ,
            $[uncertain],
            ${mint.uncertain_area ? "ST_GeomFromGeoJSON($[uncertain_area])" : null} ,
            $[province]
        )
        RETURNING id;`
        let result = await WriteableDatabase.one(query, mint)
        return result.id
    }



    static fixGeoJSON(obj) {
        obj["uncertain_area"] = (obj.uncertainArea) ? obj.uncertainArea.replace(/'/g, '"') : null
        delete obj.uncertainArea
        obj["location"] = (obj["location"]) ? obj.location.replace(/'/g, '"') : null
    }

    static async update(id, mint) {
        this.fixGeoJSON(mint)

        const query = `UPDATE mint 
        SET name=$[name],
        location=${mint.location ? "ST_GeomFromGeoJSON($[location])" : null} ,
        uncertain=$[uncertain],
        uncertain_area=${mint.uncertain_area ? "ST_GeomFromGeoJSON($[uncertain_area])" : null},
        province=$[province]
        WHERE id=$[id];`
        await WriteableDatabase.none(query, Object.assign({}, mint, { id }))
        return id
    }

    static async search(text) {
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


    static async list() {
        let p = await Database.manyOrNone(`
        SELECT 
        ${this.SELECT_QUERY}
         FROM ${this.name} mi
         ${this.JOIN}
         ${this.ORDER}
         `)

        return this.postProcessMany(p)
    }


    static async postProcessGet(item) {
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

    static async postProcessMany(arr) {
        arr = arr.map(item => {
            this.postProcessGet(item)
            return item
        })
        return arr
    }

    static async getById(id) {
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

        let mint = await Database.one(query, [id])

        this.postProcessGet(mint)
        return mint
    }

    static extract(result, prefix = "") {
        return {
            id: result[`${prefix}id`],
            name: result[`${prefix}name`],
            location: result[`${prefix}location`],
            yearUncertain: result[`${prefix}yearUncertain`],
            uncertainLocation: result[`${prefix}uncertainLocation`]
        }
    }

    static extractLocation(mint) {
        let location = mint.location
        mint.location = { type: "empty", coordinates: [] }
        if (location) {
            try { mint.location = JSON.parse(mint.location) } catch (e) { console.error(e) }
        }

        let uncertainLocation = mint.uncertain_area
        mint.uncertainLocation = { type: "empty", coordinates: [] }
        if (uncertainLocation) {
            try {
                let geoJSON = JSON.parse(mint.geo_uncertain_area)
                let flatPolygon = geoJSON.coordinates[0].flatMap(coords => coords)
                geoJSON.coordinates = flatPolygon
                mint.uncertainLocation = geoJSON
            } catch (e) { console.error(e) }
        }
    }

    static query({
        tableName = "mi"
    } = {}) {
        return `
        ${tableName}.id AS mint_id,
        ${tableName}.name AS mint_name,
        ${tableName}.uncertain AS mint_uncertain,
        ST_AsGeoJSON(${tableName}.uncertain_area) AS mint_uncertain_area,
        ST_AsGeoJSON( ${tableName}.location) AS mint_location,
    `
    }

    static get SELECT_QUERY() {
        return `mi.*,
        ST_AsGeoJSON(location) AS location,
        ST_AsGeoJSON(uncertain_area) AS uncertain_area,
        p.id AS province_id,
        p.name AS province_name
        `
    }

    static get JOIN() {
        return `LEFT JOIN province p ON mi.province = p.id`
    }

    static get ORDER() {
        return `ORDER BY mi.name ASC`
    }
}

module.exports = Mint