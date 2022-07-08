class QueryBuilder {


    constructor() {
        this.select = []
        this.join = []
        this.where = []
    }

    addWhere(str) {
        this.where.push(str)
    }

    addJoin(str) {
        this.join.push(str)
    }

    addSelect(str) {
        this.select.push(str)
    }

}

module.exports = QueryBuilder