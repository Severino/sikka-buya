
export class TimelineChart {
    constructor(timeline) {
        this.timeline = timeline
    }

    drawMintLinesOnCanvas(canvas){
        
    }

    drawGraphOnTimeline(canvas) {
        let ctx = canv.getContext('2d');

        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#bfbfbf';
        ctx.fillStyle = '#eee';
        ctx.beginPath();

        let last = null;
        Object.keys(curveData)
            .sort((a, b) => a - b)
            .forEach((x_key) => {
                const point = { x: x_key, y: curveData[x_key] };
                if (last && point.x - last > 1) {
                    ctx.lineTo(x(last), y(0));
                    last = null;
                }
                if (last == null) ctx.moveTo(x(point.x), y(0));

                ctx.lineTo(x(point.x), y(point.y));
                last = point.x;
            });

        ctx.lineTo(x(last), y(0));
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }


}


// drawMintCountOntoTimeline() {
//     const canv = this.$refs.timelineCanvas;
//     let ctx = canv.getContext('2d');
//     let rect = canv.getBoundingClientRect();

//     /**
//      * Resizing the canvas will also clear it.
//      */
//     canv.width = rect.width;
//     canv.height = rect.height;

//     if (this.selectedMints.length > 0)
//         Query.raw(
//             `{
// typeCountOfMints(ids: [${this.selectedMints.join(',')}]){
// id, data {
//   x
//   y
// }
  
// }
// }`
//         )
//             .then((val) => {
//                 this.mintTimelineData = val.data.data.typeCountOfMints;

//                 const lineWidth = 3;
//                 let curveMax = 0;
//                 let curveData = {};
//                 this.mintTimelineData.forEach((mint) => {
//                     mint.data.forEach((point) => {
//                         if (!curveData[point.x]) curveData[point.x] = point.y;
//                         else curveData[point.x] += point.y;

//                         if (curveData[point.x] > curveMax)
//                             curveMax = curveData[point.x];
//                     });
//                 });

//                 const yStep =
//                     (canv.height - lineWidth - 10) / (curveMax > 0 ? curveMax : 20);

//                 let y = (val) => {
//                     return canv.height - val * yStep;
//                 };

//                 let x = (val) => {
//                     return (
//                         ((val - this.raw_timeline.from) /
//                             (this.raw_timeline.to - this.raw_timeline.from)) *
//                         canv.width -
//                         2
//                     );
//                 };

//             })
//             .catch(console.error);
// },