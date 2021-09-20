const Auth = require("./auth.js")
const { Database } = require("./utils/database.js")

class Resolver {

    constructor(name, { tableName = null } = {}) {
        this.name = name
        this.tableName = tableName ? tableName : this.name
    }

    get capitalizedName() {
        return this.name[0].toUpperCase() + this.name.substr(1)
    }

    get resolvers() {
        const resolvers = {
            Query: {},
            Mutation: {}
        }

        const ref = this
        resolvers.Mutation[`add${this.capitalizedName}`] = function (_, args, context) {
            Auth.verifyContext(context)
            return ref.add(_, args, ref.tableName)
        }
        resolvers.Mutation[`update${this.capitalizedName}`] = function (_, args, context) {
            Auth.verifyContext(context)
            return ref.update(_, args, ref.tableName)
        }
        resolvers.Mutation[`delete${this.capitalizedName}`] = function (_, args, context) {
            Auth.verifyContext(context)
            return ref.delete(_, args, ref.tableName)
        }

        resolvers.Query[`${this.name}`] = function (_, args, context) { return ref.list(_, args, context, ref.tableName) }
        resolvers.Query[`get${this.capitalizedName}`] = function (_, args, context) { return ref.get(_, args, context, ref.tableName) }
        resolvers.Query[`search${this.capitalizedName}`] = function (_, args, context) { return ref.search(_, args, context, ref.tableName) }
        return resolvers
    }

    async add(_, args, tableName) {
        const obj = args.data
        return this.request(`INSERT INTO ${tableName} (${Object.keys(obj).join(",")}) VALUES (${Object.keys(obj).map((name) => `$[${name}]`)})`, obj)
    }

    async update(_, args) {
        const object = args.data
        const id = object.id

        if (!id || id <= 0) throw new Error("error.invalid_id")

        delete object.id
        const query = `UPDATE ${this.tableName} SET ${Object.keys(object).map((val, idx) => `${val}=$${idx + 2}`)} WHERE id=$1`
        return this.request(query, [id, ...Object.values(object)])
    }

    async delete(_, args) {
        return Database.none(`DELETE FROM ${this.tableName} WHERE id=$1`, [args.id])
    }

    async get(_, args) {
        return Database.one(`SELECT * FROM ${this.tableName} WHERE id=$1 `, [args.id])
    }

    async list() {
        return Database.manyOrNone(`SELECT * FROM ${this.tableName} ORDER BY name ASC`)
    }

    async search(_, args) {
        return Database.any(`SELECT * FROM ${this.tableName} WHERE unaccent(name) ILIKE unaccent($1) ORDER BY name ASC LIMIT ${process.env.MAX_SEARCH}`, `%${args.text}%`)
    }

    async request(query, params = []) {
        return Database.any(query, params)
    }
}


module.exports = Resolver