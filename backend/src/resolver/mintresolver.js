const Resolver = require("../resolver.js")
const { Database } = require("../utils/database.js")

class MintResolver extends Resolver {

    async add(_, args) {
        console.log("ADD")
        this.fixGeoJSON(args.data)
        super.add(...arguments)
    }

    async update(_, args) {
        const data = args.data
        this.fixGeoJSON(data)

        if (!data.id || data.id <= 0) throw new Error("error.invalid_id")

        const query = `UPDATE mint SET name=$[name],location=ST_GeomFromGeoJSON($[location]),uncertain=$[uncertain],uncertain_area=$[uncertain_area] WHERE id=$[id]`
        return this.request(query, data)
    }

    async get(_, args) {
        let p = await Database.one(`SELECT *, ST_AsGeoJSON(location) AS location, ST_AsGeoJSON(uncertain_area) AS uncertain_area FROM ${this.name} WHERE id=$1`, [args.id])
        this.postProcessGet(p)
        return p
    }

    async search(_, args) {
        const text = args.text
        if (text) {
            let p = await Database.manyOrNone(`SELECT *, ST_AsGeoJSON(location) AS location, ST_AsGeoJSON(uncertain_area) AS uncertain_area FROM ${this.name} WHERE unaccent(name) ILIKE  unaccent($1) ORDER BY name ASC`, `%${text}%`)
            return this.postProcessGetMany(p)
        } else return []
    }

    async list(_, args) {
        let p = await Database.manyOrNone(`SELECT *, ST_AsGeoJSON(location) AS location, ST_AsGeoJSON(uncertain_area) AS uncertain_area FROM ${this.name}`, [args.id])
        return this.postProcessGetMany(p)
    }

    async postProcessGetMany(arr) {
        arr = arr.map(item => {
            this.postProcessGet(item)
            return item
        })
        return arr
    }

    async postProcessGet(item) {
        item.uncertainArea = item.uncertain_area
    }

    fixGeoJSON(obj) {

        obj["uncertain_area"] = obj.uncertainArea
        delete obj.uncertainArea

        // this.modifyGeoJSON(obj, "location")
        // this.modifyGeoJSON(obj, "uncertain_area")
        // console.log(obj)
    }

    // modifyGeoJSON(obj, key) {
    //     if (obj[key] != null) {

    //         if (typeof obj[key] == "string") {
    //             obj[key] = JSON.parse(obj[key])
    //         }

    //         console.log(obj[key])
    //         if (obj[key].type.toLowerCase() == "polygon") {
    //             let coords = []

    //             for (let i = 0; i < obj[key].coordinates.length - 1; i += 2) {
    //                 coords.push([obj[key].coordinates[i], obj[key].coordinates[i + 1]])
    //             }
    //             obj[key].coordinates = [coords]
    //         }

    //         if (obj[key].type && obj[key].type == "empty") obj[key] = null
    //         else {
    //             obj[key] = JSON.stringify(obj[key])
    //         }
    //     }
    // }
}

module.exports = MintResolver