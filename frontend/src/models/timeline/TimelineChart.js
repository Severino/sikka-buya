class Chart {
    constructor(canvas) {
        this.canvas = canvas
    }


    clear() {
        this.getContext().clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    getContext() {
        return this.canvas.getContext('2d');
    }

}


export default class TimelineChart extends Chart {

    constructor(canvas, timeline) {
        super(canvas)
        this.timeline = timeline
    }

    updateTimeline(timeline) {
        this.timeline = timeline
    }


    y(val) {
        return this.canvas.height - val;
    }

    x(val) {
        const timelineSpan = this.timeline.to - this.timeline.from
        const widthPerYear = this.canvas.width / timelineSpan
        const x = (val - this.timeline.from) * widthPerYear - 2

        return x
    }

    drawMintLinesOnCanvas(data, y, lineOptions) {
        let ctx = this.getContext()
        Object.assign(ctx, lineOptions)
        this.clear()

        data.forEach(range => {
            ctx.beginPath();
            ctx.moveTo(this.x(range[0]), this.y(y))
            ctx.lineTo(this.x(range[1]), this.y(y))
            ctx.stroke()
        })

    }

    drawGraphOnTimeline(data, lineOptions) {

        let ctx = this.canvas.getContext('2d');
        Object.assign(ctx, lineOptions)
        ctx.beginPath();

        let curveMax = 0;
        let curveData = {};
        data.forEach((mint) => {
            mint.data.forEach((point) => {
                if (!curveData[point.x]) curveData[point.x] = point.y;
                else curveData[point.x] += point.y;

                if (curveData[point.x] > curveMax)
                    curveMax = curveData[point.x];
            });
        });

        let yStep = (this.canvas.height - (lineOptions.lineWidth || 1) - 10) / (curveMax > 0 ? curveMax : 20);


        let last = null;
        Object.keys(data)
            .sort((a, b) => a - b)
            .forEach((x_key) => {
                const point = { x: x_key, y: data[x_key] };
                if (last && point.x - last > 1) {
                    ctx.lineTo(this.x(last), this.y(0));
                    last = null;
                }
                if (last == null) ctx.moveTo(this.x(point.x), this.y(0));

                ctx.lineTo(this.x(point.x), this.y(point.y * yStep));
                last = point.x;
            });

        ctx.lineTo(this.x(last), this.y(0));
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }


}