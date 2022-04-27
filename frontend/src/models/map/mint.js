export default class Mint {
    static popupMintHeader(mint) {
        return `<header>
            <span class="subtitle">${mint.name}</span>
            ${(mint.uncertain) ?
                '<div class="tooltip-container"><div class="div-icon-button div-icon circle-div-icon">?</div> <div class="tooltip">Verortung der Münzstätte ist nicht sicher.</div>'
                : ""}
                </div >
    
        </header > `
    }
}