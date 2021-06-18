const { ColumnSet } = require("pg-promise");
const { DB_FIELDS, ALLOWED_STYLES } = require("../constants/html_formatted_fields");
const { Database, pgp } = require("../src/utils/database");
const HTMLSanitizer = require("../src/utils/HTMLSanitizer");


async function main() {

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
            DB_FIELDS.forEach(col => {
                let field = result[col]
                let updated = HTMLSanitizer.sanitize(field, ...ALLOWED_STYLES)
                if (field != updated) {
                    updateData[col] = updated
                }
            })

            if (Object.keys(updateData).length > 0) {
                let query = pgp.helpers.update(updateData, Object.keys(updateData), "type")
                await Database.none(query)
                console.log("Sanitized row " + result.project_id + "...")
            }
        }

    } while (results && results.length > 0)

}


main()