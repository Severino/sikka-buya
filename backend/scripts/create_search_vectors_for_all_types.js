/**
 * Script to pouplate the type's search_vectors from the plain_text field
 * 
 * Can be used after updating the plain text field using the 
 * script: 
 * update_plain_text_field_for_all_types.js
 */

const { Database } = require("../src/utils/database")

    ; (async function () {

        try {
            await Database.none(`UPDATE type SET search_vectors = to_tsvector('german', plain_text)`);
        } catch (e) {
            console.log(e)
        }
    }())


