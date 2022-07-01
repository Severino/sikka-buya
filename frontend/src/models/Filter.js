import StringUtils from '../utils/StringUtils';

export default class Filter {

    constructor(name) {
        this.name = name
    }

    static activeSelector(name) {
        return "active" + StringUtils.capitalize(name) + "s"
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

    mapData() {
        return {
            [this.name]: { id: null, name: '' },
            [Filter.activeSelector(this.name)]: []
        }
    }

    mapMethods() {
        return {
            [Filter.selectMethodName(this.name)]: this.selectFilter(this.name),
            [Filter.removeMethodName(this.name)]: this.removeFilter(this.name),
            [Filter.hasMethodName(this.name)]: this.hasFilter(this.name),
        }
    }


    selectFilter(name) {
        return function (target) {
            if (!this["has" + StringUtils.capitalize(name) + "Filter"](target)) {
                this.filters[Filter.activeSelector(name)].push(target);
            }
            this.filters[name] = { id: null, name: '' };
            this.filterChanged()
        }
    }

    removeFilter(name) {
        return function (target) {
            if (this["has" + StringUtils.capitalize(name) + "Filter"](target)) {
                this.filters[Filter.activeSelector(name)] = this.filters[Filter.activeSelector(name)].filter(
                    (el) => el.id != target.id
                );
                this.filterChanged()
            }
        }
    }

    hasFilter(name) {
        return function (target) {
            return this.filters[Filter.activeSelector(name)]
                .map((el) => el.id)
                .includes(target.id);
        }

    }
}
