export default class Sequence {
    static fromArrayObject(arr, callback) {
        const sequence = []
        arr.forEach(obj => {
            const arr = callback(obj)
            sequence.push(...arr)
        })
        return sequence.sort((a, b) => a.x - b.x)
    }
}