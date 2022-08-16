import StringUtils from './StringUtils';

export default class Sort {

    static stringAlphabetically(asc = true) {
        return function (a, b) {
            if (!a) return 1
            if (!b) return -1

            a = Sort._removeCharactersThatObstructSorting(a)
            b = Sort._removeCharactersThatObstructSorting(b)

            let sort = a.localeCompare(b)
            // Flip if not asc.
            if (!asc) sort *= -1
            return sort
        }
    }

    static stringPropAlphabetically(property, asc = true) {
        return function (objA, objB) {
            var a = Sort._removeCharactersThatObstructSorting(objA[property]?.toUpperCase())
            var b = Sort._removeCharactersThatObstructSorting(objB[property]?.toUpperCase());

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