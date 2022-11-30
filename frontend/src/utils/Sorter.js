import StringUtils from './StringUtils';

export default class Sort {

    static stringAlphabetically(asc = true) {
        return function (a, b) {

            // If an element is missing, we just push it
            // to the end of the 
            if (a == null) return 1
            if (b == null) return -1

            a = Sort._removeCharactersThatObstructSorting(a.toUpperCase())
            b = Sort._removeCharactersThatObstructSorting(b.toUpperCase())

            let sort = a.localeCompare(b)
            // Flip if not asc.
            if (!asc) sort *= -1
            return sort
        }
    }

    static stringPropAlphabetically(propertyNameOrPath, asc = true) {
        return function (objA, objB) {
            const path = propertyNameOrPath.split(".")

            let a = objA
            let b = objB

            while (path.length > 0) {
                let property = path.shift()


                a = a?.[property] ? a[property] : null
                b = b?.[property] ? b[property] : null
            }

            return Sort.stringAlphabetically(asc)(a, b)
        }
    }

    static _removeCharactersThatObstructSorting(str) {
        str = StringUtils.removeLeftHalfRing(str)
        str = StringUtils.removePrefix(str, "AL-")
        str = StringUtils.removePrefix(str, "AD-")
        str = StringUtils.removePrefix(str, "AR-")
        return str
    }

}