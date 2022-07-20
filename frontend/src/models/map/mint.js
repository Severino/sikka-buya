export default class Mint {

    constructor({
        id = -1,
        name = "Unknown Mint",
        location = null,
        province = null,
        uncertain = false,
        uncertainArea = null,

    }) {
        Object.assign(this, {
            id,
            name,
            location,
            province,
            uncertain,
            uncertainArea
        })
    }



    static popupMintHeader(mint) {
        return `<header>
            <span class="subtitle">${mint.name}</span>    
        </header >
        ${(mint.uncertain) ?
                `<div class="popup-body">
                    Verortung der Münzstätte ist nicht sicher.
                </div>`
                : ""
            }
        `
    }
}