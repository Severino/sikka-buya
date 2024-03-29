const Auth = require('../auth')
const { guardFunctionObject: guard } = require('../utils/guard.js')
const { WriteableDatabase, pgp } = require('../utils/database.js')
const Type = require('../utils/type')
const PageGQL = require('./klasses/PageGQL')
const BlockGQL = require('./klasses/BlockGQL')
const CMS = require('../cms')
const Argument = require('../argument')
const Language = require('../language')

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
    async grantPermission(_, { user, permission } = {}) {
        if (permission === "super")
            WriteableDatabase.none("UPDATE app_user SET super=TRUE WHERE id=$1", user)
        else
            WriteableDatabase.none("INSERT INTO app_user_privilege (app_user, privilege) VALUES ($[user], $[permission])", { user, permission })
    },
    async revokePermission(_, { user, permission } = {}, context) {
        if (permission === "super") {
            return WriteableDatabase.none("UPDATE app_user SET super=FALSE WHERE id=$1", user)
        } else
            WriteableDatabase.none("DELETE FROM app_user_privilege WHERE app_user=$[user] AND privilege=$[permission]", { user, permission })
    },
    async setTypeComplete(_, {
        completed = true,
        id = null
    } = {}) {
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
    } = {}) {
        if (reviewed) {
            await WriteableDatabase.none("INSERT INTO type_reviewed (type) VALUES ($1) ON CONFLICT DO NOTHING", id)
        } else {
            await WriteableDatabase.none("DELETE FROM type_reviewed WHERE type=$1", id)
        }
        return reviewed
    },
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
        const { super: isSuperUser } = Auth.verifyContext(context)

        if (!isSuperUser) {
            const { completed, reviewed } = await WriteableDatabase.oneOrNone(`
        SELECT 
            CASE WHEN type_completed.type is null
            then False
            else True 
            END as completed,

            CASE WHEN type_reviewed.type is null
            then False
            else True
            END as reviewed
        FROM type 
        LEFT JOIN type_completed ON type_completed.type = type.id
        LEFT JOIN type_reviewed ON type_reviewed.type = type.id
        WHERE id=$[id]
        `, { id })

            if (completed || reviewed) {

                throw new Error("error.type.delete.only_super_can_delete_completed_or_reviewed_types")
            }
        }

        return Type.deleteType(args.id)
    },
    async updateCoinType(_, args, context) {
        if (!args.id) throw new Error("No id provided!")

        return Type.updateType(args.id, args.data, context)
    },
    setLang(_, { path, lang, singular, plural } = {}) {
        Argument.require({ path, lang, singular })
        Language.set(path, lang, singular, plural)
    }
}

/**
 * Editors are users that have the 'editor' privilege set.
 * 
 * 
 * Generally any priovilege (just a string) can be stored in the 'app_user_privilege' table 
 * and be used to guard specific routes like it's done with the editor mutations.
 */
const EditorMutations = {
    async uploadFile(_, { identity, file: filePromise }) {
        if (!identity) throw new Error("Identity field is required!")
        if (!filePromise) throw new Error("File field is required!")

        const { parts, filename } = CMS.decomposeIdentity(identity)
        await CMS.removeExistingFiles(parts, filename)
        try {
            const fileURI = await CMS.writeFileFromPromise(parts, filename, filePromise)
            console.log("File was uploaded to: " + fileURI)
        } catch (e) {
            console.log("ERROR OCCURED: ", e)
        }
    },
}



const Mutations = Object.assign({},
    UnguardedMutations,
    guard(
        Object.assign(
            UserMutations,
            PageGQL.Mutations,
            BlockGQL.Mutations
        ), (_, __, context) => {
            return Auth.verifyContext(context)
        }),
    guard(EditorMutations, async (_, __, context) => await Auth.requirePermission(context, 'editor')),
    guard(SuperUserMutations, (_, __, context) => Auth.requireSuperUser(context))
)

module.exports = Mutations