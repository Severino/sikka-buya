const Auth = require('../auth')
const { guardFunctionObject: guard } = require('../utils/guard.js')
const { WriteableDatabase, pgp } = require('../utils/database.js')
const Type = require('../utils/type')

/**
 * Most mutations require the user to be logged in to
 * manipulate the database.
 * 
 * There are a few exceptions though, e.g.:
 * - InitialSetup of the super user
 * - Acception an invite to join as user
 * - ...
 */
const UnguardedMutations = {

    async acceptInvite(_, { email, password } = {}) {
        let pwValidator = Auth.validatePassword(password)
        if (pwValidator.failed) {
            throw new Error(pwValidator.error)
        }

        const hashedPW = await Auth.hashPassword(password)
        let result = await WriteableDatabase.oneOrNone("UPDATE app_user SET password = $[password] WHERE email=$[email] AND password IS NULL RETURNING id", { email, password: hashedPW })
        if (result == null) throw new Error("Could not set password!")
    },

    async setup(_, args) {
        let { case: result } = await WriteableDatabase.one(`SELECT CASE 
        WHEN EXISTS (SELECT * FROM app_user LIMIT 1) THEN 1
        ELSE 0 
      END`)

        if (result == 0) {

            const {
                email,
                password
            } = args

            let emailValidator = Auth.validateEmail(email)
            if (!emailValidator.ok) throw new Error(emailValidator.error)

            let passwordValidator = Auth.validatePassword(password)
            if (!passwordValidator.ok) throw new Error(passwordValidator.error)

            if (password && email) {
                const hashedPW = await Auth.hashPassword(password)
                let { id } = await WriteableDatabase.one("INSERT INTO app_user (email, password, super) VALUES ($[email], $[password], TRUE) RETURNING id", { email, password: hashedPW })


                let authResponse = {
                    success: true,
                    token: Auth.sign({ id, email, isSuper: true }),
                    message: null,
                    user: {
                        id,
                        email,
                        super: true
                    }
                }

                return authResponse
            } else {
                throw new Error("You must provide an email and a password!")
            }
        } else {
            throw new Error("Superuser was already initialized!")
        }
    }
}

const SuperUserMutations = {
    async deleteUser(_, args) {
        return WriteableDatabase.none("DELETE FROM app_user WHERE id=$[id]", args)
    },
    async inviteUser(_, { email } = {}) {
        let mailValidation = Auth.validateEmail(email)
        if (!mailValidation.ok) throw new Error(mailValidation.error)
        return await WriteableDatabase.none("INSERT INTO app_user (email) VALUES ($1)", email)
    },
    async promoteUser(_, { email } = {}) {
        return WriteableDatabase.none("UPDATE app_user SET super=TRUE WHERE email=$1", email)
    },
    async demoteUser(_, { email } = {}, context) {
        let user = Auth.verifyContext(context)
        if (user.email === email) throw new Error("You can't demote yourself!")
        return WriteableDatabase.none("UPDATE app_user SET super=FALSE WHERE email=$1", email)
    }
}


const UserMutations = {
    async moveCoinTypeToCoinVerse(_, { id } = {}) {
        await WriteableDatabase.tx(async t => {
            let res = await t.oneOrNone(`SELECT * FROM coin_marks WHERE id=$1`, id)
            if (!(res && res.name)) throw new Error("Coin mark does not exist!")
            let { id: verseId } = await t.one(`INSERT INTO coin_verse (name) VALUES ($1) RETURNING id`, res.name)
            let rows = await t.manyOrNone(`SELECT type FROM type_coin_marks WHERE coin_mark=$1`, id)
            rows = rows.map(obj => {
                obj.coin_verse = verseId
                return obj
            })
            let query = pgp.helpers.insert(rows, ["type", "coin_verse"], 'type_coin_verse')
            await t.any(query)
            await t.any(`DELETE FROM type_coin_marks WHERE coin_mark=$1`, id)
            await t.none(`DELETE FROM coin_marks WHERE id=$1`, id)
        })
    },
    async moveCoinVerseToCoinType(_, { id } = {}) {
        await WriteableDatabase.tx(async t => {
            let res = await t.oneOrNone(`SELECT * FROM coin_verse WHERE id=$1`, id)
            if (!(res && res.name)) throw new Error("Coin verse does not exist!")
            let { id: verseId } = await t.one(`INSERT INTO coin_marks (name) VALUES ($1) RETURNING id`, res.name)
            let rows = await t.manyOrNone(`SELECT type FROM type_coin_verse WHERE coin_verse=$1`, id)
            rows = rows.map(obj => {
                obj.coin_mark = verseId
                return obj
            })
            let query = pgp.helpers.insert(rows, ["type", "coin_mark"], 'type_coin_marks')
            await t.any(query)
            await t.any(`DELETE FROM type_coin_verse WHERE coin_verse=$1`, id)
            await t.none(`DELETE FROM coin_verse WHERE id=$1`, id)
        })
    },
    async changePersonExplorerOrder(_, args) {
        return WriteableDatabase.none("INSERT INTO person_explorer_custom_sorting (person, position) VALUES ($[person], $[position]) ON CONFLICT (person) DO UPDATE SET position=$[position]", args)
    },
    async updateNote(_, args) {
        let { text, property, propertyId: property_id } = args
        await WriteableDatabase.none(`
            INSERT INTO note (text, property, property_id) 
            VALUES ($[text], $[property], $[property_id])
            ON CONFLICT (property, property_id)
            DO UPDATE SET text=$[text]
            WHERE note.property=$[property] AND note.property_id=$[property_id];
            `, { text, property, property_id })

    },
    async updateLang(_, args, context) {
        let { id,
            table,
            lang,
            attr,
            value } = args
        const langTable = `${table}_${lang}`

        if (langTables.indexOf(langTable) == -1) {
            throw new Error(`The table you want to enter a language attribute into is not whitelisted. Contact developer if you really want to update '${langTable}'.`)
        } else {
            let obj = {
                id
            }
            obj[attr] = value
            const query = pgp.helpers.insert(obj, null, langTable)
            await WriteableDatabase.none(query + " ON CONFLICT (id) DO UPDATE SET $[attr:name]=$[value]", { attr, value })
        }
    },
    async updateMaterialColor(_, args) {
        return WriteableDatabase.none(`INSERT INTO material_color (material, color) VALUES ($[id], $[color]) ON CONFLICT (material) DO UPDATE SET color=$[color]`, args)
    },
    async addComment(_, args) {
        let { text,
            user,
            property,
            propertyId: property_id } = args



        await WriteableDatabase.none("INSERT INTO comment (text, property, property_id, user_id) VALUES ($[text], $[property], $[property_id],$[user])", {
            text,
            property,
            property_id,
            user
        })
    },

    async addCoinType(_, args, context, info) {
        return Type.addType(_, args, context, info)
    },
    async deleteCoinType(_, args, context, info) {
        return Type.deleteType(args.id)
    },
    async updateCoinType(_, args, context) {
        if (!args.id) throw new Error("No id provided!")

        return Type.updateType(args.id, args.data)
    },
    async setTypeComplete(_, {
        completed = true,
        id = null
    } = {}, context) {
        if (completed) {
            await WriteableDatabase.none("INSERT INTO type_completed (type) VALUES ($1) ON CONFLICT DO NOTHING", id)
        } else {
            await WriteableDatabase.none("DELETE FROM type_completed WHERE type=$1", id)
        }
        return completed
    },
    async setTypeReviewed(_, {
        reviewed = true,
        id = null,
    } = {}, context) {
        if (reviewed) {
            await WriteableDatabase.none("INSERT INTO type_reviewed (type) VALUES ($1) ON CONFLICT DO NOTHING", id)
        } else {
            await WriteableDatabase.none("DELETE FROM type_reviewed WHERE type=$1", id)
        }
        return reviewed

    }
}

const Mutations = Object.assign({},
    UnguardedMutations,
    guard(UserMutations, (_, __, context) => {
        return Auth.requireAuthContext(context)
    }),
    guard(SuperUserMutations, (_, __, context) => Auth.requireSuperUser(context))
)

module.exports = Mutations