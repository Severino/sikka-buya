

function printName(person, clickedRuler) {
    const active = person.id === clickedRuler.id
    let name = person.shortName || person.name || "Unbenannter Herrscher";
    return (active) ? `<span class="active">${name}</span>` : `<span>${name}</span>`;
}

function buildRulerList(personsArr, clickedRuler, orderedList = false,) {
    if (!personsArr || personsArr.length == 0) return '-';
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
    console.log(coin)
    let caliphText = buildRulerList(coin.caliph, clickedRuler);
    let overlordsText;
    if (coin.overlords) {
        let sorted = coin.overlords.sort((a, b) => a.rank > b.rank);
        overlordsText = buildRulerList(sorted, clickedRuler, true);
    } else {
        overlordsText = '-';
    }
    let issuersText = buildRulerList(coin.issuers, clickedRuler);
    return `
        <header>
          <span class="subtitle">${coin.mint.name}</span>
        </header>
        <h2>${coin.projectId}</h2>
        ${!coin.excludeFromTypeCatalogue
            ? `<a href="/catalog/${coin.id}" target="_blank" class="catalog-link">Katalogeintrag</a>`
            : ''
        }
        
        <h3>Münzherren</h3>
        ${issuersText}
        <h3>Oberherren</h3>
        ${overlordsText}
         <h3>Kalif</h3>
        ${caliphText}
      `;
}