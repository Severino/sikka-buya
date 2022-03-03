export default class Sort {

    static stringsByProperty(a, b) {
        var nameA = a.shortName?.toUpperCase();
        var nameB = b.shortName?.toUpperCase();
        if (nameA < nameB) return -1;
        else if (nameA > nameB) return 1;
        else return 0;
    }

}