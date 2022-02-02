import latinize from "latinize"


export default class SearchUtils {


    static filter(filterText, list, property = "name") {
        if (filterText) {
            let text = latinize(filterText).toLowerCase();
            list = list.filter((item) => {
                return latinize(item[property]).toLowerCase().match(text);
            });
        }
        return list
    }

}