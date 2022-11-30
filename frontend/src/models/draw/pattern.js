export default class Pattern {

    static createLinePattern(colors, width) {
        const canvas = document.createElement("canvas")
        const height = width;
        canvas.width = height;
        canvas.height = height;

        const angle = 45 * Math.PI / 180

        // Note: the first color is drawn 3 times, therefore we compare
        //        <= instead of the 'usual' <

        const prevContext = canvas.getContext("2d")

        let dHeight = height / Math.sin(angle)
        const stepHeight = dHeight / (colors.length * 2)

        // We don't calculate the exact length, we just overshoot a lot

        prevContext.translate(height / 2, height / 2)
        prevContext.rotate(angle)
        prevContext.translate(-height / 2, -height / 2)

        let xOffset = (dHeight - height) / 2

        for (let i = 0; i <= colors.length * 2; i++) {
            const cur_color = colors[i % colors.length]
            prevContext.beginPath()
            prevContext.strokeStyle = cur_color
            prevContext.lineWidth = stepHeight
            prevContext.moveTo(i * stepHeight - xOffset, -height)
            prevContext.lineTo(i * stepHeight - xOffset, height * 2)

            prevContext.stroke()
        }

        return canvas

    }
}