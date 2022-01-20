
var L = require('leaflet');


function createRadials(latlng, {
    data = null,
    radius = 100,
    startAngle = 0,
    stopAngle = 360,
    innerRadius = 0,
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
        }, { data: data[j] })
        const children = concentricCircles(latlng, sliceOptions)
        circles.push(children)
    }

    return L.featureGroup(circles)
}


export function concentricCircles(latlng, {
    data = null,
    radius = 100,
    startAngle = 0,
    stopAngle = 360,
    innerRadius = 0
} = {}) {


    const circles = []

    if (!Array.isArray(data)) {
        console.log(data)
        const circle = L.semiCircleMarker(latlng, Object.assign({}, { innerRadius, radius, startAngle, stopAngle }, data))
        circles.push(circle)
    } else {

        for (let i = data.length - 1; i >= 0; i--) {
            let item = data[i]
            const angleWidth = (stopAngle - startAngle) / data.length
            const _startAngle = startAngle + angleWidth * i
            const _stopAngle = startAngle + angleWidth * (i + 1)

            if (Array.isArray(item)) {
                const radials = createRadials(latlng, { radius, innerRadius, startAngle: _startAngle, stopAngle: _stopAngle, data: item })
                circles.push(radials)
            } else {
                console.log(data)
                const graphics = L.semiCircleMarker(latlng, Object.assign({}, { radius, startAngle: _startAngle, stopAngle: _stopAngle }, item))
                circles.push(graphics)
            }
        }
    }


    return L.featureGroup(circles)

}

