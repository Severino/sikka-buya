import SikkaColor from '../utils/Color';

export function rulersFromCoin(coin) {
    let rulers = [];
    if (coin.issuers && coin.issuers.length > 0) rulers.push(coin.issuers);
    if (coin.overlords && coin.overlords.length > 0)
        rulers = [...rulers, ...coin.overlords];
    if (coin.caliph) rulers.push(coin.caliph);
    return rulers;
}

export function dataFromRulers(rulers) {

    let value = rulers
    if (Array.isArray(rulers)) {
        value = []
        rulers.forEach(ruler => {
            const subdata = dataFromRulers(ruler)
            value.push(subdata)
        })
    } else {
        const ruler = rulers
        const fillColor = SikkaColor.fromHash(SikkaColor.getHash(ruler.name))
        console.log(fillColor)
        value = {
            id: ruler.id,
            fillColor,
            color: "#fff",
            stroke: true,
            weight: 1
        }
    }

    return value
}

export function coinsToRulerData(coins) {
    let data = []
    coins.forEach(coin => {
        data.push(dataFromRulers(rulersFromCoin(coin)))
    })

    return data
}