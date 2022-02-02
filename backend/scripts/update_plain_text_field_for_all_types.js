/**
 * Can be run without problem, when you want to update the plain text fields
 * of all types. This may be necessary if a bug with the type plain text field
 * was corrected or additional changes were made to the function:
 *
 * Type.createPlainTextField
 *
 */

const IterateTypesScript = require("./IterateTypesScript")
const Type = require('../src/utils/type');
const { Database } = require("../src/utils/database")



new IterateTypesScript("Update Plain Text Fields on Types", {
    logFileName: "update_plain_text_fields_on_types"
})
    .on('start', async () => {
        if (!await checkIfColumnExists()) {
            throw new Error("Column plain_text does not exist. Create it first!")
        }
    })
    .on("each", async (type) => {
        const { text, errors } = await Type.createPlainTextField(type)

        let error = (Object.keys(errors).length > 0) ? `Errors on type ${typeIdToString(type)}: ${errorsToString(errors)}` : ""
        try {
            await Database.any(`UPDATE type SET plain_text=$[text] WHERE id=$[id]`, { id: type.id, text })
        } catch (e) {
            error += `Could not update type: ${typeIdToString(type)}`
        }

        return {
            value: typeIdToString(type),
            error
        }
    })
    .exec()

function typeIdToString(type) {
    return `${type.project_id}[${type.id}]`
}


function errorsToString(errors) {
    let strs = []
    for (let [key, error] of Object.entries(errors)) {
        strs.push(`${key}: ${error}`)
    }
    return strs.join(" // ")
}

async function checkIfColumnExists() {
    return await Database.one(`SELECT EXISTS(SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'type' AND column_name = 'plain_text'); `)
}