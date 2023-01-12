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

export function rulerPopup(coin, clickedRuler, debug = false) {
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

    let popup = `
    ${Mint.popupMintHeader(coin.mint, ["underlined-header"])}
     <div class="popup-body">
         <div class="catalog-title">
         <h2>${coin.projectId}</h2>
         ${!coin.excludeFromTypeCatalogue
            ? `<a href="${route.href}" target="_blank" class="catalog-link">Katalogeintrag</a>`
            : ''
        }</div>
         ${(!isCaliphCoin(coin)) ?
            `<h3>Münzherr(en)</h3>
                 ${issuersText}
                 <h3>Oberherr(en)</h3>
                 ${overlordsText}
                 ` : ""
        }
         
       
         <h3>Kalif</h3>
         ${caliphText}
         ${heirText}
   `;

    if (debug) {
        popup += `
            <hr />
            <h3>Debug</h3>

            <a href="${route.href}" target="_blank" >Katalogeintrag</a>
            <table>
            <tr>
            <td>Id</td>
            <td>${coin.id}</td>
            </tr>
            <tr>
            <td>Mint Id</td>
            <td>${coin.mint.id}</td>
            </tr>
            <tr>
            <td>Caliph Id</td>
            <td>${coin.caliph.id}</td>
            </tr>
            </table>
        `
    }

    popup += "</div>"

    return popup
}

function isCaliphCoin(coin) {
    return (coin?.issuers?.length === 0 && coin?.overlords?.length === 0 && coin?.caliph)
}