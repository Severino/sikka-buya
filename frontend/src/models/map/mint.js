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

    static popupMintHeader(mint, headerClass = null) {

        return `<header ${(headerClass) ? `class="${headerClass}"` : ""}>
            <span class="subtitle no-padding-bottom">${mint.name}</span>    
            <div class="uncertain-info"> 
            (genaue) Lokalisierung unsicher
            </div>
        </header >${(mint.uncertain) ? `
        
           `
                : ""
            }
        
        `
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
          }`
    }
}