export function rulersFromCoin(coin) {
    let rulers = [];
    if (coin.issuers && coin.issuers.length > 0) rulers.push(coin.issuers);
    if (coin.overlords && coin.overlords.length > 0)
        rulers = [...rulers, ...coin.overlords];
    if (coin.caliph) rulers.push(coin.caliph);
    return rulers;
}

export function dataFromRulers(rulers, selected = []) {
    let value = rulers
    if (Array.isArray(rulers)) {
        value = []
        rulers.forEach(ruler => {
            const subdata = dataFromRulers(ruler, selected)
            value.push(subdata)
        })
    } else {
        const ruler = rulers

        let fillColor = ruler.color || "#ff00ff"
        if (selected.length > 0) {
            fillColor = selected.indexOf(ruler.id) == -1 ? "#dddddd" : fillColor
        }

        value = {
            data: ruler,
            fillColor,
            color: "#fff",
            stroke: true,
            weight: 1
        }
    }

    return value
}

export function coinsToRulerData(coins, selected = []) {
    let data = []
    coins.forEach(coin => {
        data.push({
            groupData: coin,
            data: dataFromRulers(rulersFromCoin(coin), selected)
        })
    })

    return data
}