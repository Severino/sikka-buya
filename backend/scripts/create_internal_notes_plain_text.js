const { WriteableDatabase } = require('../src/utils/database');
const { main } = require('./modules/async');
const { JSDOM } = require("jsdom");
const { error } = require('./modules/logging');

async function createPlainTextNotes({ id = -1, internal_notes = "" } = {}) {

    try {
        let dom = new JSDOM(internal_notes)
        let text = dom.window.document.body.textContent
        if (text !== "") {
            await WriteableDatabase.none(`
        INSERT INTO internal_notes_plain_text (type, text) 
        VALUES ($[id], $[text]) 
        ON CONFLICT (type) DO UPDATE 
        SET text=EXCLUDED.text`, { id, text })
        }
    } catch (e) {
        error(`Could not create plain text of type with id '${id}'`, e)
    }

}

main(async () => {
    let types = await WriteableDatabase.many(`SELECT id, internal_notes FROM type`)

    for (let type of types) {
        await createPlainTextNotes(type)
    }

    return "Program exited correctly."
})

