import StringUtils from '../utils/StringUtils';

export default class Filter {

    constructor(name) {
        this.name = name
    }

    static searchPrefix = "__search"

    static searchVariableName(name) {
        return Filter.searchPrefix + StringUtils.capitalize(name)
    }

    static selectMethodName(name) {
        return "select" + StringUtils.capitalize(name) + "Filter"
    }

    static removeMethodName(name) {
        return "remove" + StringUtils.capitalize(name) + "Filter"
    }

    static hasMethodName(name) {
        return "has" + StringUtils.capitalize(name) + "Filter"
    }

    static unsetFilter(name) {
        return {
            [name]: [],
            [Filter.searchVariableName(name)]: { id: null, name: '' }
        }

    }

    mapData() {
        return Filter.unsetFilter(this.name)
    }

    mapMethods() {
        return {
            [Filter.selectMethodName(this.name)]: this.selectFilter(this.name),
            [Filter.removeMethodName(this.name)]: this.removeFilter(this.name),
            [Filter.hasMethodName(this.name)]: this.hasFilter(this.name),
        }
    }


    selectFilter() {
        const name = this.name
        return function (target) {
            if (!this["has" + StringUtils.capitalize(name) + "Filter"](target)) {
                target.id = parseInt(target.id)
                this.filters[name].push(target);
            }
            this.filters[Filter.searchVariableName(name)] = { id: null, name: '' };
        }
    }

    removeFilter() {
        const name = this.name
        return function (target) {
            if (this["has" + StringUtils.capitalize(name) + "Filter"](target)) {
                this.filters[name] = this.filters[name].filter(
                    (el) => el.id != target.id
                );
            }
        }
    }

    hasFilter() {
        const name = this.name
        return function (target) {
            return this.filters[name]
                .map((el) => el.id)
                .includes(target.id);
        }

    }
}
