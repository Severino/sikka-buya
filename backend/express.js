const fs = require('fs').promises

async function start({
    dbUser,
    dbPassword,
    dbName,
    dbHost,
    dbPort,
    expressPort,
    jwtSecret,
    testEnvironment
} = {}) {

    process.env.DB_USER = dbUser
    process.env.DB_PASSWORD = dbPassword
    process.env.DB_NAME = dbName
    process.env.DB_HOST = dbHost
    process.env.DB_PORT = dbPort
    process.env.JWT_SECRET = jwtSecret
    process.env.TEST_ENVIRONMENT = testEnvironment || false

    /**
     * Database Packages
     */
    const { pgp, Database } = require("./src/utils/database.js")



    /**
     * Express packages
     */
    const express = require("express")
    const cors = require("cors")
    const path = require("path")


    /**
     * GraphQL Imports
     */
    const { graphqlHTTP } = require("express-graphql")
    const { loadSchemaSync } = require('@graphql-tools/load');
    const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
    const { addResolversToSchema } = require('graphql-tools');

    /**
     * Custom GraphQL Extensions
     */
    const Resolver = require("./src/resolver.js")
    const MintResolver = require("./src/resolver/mintresolver.js");
    const PersonResolver = require("./src/resolver/personresolver.js");

    /**
     * Custom Utility Packages
     */
    const SQLUtils = require("./src/utils/sql.js");
    const Type = require("./src/utils/type.js");
    const Auth = require("./src/auth.js");


    return new Promise(resolve => {
        const app = express()

        /**
         * Enables more traffic to the server.
         */
        app.use(express.json({ limit: '10mb' }))
        app.use(express.urlencoded({ extended: true, limit: '10mb' }))

        /**
         * The cors middleware allows (currently) all cross-domain calls.
         */
        app.use(cors(["http://localhost", "https://localhost", "127.0.0.1"]))

        /**
         * The Resolver class combines the basic operations of
         * get, add, delete, update and list in one convenient utility.
         */
        const resolverClasses = [
            new Resolver("coinMark", { tableName: "coin_marks" }),
            new Resolver("material"),
            new MintResolver("mint"),
            new Resolver("title"),
            new PersonResolver(),
            new Resolver("honorific"),
            new Resolver("nominal"),
            new Resolver("dynasty"),
            new Resolver("role", { tableName: "person_role" }),
            new Resolver("province")
        ]

        const langTables = ['material_en']


        /**
         *  Here custom resolvers are added to the object.
         */
        const resolvers = {
            Query: {
                ping: () => Date.now(),
                environment: () => {
                    return (process.env.TEST_ENVIRONMENT) ? "testing" : "production"
                },
                databaseExists: async function () {
                    return new Promise(resolve => {
                        Database.connect().then(() => resolve(true)).catch(() => resolve(false))
                    })
                },
                ruledMint: async function (_, { year } = {}) {
                    if (!year) throw new Error("Year is a required parameter")

                    let mints = await Database.manyOrNone(`
           SELECT type.id AS type_id, m.name AS mint_name, ST_AsGeoJSON(m.location) AS mint_location FROM type
           INNER JOIN mint m ON m.id = type.mint
           WHERE year_of_mint='$[year]'
           `, { year })


                    for (let mint of Object.values(mints)) {
                        let result = await Type.getOverlordsByType(mint.type_id)
                        mint.overlords = result || []
                    }

                    mints = SQLUtils.objectifyList(mints, {
                        prefix: "mint_",
                        target: "mint",
                        keys: [
                            "name",
                            "location"
                        ]
                    })

                    return mints

                },
                timespan: async () => {

                    let range = await Database.manyOrNone(`SELECT year_of_mint FROM type WHERE year_of_mint !='' AND exclude_from_map_app=false;`)
                    range = range.map(row => row.year_of_mint).filter(res => res && res.match(/^\d+$/g)).sort()

                    if (range.length == 0) throw new Error("Could not get Range!")

                    return { from: range[0], to: range[range.length - 1] }
                },
                getCoinType: async function () {
                    return Type.getType(...arguments)
                },

                coinType: async function () {
                    return Type.list(...arguments)
                },
                getDominion: async function (_, args) {
                    const year = args.year
                    if (!year) throw new Error(`The query did not provide a year.`)

                    let result = await Database.manyOrNone(`
            SELECT DISTINCT 
            mint.id AS mint_id, 
            mint.name AS mint_name, 
            ST_AsGeoJSON(mint.location) AS mint_location,
            overlord.rank AS overlord_rank,
			person.id AS overlord_id,
            person.name AS overlord_name,
            person.short_name AS overlord_short_name,
            person.role AS overlord_role,
            person.dynasty AS overlord_dynasty
             FROM overlord
            INNER JOIN type ON type.id =overlord.type
            inner JOIN person ON person.id = overlord.person
            inner join mint ON mint.id = type.mint
            WHERE type.year_of_mint='$[year]' and mint.location IS NOT NULL and mint.uncertain IS NOT true
            ORDER BY person.id;
            `, { year })
                    let arr = []


                    result.forEach(dominion => {
                        const separator = "_"
                        const objects = ["mint", "overlord"]
                        let obj = {}
                        for (let [key, val] of Object.entries(dominion)) {
                            let matchedObject = null
                            for (let str of objects) {
                                if (key.startsWith(str + separator)) {
                                    key = key.replace(str + separator, "")
                                    key = SQLUtils.snakeToCamelCase(key)
                                    matchedObject = str
                                    break
                                }
                            }
                            if (!matchedObject) continue
                            else {
                                if (!obj[matchedObject]) obj[matchedObject] = {}
                                obj[matchedObject][key] = val
                            }
                        }

                        arr.push(obj)
                    })



                    let dominions = new Map()

                    arr.forEach(el => {
                        let id = el.overlord.id
                        if (!dominions.has(id)) dominions.set(id, { overlord: el.overlord, mints: [] })
                        let entries = dominions.get(id)
                        entries.mints.push(el.mint)
                    })


                    return Array.from(dominions.values())
                },
                searchPersonsWithRole: async function (_, args) {

                    const include = args.include
                    const exclude = args.exclude
                    const search = `%${args.text}%`

                    let query = pgp.as.format(`
                    SELECT 
                    p.*, 
                    r.id AS role_id, 
                    r.name AS role_name, 
                    d.id AS dynasty_id, 
                    d.name AS dynasty_name ,
                    c.color AS color
                    FROM person p
                    LEFT JOIN person_role r ON p.role = r.id
                    LEFT JOIN dynasty d ON p.dynasty = d.id
                    LEFT JOIN person_color c ON c.person = p.id
                    WHERE r IS NOT NULL 
                    AND unaccent(p.name) ILIKE $1`, search)


                    if (include) {
                        query = `${query} ${pgp.as.format("AND r.name IN ($1:list) IS true", include)}`
                    } else if (exclude) {
                        query = `${query} ${pgp.as.format("AND r.name IN ($1:list) IS NOT true", exclude)}`
                    }

                    result = await Database.manyOrNone(`${query} ORDER BY p.name ASC`)

                    result.forEach((item, idx) => {

                        result[idx].shortName = result[idx].short_name

                        result[idx] = SQLUtils.objectifyBulk(item, [{
                            prefix: "role_",
                            target: "role",
                            keys: ["id", "name"]
                        }, {
                            prefix: "dynasty_",
                            target: "dynasty",
                            keys: ["id", "name"]
                        }])
                    })

                    return result
                },
                searchPersonsWithoutRole: async function (_, args) {
                    const searchString = args.text
                    let result = await Database.manyOrNone(`
            SELECT * FROM person WHERE role IS NULL AND unaccent(name) ILIKE $1 ORDER BY name ASC
            LIMIT ${process.env.MAX_SEARCH}
            `, `%${searchString}%`)

                    result.forEach((item, idx) => {
                        result[idx]["role"] = { id: null, name: null }
                    })

                    return result
                },
                getTypesByRuler: async function () {
                    return Type.getTypesByRuler(...arguments)
                },
                searchType: async function () {
                    return Type.searchType(...arguments)
                },
                /**
               * Same as getCoinTypes, but also allow to filter for evaluation filters.
               */
                modGetTypes: async function (_, args, context) {
                    Auth.requireAuthContext(context)

                    args.additionalRows = [`CASE WHEN tc.type is null
                    then False
                    else True 
                    END AS completed`, `CASE WHEN tr.type is null
                    then False
                    else True 
                    END AS reviewed`]
                    args.additionalJoin = `LEFT JOIN type_completed tc ON t.id = tc.type
            LEFT JOIN type_reviewed tr ON t.id = tr.type`



                    const modTypes = await Type.getTypes(...arguments)
                    modTypes.modReview = modTypes.types
                    return modTypes
                },
                getTypeComplete: async function (_, { id = null } = {}) {
                    const result = await Database.one("SELECT exists(SELECT * FROM type_completed WHERE type=$1)", id);
                    return result.exists
                },
                getAnalytics: async function (_, { id = null } = {}) {
                    const count = await Database.one("SELECT COUNT(*) as types, COUNT(DISTINCT mint) AS mints, COUNT(DISTINCT year_of_mint) AS years  FROM type", id);

                    return {
                        typeCount: count.types,
                        mintCount: count.mints,
                        yearCount: count.years
                    }
                },
                login: async function (_, args) {
                    return Auth.login(_, args)
                },
                auth: async function (_, args) {
                    return Auth.verify(args.token)
                },
                users: async function (_, args, context) {
                    let auth = Auth.verifyContext(context)
                    if (!auth) {
                        throw new Error('You are not authenticated!')
                    } else {
                        return await Database.manyOrNone("SELECT id, email FROM app_user")
                    }
                },
                getComments: async function (_, args, context) {
                    let auth = Auth.verifyContext(context)
                    if (!auth) {
                        throw new Error('You are not authenticated!')
                    } else {
                        let { property,
                            propertyId: property_id } = args

                        let results = await Database.manyOrNone(
                            `SELECT n.*, u.email as user_email FROM comment n 
                        LEFT JOIN app_user u ON  n.user_id=u.id 
                        WHERE property=$[property] AND property_id=$[property_id]
                    `, { property, property_id })


                        SQLUtils.objectifyList(results, {
                            prefix: "user_",
                            target: "user",
                            keys: [
                                "id",
                                "email"
                            ]
                        })

                        return results
                    }
                },
                getNote: async function (_, args) {

                    let { propertyId, property } = args

                    let result = await Database.oneOrNone(`SELECT note.text from note WHERE property=$[property] AND property_id=$[propertyId]`, { propertyId, property })
                    return result?.text || ""
                },
                getLang: async function (_, args) {
                    let { id,
                        table,
                        lang,
                        attr } = args


                    const langTable = `${table}_${lang}`

                    if (langTables.indexOf(langTable) != -1) {
                        let result = await Database.oneOrNone(`SELECT $[attr:name] FROM ${langTable} WHERE id=$[id]`, { attr, id })
                        return result[attr]
                    } else return ""
                },
                getPersonExplorerOrder: async function () {
                    return Database.manyOrNone(`SELECT position as order, person FROM person_explorer_custom_sorting`)
                },
                fullSearchOnTypes: async function () {
                    return Type.fullSearchTypes(...arguments)
                },
                fixDiff: async function () {
                    let result = {}
                    const stats = await fs.stat("./scripts/out/änderungen_detail.json")
                    const json = require("./scripts/out/änderungen_detail.json")
                    result.lastModified = stats.mtime
                    result.items = json
                    return JSON.stringify(result)
                }
            }, Mutation: {
                changePersonExplorerOrder: async function (_, args) {
                    return Database.none("INSERT INTO person_explorer_custom_sorting (person, position) VALUES ($[person], $[position]) ON CONFLICT (person) DO UPDATE SET position=$[position]", args)
                },
                updateNote: async function (_, args) {
                    let { text, property, propertyId: property_id } = args
                    await Database.none(`
                    INSERT INTO note (text, property, property_id) 
                    VALUES ($[text], $[property], $[property_id])
                    ON CONFLICT (property, property_id)
                    DO UPDATE SET text=$[text]
                    WHERE note.property=$[property] AND note.property_id=$[property_id];
                    `, { text, property, property_id })

                },
                updateLang: async function (_, args) {
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
                        await Database.none(query + " ON CONFLICT (id) DO UPDATE SET $[attr:name]=$[value]", { attr, value })
                    }
                },
                addComment: async function (_, args) {
                    let { text,
                        user,
                        property,
                        propertyId: property_id } = args



                    await Database.none("INSERT INTO comment (text, property, property_id, user_id) VALUES ($[text], $[property], $[property_id],$[user])", {
                        text,
                        property,
                        property_id,
                        user
                    })
                },
                acceptInvite: async function (_, { email, password } = {}) {
                    let pwValidator = Auth.validatePassword(password)
                    if (pwValidator.failed) {
                        throw new Error(pwValidator.error)
                    }

                    const hashedPW = await Auth.hashPassword(password)

                    let result = await Database.oneOrNone("UPDATE app_user SET password = $[password] WHERE email=$[email] AND password IS NULL RETURNING id", { email, password: hashedPW })

                    if (result == null) throw new Error("Could not set password!")
                },
                setup: async function (_, args) {
                    let { case: result } = await Database.one(`SELECT CASE 
                WHEN EXISTS (SELECT * FROM app_user LIMIT 1) THEN 1
                ELSE 0 
              END`)

                    if (result == 0) {

                        const {
                            email,
                            password
                        } = args.data

                        let emailValidator = Auth.validateEmail(email)
                        if (!emailValidator.ok) throw new Error(emailValidator.error)

                        let passwordValidator = Auth.validatePassword(password)
                        if (!passwordValidator.ok) throw new Error(passwordValidator.error)

                        if (password && email) {
                            const hashedPW = await Auth.hashPassword(password)
                            let { id } = await Database.one("INSERT INTO app_user (email, password, super) VALUES ($[email], $[password], TRUE) RETURNING id", { email, password: hashedPW })


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
                },
                addCoinType: async function (_, args, context, info) {

                    if (!Auth.verifyContext(context)) {
                        throw new Error('You are not authenticated!')
                    }

                    return Type.addType(_, args, context, info)
                },
                inviteUser: async function (_, { email } = {}, context) {
                    if (!Auth.verifyContext(context)) {
                        throw new Error('You are not authenticated!')
                    }
                    let mailValidation = Auth.validateEmail(email)
                    if (!mailValidation.ok) throw new Error(mailValidation.error)

                    return await Database.none("INSERT INTO app_user (email) VALUES ($1)", email)
                },
                updateCoinType: async function (_, args, context) {
                    if (!Auth.verifyContext(context)) {
                        throw new Error('You are not authenticated!')
                    }

                    if (!args.id) throw new Error("No id provided!")

                    return Type.updateType(args.id, args.data)
                },
                setTypeComplete: async function (_, {
                    completed = true,
                    id = null
                } = {}, context) {
                    if (!Auth.verifyContext(context)) {
                        throw new Error('You are not authenticated!')
                    }

                    if (completed) {
                        await Database.none("INSERT INTO type_completed (type) VALUES ($1) ON CONFLICT DO NOTHING", id)
                    } else {
                        await Database.none("DELETE FROM type_completed WHERE type=$1", id)
                    }
                    return completed
                },
                setTypeReviewed: async function (_, {
                    reviewed = true,
                    id = null,
                } = {}, context) {
                    if (!Auth.verifyContext(context)) {
                        throw new Error('You are not authenticated!')
                    }

                    if (reviewed) {
                        await Database.none("INSERT INTO type_reviewed (type) VALUES ($1) ON CONFLICT DO NOTHING", id)
                    } else {
                        await Database.none("DELETE FROM type_reviewed WHERE type=$1", id)
                    }
                    return reviewed

                }
            }
        }


        /**
         * The schema file describes the requests a user can query 
         * to the graphql interface. 
         */
        const schemaFile = loadSchemaSync(path.join(__dirname, "./src/graphql/schema.graphql"), { loaders: [new GraphQLFileLoader()] })

        resolverClasses.forEach((resolverClass) => {
            Object.assign(resolvers.Query, resolverClass.resolvers.Query)
            Object.assign(resolvers.Mutation, resolverClass.resolvers.Mutation)
        })


        /**
         * The loaded schema is combined with the resolvers.
         */
        const schema = addResolversToSchema({
            schema: schemaFile, resolvers: {
                Query: Object.assign({}, resolvers.Query),
                Mutation: Object.assign({}, resolvers.Mutation)
            }
        })


        /**
         * Route of the GraphQL endpoint.
         */
        app.use('/graphql', graphqlHTTP({
            schema,
            graphiql: true
        }))

        app.use("/", (req, res, next) => {
            res.send("Welcome")
        })


        app.listen(expressPort, () => {
            console.log(`Express GraphQL Server Is Running On http://localhost:${expressPort}/graphql`)
            resolve()
        })

    })
}

module.exports = start