import router from '../../router/router';
import StringUtils from '../../utils/StringUtils';
import Mint from './mint';


function printName(person, clickedRuler) {
    let active = false
    if (clickedRuler.group) {
        let inGroup = clickedRuler.items.find(clickedRuler => person.id === clickedRuler.id)
        active = inGroup !== undefined
    } else
        active = person.id === clickedRuler.id
    let name = person.shortName || person.name || "Unbenannter Herrscher";
    return (active) ? `<span class="active">${name}</span>` : `<span>${name}</span>`;
}

function buildRulerList(personsArr, clickedRuler, orderedList = false,) {
    if (!personsArr || personsArr.length == 0) return StringUtils.missingText;
    else if (Array.isArray(personsArr) && personsArr.length > 1) {
        let str = orderedList ? '<ol>' : '<ul>';
        personsArr.forEach((person) => {
            str += `<li>${printName(person, clickedRuler)}</li>`;
        });

        return str + (orderedList ? '</ol>' : '</ul>');
    } else {
        if (Array.isArray(personsArr)) personsArr = personsArr[0];
        return printName(personsArr, clickedRuler);
    }
}

export function rulerPopup(coin, clickedRuler) {
    let caliphText = buildRulerList(coin.caliph, clickedRuler);
    let overlordsText;
    if (coin.overlords) {
        let sorted = coin.overlords.sort((a, b) => a.rank > b.rank);
        overlordsText = buildRulerList(sorted, clickedRuler, true);
    } else {
        overlordsText = StringUtils.missingText;
    }
    let issuersText = buildRulerList(coin.issuers, clickedRuler);

    let heirText = ""
    if (coin.heir) {
        heirText = `
        <h3>Thronfolger des Kalifen</h3>
        ${buildRulerList(coin.heir, clickedRuler)}
        `
    }



    let route = router.resolve({
        name: 'Catalog Entry',
        params: { id: coin.id },
    });

    return `
       ${Mint.popupMintHeader(coin.mint)}
        <div class="popup-body">
            <div class="catalog-title">
            <h2>${coin.projectId}</h2>
            ${!coin.excludeFromTypeCatalogue
            ? `<a href="${route.href}" target="_blank" class="catalog-link">Katalogeintrag</a>`
            : ''
        }</div>
            
            <h3>Münzherr(en)</h3>
            ${issuersText}
            <h3>Oberherr(en)</h3>
            ${overlordsText}
            <h3>Kalif</h3>
            ${caliphText}
            ${heirText}
        </div>
      `;
}