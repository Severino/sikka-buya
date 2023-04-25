import Color from '../utils/Color';

export function rulersFromCoin(coin, patterns) {
    let rulers = [];
    if (coin.issuers && coin.issuers.length > 0) rulers.push(coin.issuers);
    if (coin.overlords && coin.overlords.length > 0)
        rulers = [...rulers, ...coin.overlords];
    if (coin.caliph) {
        if (!coin.heir) {
            rulers.push(coin.caliph)
        } else {

            const fillPattern = patterns[coin.caliph.id] ? patterns[coin.caliph.id][coin.heir.id] : null

            rulers.push({
                group: true,
                items: [coin.caliph, coin.heir],
                styles: {
                    fillPattern
                }
            })
        }
    }
    return rulers;
}

export function dataFromRulers(rulers, { selected = [], options = {} }) {
    let data = rulers
    let sel = false

    if (Array.isArray(rulers)) {
        data = []
        rulers.forEach(ruler => {
            const { data: subdata, selected: anyIsSelected } = dataFromRulers(ruler, { selected, options })
            if (anyIsSelected) sel = true
            data.push(subdata)
        })
    } else {
        sel = true
        let fillColor
        if (rulers.group) {
            fillColor = rulers.styles.fillPattern
            for (let ruler of Object.values(rulers.items)) {
                if (selected.length > 0) {
                    sel = selected.indexOf(ruler.id) !== -1
                    if (sel) break
                }
            }
        } else {
            const ruler = rulers
            if (selected.length > 0) {
                sel = selected.indexOf(ruler.id) !== -1
            }
            fillColor = (sel) ? ruler.color : Color.getInactiveColor()
        }

        data = Object.assign({
            fillColor,
            stroke: true,
            color: "#999",
            weight: 0.75
        }, rulers.styles, {
            data: rulers,
        })
    }

    return { data, selected: sel }
}

export function coinsToRulerData(coins, { selected = [], patterns = {}, options = {} }) {
    let data = []
    let sel = false

    coins.forEach(coin => {
        const rulers = rulersFromCoin(coin, patterns)
        let { data: rulerData, selected: sel2 } = dataFromRulers(rulers, { selected, options })
        sel = sel2
        data.push({
            groupData: coin,
            data: rulerData
        })
    })

    return { data, selected: sel }
}
