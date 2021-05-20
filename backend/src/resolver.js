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
            if (!Auth.verifyContext(context)) {
                throw new Error('You are not authenticated!')
            }

            return ref.add(_, args, context, ref.tableName)
        }
        resolvers.Mutation[`update${this.capitalizedName}`] = function (_, args, context) {
            if (!Auth.verifyContext(context)) {
                throw new Error('You are not authenticated!')
            }

            return ref.update(_, args, context, ref.tableName)
        }
        resolvers.Mutation[`delete${this.capitalizedName}`] = function (_, args, context) {
            if (!Auth.verifyContext(context)) {
                throw new Error('You are not authenticated!')
            }

            return ref.delete(_, args, context, ref.tableName)
        }

        resolvers.Query[`${this.name}`] = function (_, args, context) { return ref.list(_, args, context, ref.tableName) }
        resolvers.Query[`get${this.capitalizedName}`] = function (_, args, context) { return ref.get(_, args, context, ref.tableName) }
        resolvers.Query[`search${this.capitalizedName}`] = function (_, args, context) { return ref.search(_, args, context, ref.tableName) }
        return resolvers
    }
    async add(_, args, context, tableName) {
        if (!Auth.verifyContext(context)) {
            throw new Error('You are not authenticated!')
        }

        const object = args.data
        return this.request(`INSERT INTO ${tableName} (${Object.keys(object).join(",")}) VALUES (${Object.keys(object).map((name) => `$[${name}]`)})`, Object.values(object))
    }

    async update(_, args, context) {
        if (!Auth.verifyContext(context)) {
            throw new Error(Auth.verificationError)
        }

        const object = args.data
        const id = object.id

        if (!id || id <= 0) throw new Error("error.invalid_id")

        delete object.id
        const query = `UPDATE ${this.tableName} SET ${Object.keys(object).map((val, idx) => `${val}=$${idx + 2}`)} WHERE id=$1`
        return this.request(query, [id, ...Object.values(object)])
    }

    async delete(_, args, context) {
        if (!Auth.verifyContext(context)) {
            throw new Error(Auth.verificationError)
        }

        return Database.none(`DELETE FROM ${this.tableName} WHERE id=$1`, [args.id])
    }

    async get(_, args) {
        return Database.one(`SELECT * FROM ${this.tableName} WHERE id=$1 `, [args.id])
    }

    async list() {
        return Database.manyOrNone(`SELECT * FROM ${this.tableName} ORDER BY name ASC`)
    }

    async search(_, args) {
        return Database.any(`SELECT * FROM ${this.tableName} WHERE unaccent(name) ILIKE $1 ORDER BY name ASC`, `%${args.text}%`)
    }

    async request(query, params = []) {
        return Database.any(query, params)
    }
}


module.exports = Resolver