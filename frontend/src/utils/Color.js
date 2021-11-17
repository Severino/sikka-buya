import CRC32 from "crc-32"


export default class SikkaColor {
    static fromHash(text) {
        const hash = Math.abs(CRC32.str(text)).toString(16)
        const color = "#" + hash.substr(0, 6)
        return color
    }

    static getContrastColor(color, light, dark) {
        let val = 0
        const weights = [0.2126, 0.7152, 0.0722]
        weights.forEach((weight, i) => {
            console.log(color.substr(i * 2 + 1, 2))
            console.log(parseInt(color.substr(i * 2 + 1, 2), 16) * weight)
            val += parseInt(color.substr(i * 2 + 1, 2), 16) * weight
        })

        return val > 255 / 2 ? dark : light;

    }
}