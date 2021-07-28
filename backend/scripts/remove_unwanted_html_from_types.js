const { ColumnSet } = require("pg-promise");
const { DB_FIELDS, ALLOWED_STYLES } = require("../constants/html_formatted_fields");
const { Database, pgp } = require("../src/utils/database");
const HTMLSanitizer = require("../src/utils/HTMLSanitizer");
const fs = require("fs")
const path = require("path")

async function main() {

    /**
     * Create first. If it fails for some reason, the execution is stop.
     * Preventing changes on the database without tracking changes.
     */
     const outpath = path.join(__dirname, "out")
    if(!fs.existsSync(outpath)){
        fs.mkdirSync(outpath)
    }


    const changesOverview = []
    const detailsOld = []
    const detailsNew = []


    const limit = 10
    let offset = 0

    const idColumns = [
        "id",
        "project_id",
    ]

    let results
    do {
        results = await Database.manyOrNone(`
    SELECT ${[...idColumns, ...DB_FIELDS].join(", ")} from type
    LIMIT $[limit]
    OFFSET $[offset]
`, { limit, offset })

        offset += limit

        for (let result of Object.values(results)) {
            updateData = {}

            const base = {
                id: result.id,
                name: result.project_id,
                felder: []
            }

            let overviewEntry = Object.assign({}, base)
            let detailsOldEntry = Object.assign({}, base)
            let detailsNewEntry = Object.assign({}, base)

            for (let col of Object.values(DB_FIELDS)) {
                let field = result[col]
                let updated = HTMLSanitizer.sanitize(field, ...ALLOWED_STYLES)
                updated = removeComments(updated)

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
   

    fs.writeFileSync(path.join(outpath, "änderungen_überblick.json"), JSON.stringify(changesOverview))
    fs.writeFileSync(path.join(outpath, "änderungen_detail_old.json"), JSON.stringify(detailsOld))
    fs.writeFileSync(path.join(outpath, "änderungen_detail_new.json"), JSON.stringify(detailsNew))


}


function removeComments(el) {
    return el.replace(/(<!.+?-->)/gs, "")
}


main().catch(console.log)