export class Slide {
    static formatLabel(options) {
        throw new Error("Required method not implemented: formatLabel(options).")
    }
}

export class PoliticalSlide extends Slide {
    static formatLabel(options) {

        const [lat, lng] = options.location.split(",").map(val => parseFloat(val))

        options.display = new SlideDisplay({
            rows: [
                new SlideDisplayRow({
                    icon: "location-icon",
                    text: `${lat.toFixed(3)}, ${lng.toFixed(3)}`
                }),
                new SlideDisplayRow({
                    icon: "mint-icon",
                    text: options.selectedMints.length.toString()
                }),
                new SlideDisplayRow({
                    icon: "ruler-icon",
                    text: options.selectedRulers.length.toString()
                }),
            ]
        })

        return options
    }
}

export class FilterSlide extends Slide {

}

export class SlideDisplay {
    constructor({ rows } = {}) {
        this.rows = rows
    }
}

export class SlideDisplayRow {
    constructor({ icon, text } = {}) {
        this.icon = icon
        this.text = text
    }
}