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

    static popupMintHeader(mint, headerClasses = [], debug = false) {
        return `<header class="${headerClasses.join(" ")}">
            <span class="subtitle no-padding-bottom">${mint.name}
            ${(window.debug) ? `  (${mint.id})` : ''}
            
            </span>    
            ${(mint.uncertain) ? `
        <div class="uncertain-info"> 
            (genaue) Lokalisierung unsicher
            </div>
           `
                : ""
            }

            ${(window.debug) ? `${mint.province.name} (${mint.province.id})` : ''} 
        
        
        </header > `
    }

    static mintGraphQL() {
        return `mint {
            id
            name
            location
            uncertain
            province {
                id
                name
            }
        } `
    }
}