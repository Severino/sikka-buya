const { pgp } = require('../utils/database')

class Mint {
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


}

module.exports = Mint