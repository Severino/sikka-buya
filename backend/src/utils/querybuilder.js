class QueryBuilder {


    constructor(table) {
        this.table = table
        this._selects = []
        this._joins = []
        this._wheres = []
        this._having = []
    }

    /**
     * Add a select part to the query.
     * You can either add multiple parts in one string, 
     * or use multiple addSelects
     * 
     * @param {*} str 
     */
    addSelect(...str) {
        this._selects.push(...str)
    }

    /**
     * Add join clauses.
     * 
     * NOTE: In contrast to the other Requires a 'join' keyword in the statement. E.g. "LEFT JOIN ..." 
     * 
     * @param {*} str 
     */
    addJoin(str) {
        this._joins.push(str)
    }

    /**
    * Add a conditional statement to the query.
    * All statements will be concatenated by an AND statement
    * if you require an OR expression put it in one statement.
    * 
    * @param {*} str 
    */
    addWhere(...str) {
        this._wheres.push(...str.map(str => `(${str})`))
    }



    get select() {
        return `SELECT ${this._selects.join(", ")}`
    }

    get from() {
        return `FROM ${this.table}`
    }

    get joins() {
        return `${this._joins.join("\n")}`
    }

    get where() {
        return (this._wheres.length > 0) ? `WHERE ${this._wheres.join(" AND ")}` : ""
    }


    buildSelect({
        orderBy = "",
        groupBy = ""
    } = {}) {
        return `
        ${this.select}
        ${this.from}
        ${this.joins}
        ${this.where}
        ${groupBy == "" ? "" : "GROUP BY " + groupBy} 
        ${orderBy == "" ? "" : "ORDER BY " + orderBy}
        `
    }

}

module.exports = QueryBuilder