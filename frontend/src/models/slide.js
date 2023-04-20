import L from 'leaflet'
import StringUtils from '../utils/StringUtils'

export class Slide {
    static formatLabel(options) {
        throw new Error("Required method not implemented: formatLabel(options).")
    }
}

function getLocationRow(options, mints) {
    const [lat, lng] = options.location.split(",").map(val => parseFloat(val))
    const center = L.latLng(lat, lng)

    const targetMints = (options.selectedMints.length === 0) ? mints : mints.filter(mint => options.selectedMints.includes(mint.id))

    let nearest = { mint: null, distance: Infinity }
    for (let mint of targetMints) {
        if (!mint?.location?.coordinates?.length || mint.location.coordinates.length === 0) continue
        const distance = center.distanceTo(L.latLng(mint.location.coordinates[0], mint.location.coordinates[1]))
        if (distance < nearest.distance) {
            nearest = { mint, distance }
        }
    }
    let locationText = `${lat.toFixed(3)}, ${lng.toFixed(3)}`
    if (nearest.mint != null && nearest.distance < 1000000 /* 1000km */) {
        locationText = `${StringUtils.clip(nearest.mint.name, 8)} (${Number((nearest.distance / 1000).toPrecision(2))}km)`
    }
    return new SlideDisplayRow({
        icon: "location-icon",
        text: locationText,
        columns: 6
    })
}

function getYearRow(options) {
    return new SlideDisplayRow({
        icon: "calendar-icon",
        text: options.year.toString(),
        columns: 2
    })
}

function addYearRowIfPresent(options) {
    let row = []
    let columns = 3
    if (options.year) {
        columns = 2
        row.push(
            getYearRow(options)
        )
    }

    return { columns, row }
}

export class PoliticalSlide extends Slide {
    static formatLabel(options, mints) {

        const { columns, row: yearRow } = addYearRowIfPresent(options)

        const rows = [
            getLocationRow(options, mints),
            ...yearRow,
            new SlideDisplayRow({
                icon: "mint-icon",
                text: options.selectedMints.length.toString(),
                columns
            }),
            new SlideDisplayRow({
                icon: "ruler-icon",
                text: options.selectedRulers.length.toString(),
                columns
            })
        ]

        options.display = new SlideDisplay({
            rows
        })

        return options
    }
}

export class FilterSlide extends Slide {
    static formatLabel(options, mints) {

        const { columns: smallColumns, row: yearRow } = addYearRowIfPresent(options)

        options.display = new SlideDisplay({
            rows: [
                getLocationRow(options, mints),
                ...yearRow,
                new SlideDisplayRow({
                    icon: "mint-icon",
                    text: options.selectedMints.length.toString(),
                    columns: smallColumns
                })
            ]
        })

        return options
    }
}

export class SlideDisplay {
    constructor({ rows } = {}) {
        this.rows = rows
    }
}

export class SlideDisplayRow {
    constructor({ icon, text, columns } = {}) {
        this.icon = icon
        this.text = text
        this.columns = columns
    }
}