export default class Sort {

    static stringPropAlphabetically(property, asc = true) {
        return function (a, b) {
            var nameA = a[property]?.toUpperCase();
            var nameB = b[property]?.toUpperCase();

            let sort = 0
            if (nameA < nameB) sort = -1;
            else if (nameA > nameB) sort = 1;
            // Flip if not asc.
            if (!asc) sort *= -1
            return sort
        }
    }

}