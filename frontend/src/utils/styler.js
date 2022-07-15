export default class Styler {


    static svgToCssStyle(options) {
        const css = {}
        for (let [svgAttr, svgValue] of Object.entries(options)) {
            const cssAttr = Styler.mapSvgAttributeToCss(svgAttr)
            const cssValue = this.mapSvgValueToCss(cssAttr, svgValue)
            css[cssAttr] = cssValue
        }
        return css
    }


    static mapSvgValueToCss(attr, value) {
        const map = {
            "border-width": (val) => `${Math.ceil(val)}px`,
            "background-color": (val) => val,
            "color": (val) => val
        }

        if (!map[attr]) throw new Error("Attribute is not implemented!")
        return map[attr](value)
    }

    static mapSvgAttributeToCss(attr) {
        const map = {
            color: "border-color",
            fillColor: "background-color",
            stroke: "border-width"
        }

        if (!map[attr]) throw new Error("Attribute is not implemented!")
        return map[attr]
    }

}