const { ColumnSet } = require("pg-promise");
const { DB_FIELDS, ALLOWED_STYLES } = require("../constants/html_formatted_fields");
const { Database, pgp } = require("../src/utils/database");
const HTMLSanitizer = require("../src/utils/HTMLSanitizer");
const fs = require("fs")
const path = require("path")

async function main() {

    const changesOverview = []
    const detailsOld = []
    const detailsNew = []


    const limit = 10
    let offset = 0

    const serviceColumns = [
        "id",
        "project_id",
    ]

    let results
    do {
        results = await Database.manyOrNone(`
    SELECT ${[...serviceColumns, ...DB_FIELDS].join(", ")} from type
    LIMIT $[limit]
    OFFSET $[offset]
`, { limit, offset })

        offset += limit

        for (let result of Object.values(results)) {
            updateData = {}

            let overviewEntry = {
                id: result.id,
                name: result.project_id,
                felder: []
            }

            let detailsOldEntry = {
                id: result.id,
                name: result.project_id,
                felder: {}
            }

            let detailsNewEntry = {
                id: result.id,
                name: result.project_id,
                felder: {}
            }

            for (let col of Object.values(DB_FIELDS)) {
                let field = result[col]
                let updated = HTMLSanitizer.sanitize(field, ...ALLOWED_STYLES)
                updated = removeComments(updated)

                // // let xml = removeXML(updated)
                // if (uncommented != updated) {
                //     const fileName = result.project_id.replace("?", "Q") + "_" + col + ".html"
                //     // fs.writeFileSync(path.join(__dirname, "out", fileName), uncommented)

                //     
                // }
                if (field != updated) {
                    updateData[col] = updated
                    overviewEntry.felder.push(col)
                    detailsOldEntry.felder[col] = field
                    detailsNewEntry.felder[col] = updated
                }
            }

            if (Object.keys(updateData).length > 0) {
                let query = pgp.helpers.update(updateData, Object.keys(updateData), "type")
                await Database.none(query + " WHERE id=$1", result.id)
                // console.log("Sanitized row " + result.project_id + "...")
            }

            if (overviewEntry.felder.length > 0)
                changesOverview.push(overviewEntry)

            if (Object.values(detailsOldEntry.felder).length > 0) {
                detailsOld.push(detailsOldEntry)
            }

            if (Object.values(detailsNewEntry.felder).length > 0) {
                detailsNew.push(detailsNewEntry)
            }
        }

    } while (results && results.length > 0)


    changesOverview.sort((a, b) => {
        return a.name < b.name
    })
    detailsOld.sort((a, b) => {
        return a.name < b.name
    })

    fs.writeFileSync(path.join(__dirname, "out", "änderungen_überblick.json"), JSON.stringify(changesOverview))
    fs.writeFileSync(path.join(__dirname, "out", "änderungen_detail_old.json"), JSON.stringify(detailsOld))
    fs.writeFileSync(path.join(__dirname, "out", "änderungen_detail_new.json"), JSON.stringify(detailsNew))


}


function removeComments(el) {
    return el.replace(/(<!.+?-->)/gs, "")
}


main().catch(console.log)