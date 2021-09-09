const Resolver = require("../resolver.js")
const { Database } = require("../utils/database.js")
const SQLUtils = require("../utils/sql.js")
const { transformPropertyToSnakeCase } = require("../utils/sql.js")
const Person = require("../models/person.js")

class PersonResolver extends Resolver {

    constructor() {
        super("person")
    }

    async add(_, args) {
        args.data = transformPropertyToSnakeCase(args.data, "shortName")
        return super.add(...arguments)
    }

    async update(_, args) {

        SQLUtils.removeNullProperty(args, "dynasty")
        SQLUtils.removeNullProperty(args, "role")
        args.data = transformPropertyToSnakeCase(args.data, "shortName")


        return super.update(...arguments)
    }

    async get(_, args) {
        let result = await Database.one(`
        SELECT p.id, p.name, p.short_name,
        r.id AS role_id, r.name AS role_name,
        d.id AS dynasty_id, d.name AS dynasty_name
        FROM $[table:name] p
        LEFT JOIN person_role r ON p.role = r.id 
        LEFT JOIN dynasty d ON p.dynasty = d.id
        WHERE p.id=$[id]
        ORDER BY name ASC
        `, {
            table: this.tableName,
            id: args.id
        })

        return Person.decomposePersonResult(result)
    }



    async list() {

        let result = await Database.manyOrNone(`
        SELECT p.id, p.name, p.short_name,
        r.id AS role_id, r.name AS role_name,
        d.id AS dynasty_id, d.name AS dynasty_name
        FROM $[table:name] p
        LEFT JOIN person_role r ON p.role = r.id 
        LEFT JOIN dynasty d ON p.dynasty = d.id
        ORDER BY name ASC`, {
            table: this.tableName
        })

        result = result.map(item => {
            return Person.decomposePersonResult(item)
        })


        return result
    }

    async search(_, args) {
        console.log("PRES")

        let result = await Database.manyOrNone(`
        SELECT p.id, p.name, p.short_name,
        r.id AS role_id, r.name AS role_name,
        d.id AS dynasty_id, d.name AS dynasty_name
        FROM $[table:name] p
        LEFT JOIN person_role r ON p.role = r.id 
        LEFT JOIN dynasty d ON p.dynasty = d.id
        WHERE unaccent(p.name) 
        ILIKE unaccent($[search]) 
        ORDER BY p.name ASC
        LIMIT ${process.env.MAX_SEARCH}
        `, {
            table: this.tableName,
            search: `%${args.text}%`
        })

        return result.map(res => Person.decomposePersonResult(res))
    }

    async request(query, params = []) {
        return Database.any(query, params)
    }

}

module.exports = PersonResolver