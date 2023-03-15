const { pgp, Database } = require('../utils/database')
const QueryBuilder = require('../utils/querybuilder')

class User {

    static queryBuilder() {
        const builder = new QueryBuilder("app_user")
        builder.addSelect(`id, email, password, coalesce(super, FALSE) as super, coalesce(array_agg(app_user_privilege.privilege) filter (where app_user_privilege.privilege is not null),'{}') as permissions`)
        builder.addJoin(`LEFT JOIN app_user_privilege ON app_user.id = app_user_privilege.app_user`)
        return builder
    }

    static _getBy({ where = null } = {}) {
        if (!where) throw new Error("Missing 'where' clause.")
        const queryBuilder = this.queryBuilder()
        queryBuilder.addWhere(where)
        const query = queryBuilder.buildSelect({ groupBy: `(id, email, password, super)` })
        return Database.oneOrNone(query)
    }

    static async byId(id) {
        return this._getBy({where: pgp.as.format(`id = $[id]`, { id })})
    }

    static async byMail(email) {
        return this._getBy({where: pgp.as.format(`email = $[email]`, { email })})
    }

    static async list() {
        const queryBuilder = this.queryBuilder()
        const query = queryBuilder.buildSelect({ groupBy: `(id, email, password, super)` })
        return await Database.manyOrNone(query)
    }

}

module.exports = {
    User
}