import { DEBUG_COLOR, INACTIVE_COLOR } from '../utils/Color';

export function rulersFromCoin(coin, patterns) {
    let rulers = [];
    if (coin.issuers && coin.issuers.length > 0) rulers.push(coin.issuers);
    if (coin.overlords && coin.overlords.length > 0)
        rulers = [...rulers, ...coin.overlords];
    if (coin.caliph) {
        if (!coin.heir) {
            rulers.push(coin.caliph)
        } else {
            rulers.push({
                group: true,
                items: [coin.caliph, coin.heir],
                styles: {
                    fillPattern: patterns[coin.caliph.id][coin.heir.id]
                }
            })
        }
    }
    return rulers;
}

export function dataFromRulers(rulers, selected = []) {
    let data = rulers
    let sel = false

    if (Array.isArray(rulers)) {
        data = []
        rulers.forEach(ruler => {
            const { data: subdata, selected: anyIsSelected } = dataFromRulers(ruler, selected)
            if (anyIsSelected) sel = true
            data.push(subdata)
        })
    } else {
        const ruler = rulers

        sel = true
        if (ruler.group) {
            for (let ruler of Object.values(ruler.items)) {
                if (selected.length > 0) {
                    sel = selected.indexOf(ruler.id) !== -1
                    if (sel) break
                }
            }
        } else {
            if (selected.length > 0) {
                sel = selected.indexOf(ruler.id) !== -1
            }
        }


        let fillColor = !sel ? INACTIVE_COLOR : ruler.color || DEBUG_COLOR

        data = Object.assign({
            fillColor,
            color: "#fff",
            stroke: true,
            weight: 1
        }, ruler.styles, {
            data: ruler,
        })

        if (!sel && data?.fillPattern) {
            console.log(sel)
            data.fillPattern = null
        }
    }

    return { data, selected: sel }
}

export function coinsToRulerData(coins, selected = [], patterns = {}) {
    let data = []
    let sel = false
    coins.forEach(coin => {
        const rulers = rulersFromCoin(coin, patterns)
        let { data: rulerData, selected: sel2 } = dataFromRulers(rulers, selected)
        sel = sel2
        data.push({
            groupData: coin,
            data: rulerData
        })
    })

    return { data, selected: sel }
}
