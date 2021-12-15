import CRC32 from "crc-32"


export default class SikkaColor {

    static getHash(text) {
        const hash = Math.abs(CRC32.str(text)).toString(16)
        return hash.substr(0, 6)
    }
    static fromHash(text) {
        const color = "#" + this.getHash(text)
        return color
    }

    static getContrastColor(color, light, dark) {
        let val = 0
        const weights = [0.2126, 0.7152, 0.0722]
        weights.forEach((weight, i) => {
            val += parseInt(color.substr(i * 2 + 1, 2), 16) * weight
        })

        return val > 255 / 2 ? dark : light;
    }
}