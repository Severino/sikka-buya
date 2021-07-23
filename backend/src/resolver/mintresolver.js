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

        console.log(args.uncertain_area)
        const query = `UPDATE mint SET name=$[name],location=ST_GeomFromGeoJSON($[location]),uncertain=$[uncertain],uncertain_area=$[uncertain_area] WHERE id=$[id]`
        return this.request(query, data)
    }

    async get(_, args) {
        console.log("GET MINT!")
        let p = await Database.one(`SELECT *, ST_AsGeoJSON(location) AS geo_location, ST_AsGeoJSON(uncertain_area) AS geo_uncertain_area FROM ${this.name} WHERE id=$1`, [args.id])

        let location = p.location
        p.location = { type: "empty", coordinates: [] }
        if (location) {
            try { p.location = JSON.parse(p.geo_location) } catch (e) { console.error(e) }
        }

        let uncertainLocation = p.uncertain_area
        p.uncertainLocation = { type: "empty", coordinates: [] }
        if (uncertainLocation) {
            try {
                let geoJSON = JSON.parse(p.geo_uncertain_area)
                let flatPolygon = geoJSON.coordinates[0].flatMap(coords => coords)
                geoJSON.coordinates = flatPolygon
                p.uncertainLocation = geoJSON
            } catch (e) { console.error(e) }
        }

        console.log(p)
        return p
    }

    fixGeoJSON(obj) {

        obj["uncertain_area"] = obj.uncertainLocation
        delete obj.uncertainLocation

        console.log(obj)
        this.modifyGeoJSON(obj, "location")
        this.modifyGeoJSON(obj, "uncertain_area")
    }

    modifyGeoJSON(obj, key) {
        if (obj[key] != null) {

            if (obj[key].type.toLowerCase() == "polygon") {
                let coords = []
                console.log("TRANSFORM POLYGON")
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
    //     console.log(obj[key], obj[key].type)

    //     if (obj[key] == null) return;

    //     if (obj[key] && obj[key].type) {
    //         switch (obj[key].type.toLowerCase()) {
    //             case "point":
    //                 obj[key] = `POINT(${obj[key].coordinates.slice(0, 2).join(" ")})`
    //                 break;
    //             case "polygon":
    //                 obj[key] = `POLYGON(${obj[key].coordinates.slice().join(" ")} ${obj[key].coordinates.slice(-2).join(" ")})`
    //                 break;
    //             default:
    //                 throw new Error(`Unsupported GeoJSON type : ${obj[key]?.type}.`)
    //         }
    //     } else throw new Error(`Invalid GeoJSON type : ${obj[key]?.type}.`)
    // } 

}

module.exports = MintResolver