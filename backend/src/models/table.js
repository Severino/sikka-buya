/**
 * The table class describes a table and how to access the values 
 * of it within a SQL query.
 */

class Table {
    constructor(name, alias = null) {
        this.name = name
        this.alias = alias
    }

    get select() {
        return ""
    }

    get joins() {
        return ""
    }

    get name() {
        return (this.alias) ? this.alias : this.name
    }
}

class QueryManager {

    constructor() {
        this.tables = {}
    }

    addTable(table) {
        if (this.tables[table.name]) throw new Error(`Table ${table.name} already exists on query manager!`)
        this.table[table.name] = table
    }
}

module.exports = { Table, QueryManager };