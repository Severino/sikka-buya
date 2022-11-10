var L = require('leaflet');

const backgroundColor = "#eee"

function ringsFromPersonMint(latlng, feature, selections, {
    radius = 10,
    innerRadius = 60,
    spacing = 7
}) {
    const personMints = feature.data.personMints
    let group = L.featureGroup()
    if (innerRadius >= outerRadius) throw new Error("Inner Radius needs to be smaller than outer radius.")

    let outerRadius = radius
    let ringSpan = outerRadius - innerRadius

    const lists = [personMints.issuers, personMints.overlords, personMints.caliphs]
    let count = lists.reduce((prev, arr) => {
        let next = arr || []
        prev.push(...next)
        return prev
    }, []).length
    if (count > 0)
        L.circleMarker(latlng, { radius: outerRadius, stroke: false, fillColor: backgroundColor }).addTo(group)

    let ringWidth = (ringSpan - ((lists.length - 1) * spacing)) / 3
    lists.forEach((list, index) => {
        let radius = innerRadius + ringWidth * (index + 1) + spacing * index
        drawRing(latlng, list, radius, radius - ringWidth, selections).addTo(group)
    })
    return group
}

function drawRing(latlng, persons, radius, innerRadius, selections) {
    let group = L.featureGroup()
    if (persons) {
        let start = 0
        const angle = 360 / persons.length
        persons.forEach(issuer => {
            let end = start + angle
            drawRingPart(latlng, start, end, issuer, selections, {
                radius, innerRadius
            }).addTo(group)
            start = end
        })
    }
    return group
}

function drawRingPart(latlng, from, to, ruler, selections, {
    innerRadius,
    radius
}) {

    // if (selections.selectedRulers[ruler.id]) {
    //     console.log(selections.selectedRulers)
    // }
    let fillColor = selections.selectedRulers.length === 0 || selections.selectedRulers.indexOf(ruler.id) != -1 ? ruler.color : "#ddd"
    return L.semiCircleMarker(latlng, {
        radius,
        innerRadius,
        startAngle: from,
        endAngle: to,
        fillColor,
        color: backgroundColor,
        weight: 1
    })
}

module.exports = {
    ringsFromPersonMint
}