export default class Mint {
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