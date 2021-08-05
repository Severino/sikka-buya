const Resolver = require("../resolver.js")
const { Database } = require("../utils/database.js")

class MintResolver extends Resolver {

    async add(_, args) {
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
        let p = await Database.one(`SELECT *, ST_AsGeoJSON(location) AS location, ST_AsGeoJSON(uncertain_area) AS geo_uncertain_area FROM ${this.name} WHERE id=$1`, [args.id])



        return p
    }

    async list(_, args) {
        let p = await Database.manyOrNone(`SELECT *, ST_AsGeoJSON(location) AS geo_location, ST_AsGeoJSON(uncertain_area) AS geo_uncertain_area FROM ${this.name}`, [args.id])

        p.forEach(mint =>
            mint.location = (mint.geo_location) ? JSON.parse(mint.geo_location) : null
        )

        return p
    }

    fixGeoJSON(obj) {

        obj["uncertain_area"] = obj.uncertainLocation
        delete obj.uncertainLocation

        this.modifyGeoJSON(obj, "location")
        this.modifyGeoJSON(obj, "uncertain_area")
    }

    modifyGeoJSON(obj, key) {
        if (obj[key] != null) {

            if (obj[key].type.toLowerCase() == "polygon") {
                let coords = []

                for (let i = 0; i < obj[key].coordinates.length - 1; i += 2) {
                    coords.push([obj[key].coordinates[i], obj[key].coordinates[i + 1]])
                }
                obj[key].coordinates = [coords]
            }

            if (obj[key].type && obj[key].type == "empty") obj[key] = null
            else {
                obj[key] = JSON.stringify(obj[key])
            }
            console.log(obj[key])
        }
    }
}

module.exports = MintResolver