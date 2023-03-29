class QueryBuilder {


    constructor(table) {
        this.table = table
        this._selects = []
        this._joins = []
        this._wheres = []
        this._havings = []
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
    * Add a WHERE statement to the query.
    * All statements will be concatenated by an AND statement
    * if you require an OR expression put it in one statement.
    * 
    * @param {*} str 
    */
    addWhere(...str) {
        this._wheres.push(...str.map(str => `(${str})`))
    }


    /**
    * Add a HAVING statement to the query.
    * All statements will be concatenated by an AND statement
    * if you require an OR expression put it in one statement.
    * 
    * @param {*} str 
    */
    addHaving(...str) {
        this._havings.push(...str.map(str => `(${str})`))
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

    get having() {
        return (this._havings.length > 0) ? `HAVING ${this._havings.join(" AND ")}` : ""
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
        ${this.having}
        ${orderBy == "" ? "" : "ORDER BY " + orderBy}
        `
    }

    buildWhere(operator = "AND") {
        return this.buildWhere(this._wheres, operator)
    }

    buildHaving(operator = "AND") {
        return this.buildHaving(this._havings, operator)
    }

    static buildWhere(conditions, operator = "AND") {
        return this.buildConditional("WHERE", conditions, operator)
    }

    static buildHaving(conditions, operator = "AND") {
        return this.buildConditional("HAVING", conditions, operator)
    }

    static buildConditional(command, conditions, operator = "AND") {
        if (!conditions || conditions.length == 0) return ""
        return `${command} ${conditions.join(` ${operator} `)} `
    }

}

module.exports = QueryBuilder