export default class Compare {

    static deep(a, b, depth = 4) {
        if (depth <= 0) {
            console.warn("Comparison deeper than depth!", a, b);
            return true
        }

        // Check for nulls as null is also typeof object
        if (a == null && b == null) return true
        else if (a == null || b == null) return false

        if (typeof a !== typeof b) return false
        if (typeof a === "object") {
            if (Array.isArray(a)) {
                return a.every((val, idx) => {
                    return Compare.deep(val, b[idx], depth--)
                })
            } else {
                let same = true
                for (let key of Object.keys(a)) {
                    if (!Compare.deep(a[key], b[key], depth--)) {
                        same = false
                        break
                    }
                }
                return same
            }
        } else {
            return a === b
        }
    }
}