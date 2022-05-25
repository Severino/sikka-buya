export default class Sort {

    static stringPropAlphabetically(property, asc = true) {
        return function (a, b) {
            var nameA = a[property]?.toUpperCase();
            var nameB = b[property]?.toUpperCase();

            let sort = nameA.localeCompare(nameB)
            // Flip if not asc.
            if (!asc) sort *= -1
            return sort
        }
    }

}