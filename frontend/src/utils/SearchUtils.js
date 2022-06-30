import deburr from "lodash.deburr"

export default class SearchUtils {

    static filter(text, items, property) {
        return items.filter((item) => {
            const target = property ? item[property] : item
            let str = !target ? '' : target;
            return deburr(str.toLowerCase()).match(
                deburr(text.toLowerCase())
            );
        });
    }


    // static filterProperty(filterText, list, property = "name") {
    //     if (filterText) {
    //         let text = latinize(filterText).toLowerCase();
    //         list = list.filter((item) => {
    //             return latinize(item[property]).toLowerCase().match(text);
    //         });
    //     }
    //     return list
    // }

}