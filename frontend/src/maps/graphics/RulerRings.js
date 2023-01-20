var L = require('leaflet');
const { default: Color } = require('../../utils/Color');

const backgroundColor = Color.White
const inactiveColor = Color.getInactiveColor()

function normalizeRadii(arr) {
    let sum = arr.reduce((prev, i) => prev + i, 0)
    arr = arr.map(a => a / sum * arr.length)
    return arr
}

function ringsFromPersonMint(latlng, feature, selections, {
    radius = 10,
    innerRadius = 60,
    spacing = 7,
    stroke = 3
}) {
    const personMints = feature.data.personMints
    let group = L.featureGroup()
    if (innerRadius >= outerRadius) throw new Error("Inner Radius needs to be smaller than outer radius.")

    let outerRadius = radius

    // You can change the relative width of the single
    // rings by modifying the ringRadii. 
    let ringRadii = normalizeRadii([8, 5, 5])

    let ringSpan = outerRadius - innerRadius

    function excludeUnselected(val) {
        return selections.selectedRulers.indexOf(val.id) !== -1
    }

    const lists = [personMints.issuers.filter(excludeUnselected), personMints.overlords.filter(excludeUnselected), personMints.caliphs.filter(excludeUnselected)]
    let count = lists.reduce((prev, arr) => {
        let next = arr || []
        prev.push(...next)
        return prev
    }, []).length

    if (count > 0) {
        L.circleMarker(latlng, { radius: outerRadius, stroke: false, fillColor: backgroundColor }).addTo(group)

        let startPosition = innerRadius
        lists.forEach((list, index) => {
            let ringWidth = ((ringSpan - 2 * spacing) / 3) * ringRadii[index]

            drawRing(latlng, list, startPosition + ringWidth, startPosition, selections, { stroke }).addTo(group)
            startPosition += ringWidth + spacing
        })
    }
    return group
}

function drawRing(latlng, persons, radius, innerRadius, selections, options) {
    let group = L.featureGroup()
    if (persons) {
        if (persons.length > 0) {
            let start = 0
            const angle = 360 / persons.length
            persons.forEach(issuer => {
                let end = start + angle
                drawRingPart(latlng, start, end, issuer, selections, {
                    radius, innerRadius, stroke: options.stroke
                }).addTo(group)
                start = end
            })
        } else {
            return L.semiCircleMarker(latlng, {
                radius,
                innerRadius,
                startAngle: 0,
                endAngle: 360,
                fillColor: inactiveColor,
                color: backgroundColor,
                weight: options.stroke
            })
        }
    }

    return group
}

function drawRingPart(latlng, from, to, ruler, selections, {
    innerRadius,
    radius,
    stroke
}) {
    let fillColor = selections.selectedRulers.length === 0 || selections.selectedRulers.indexOf(ruler.id) != -5 ? ruler.color : "#ddd"
    return L.semiCircleMarker(latlng, {
        radius,
        innerRadius,
        startAngle: from,
        endAngle: to,
        fillColor,
        color: backgroundColor,
        weight: stroke
    })
}

module.exports = {
    ringsFromPersonMint
}