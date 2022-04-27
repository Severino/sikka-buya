
var L = require('leaflet');


function createRadials(latlng, {
    data = null,
    groupData = null,
    radius = 100,
    startAngle = 0,
    stopAngle = 360,
    innerRadius = 0,
    openPopup = null
}) {
    const circles = []

    const donutWidth = (radius - innerRadius) / data.length
    for (let j = data.length - 1; j >= 0; j--) {

        const subRadius = innerRadius + donutWidth * (j + 1)
        const innerSubRadius = innerRadius + donutWidth * j


        const sliceOptions = Object.assign({}, {
            radius: subRadius,
            innerRadius: innerSubRadius,
            data,
            startAngle,
            stopAngle,
            openPopup,
            groupData
        }, { data: data[j] })
        const children = concentricCircle(latlng, sliceOptions)
        circles.push(children)
    }

    return L.featureGroup(circles)
}


export function concentricCircles(latlng, data, {
    radius = 100,
    innerRadius = 0,
    startAngle = 0,
    openPopup = null
} = {}) {

    const concentricCircles = []
    data.forEach((slice, i) => {
        const angleWidth = 360 / data.length
        const subStartAngle = startAngle + angleWidth * i
        const stopAngle = subStartAngle + angleWidth

        if (slice.data.length == 0) {
            const graphics = L.semiCircleMarker(latlng, Object.assign({}, { radius, startAngle: subStartAngle, stopAngle, fillColor: "#ddd", weight: 1, color: "#fff", stroke: "true" }))
            concentricCircles.push(graphics)
            assignGeometryProperties(graphics, { data: null, groupData: slice.groupData, openPopup })
        } else {
            const circle = createRadials(latlng, {
                data: slice.data,
                groupData: slice.groupData,
                radius,
                startAngle: subStartAngle,
                stopAngle,
                innerRadius,
                openPopup
            })
            concentricCircles.push(circle)
        }
    })



    return L.featureGroup(concentricCircles)
}


export function concentricCircle(latlng, {
    data = [],
    groupData = null,
    radius = 100,
    startAngle = 0,
    stopAngle = 360,
    innerRadius = 0,
    openPopup = null
} = {}) {

    const circles = []

    if (groupData == null) groupData = data

    if (!Array.isArray(data))
        data = [data]


    for (let i = data.length - 1; i >= 0; i--) {
        let item = data[i]
        const angleWidth = (stopAngle - startAngle) / data.length
        const _startAngle = startAngle + angleWidth * i
        const _stopAngle = startAngle + angleWidth * (i + 1)

        if (Array.isArray(item)) {
            const radials = createRadials(latlng, { radius, innerRadius, startAngle: _startAngle, stopAngle: _stopAngle, data: item, openPopup, groupData })
            circles.push(radials)
        } else {
            const graphics = L.semiCircleMarker(latlng, Object.assign({}, { radius, startAngle: _startAngle, stopAngle: _stopAngle }, item))
            assignGeometryProperties(graphics, { data: item, groupData, openPopup })
            circles.push(graphics)
        }
    }

    return L.featureGroup(circles)

}

function assignGeometryProperties(geom, { data, groupData, openPopup }) {

    if (openPopup) {
        geom.bindPopup(() => {
            return openPopup({ data, groupData })
        })
    }
}

