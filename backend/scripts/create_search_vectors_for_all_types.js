const IterateTypesScript = require("./IterateTypesScript")
const Type = require('../src/utils/type');
const { Database } = require("../src/utils/database")

    ; (async function () {

        try {
            await Database.none(`UPDATE type SET search_vectors = to_tsvector('german', plain_text)`);
        } catch (e) {
            console.log(e)
        }
    }())


