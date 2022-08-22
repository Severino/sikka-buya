export default class Range {
    static fromSequence(arr, valueFunc) {
        let ranges = [];

        if (arr.length > 0) {
            const first = valueFunc(arr.shift());
            ranges.push([first, first]);

            let prev = first;
            let prevRange = 0;
            for (let obj of arr) {
                const value = valueFunc(obj)
                if (value - prev === 1) {
                    ranges[prevRange][1] = value;
                } else {
                    ranges.push([value, value]);
                    prevRange++;
                }
                prev = value;
            }
        }
        return ranges;
    }
}