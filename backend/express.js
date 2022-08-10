const Mint = require('./src/models/mint.js')
const { pgp, Database, setupDatabase } = require('./src/utils/database.js')
const Person = require('./src/utils/person.js')

const fs = require('fs').promises

async function start({
    expressPort,
    routes = []
} = {}) {


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
    const MaterialResolver = require("./src/resolver/materialresolver.js");


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
            new MaterialResolver(),
            new MintResolver(),
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

                isSuperUserSet: async function () {
                    let result
                    try {
                        result = await Database.one(`SELECT COUNT(*) FROM app_user WHERE super=true`)
                        return result.count > 0
                    } catch (e) {
                        return false
                    }
                },
                databaseExists: async function () {
                    return new Promise(resolve => {
                        Database.connect().then((result) => {
                            result.done()
                            resolve(true)
                        }
                        ).catch(() => resolve(false))
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
                searchCaliph: function () {

                    return Person.searchCaliph(...arguments)
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
                searchPersonsWithRole: function () {
                    return Person.searchWithRole(...arguments)
                },
                searchPersonsWithoutRole: function () { return Person.searchWithoutRole(...arguments) },
                getTypesByRuler: async function () {
                    return Type.getTypesByRuler(...arguments)
                },
                searchType: async function () {
                    return Type.searchType(...arguments)
                },
                mintMaterials: async function () {
                    let result = await Database.manyOrNone(`SELECT mint.id, mint.name, 
                    json_agg(DISTINCT mat.material) AS materials
                    FROM type
                    LEFT JOIN mint ON mint.id = type.mint
                    JOIN (
                      SELECT DISTINCT ON (id, "id", "name", "color")
                        id, json_build_object('material_id', "id", 'material_name', "name", 'material_color', "color")::jsonb AS material
                      FROM material
						LEFT JOIN material_color mc ON mc.material = id 
                    ) AS mat ON mat.id = type.material
                    GROUP BY type.mint, mint.id, mint.name
                    ORDER BY mint.name;
                    `)

                    return result.map(result => {
                        return {
                            mint: { id: result.id, name: result.name },
                            materials: result.materials.map(mat => {
                                return {
                                    id: mat.material_id,
                                    name: mat.material_name,
                                    color: mat.material_color
                                }
                            })
                        }
                    })

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
                        return await Database.manyOrNone("SELECT id, email, super FROM app_user")
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
                getMaterialColor: async function (_, args) {
                    const result = await Database.oneOrNone(`SELECT color FROM material_color WHERE material=$[id]`, args)
                    return (result?.color) ? result.color : null
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
                },
                typeCountOfMints: async function (_, args) {
                    const ids = args.ids
                    if (ids.length > process.env.MAX_SEARCH) throw new Error(`Too many ids requested.`)

                    const mintArray = []

                    for (let id of ids) {
                        const mint = await Mint.getById(id)

                        const result = await Database.manyOrNone(`
                        SELECT  m.id, m.name,  year_of_mint,  COUNT(*) 
                        FROM type 
                        LEFT JOIN mint m ON type.mint = m.id 
                        WHERE mint=$[id]
                        AND year_of_mint~ '^[0-9]+$'
                        AND exclude_from_map_app!=True 
                        GROUP BY year_of_mint, m.name, m.id
                        ORDER BY year_of_mint;`,
                            { id })

                        mintArray.push({
                            mint,
                            data: result.map(({ year_of_mint, count }) => {
                                return { x: year_of_mint, y: count }
                            }, {})
                        })
                    }

                    return mintArray
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
                async updateMaterialColor(_, args) {
                    return Database.none(`INSERT INTO material_color (material, color) VALUES ($[id], $[color]) ON CONFLICT (material) DO UPDATE SET color=$[color]`, args)
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
                        } = args

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
                deleteUser: async function (_, args, context, info) {
                    Auth.requireSuperUser(context)
                    return Database.none("DELETE FROM app_user WHERE id=$[id]", args)
                },
                addCoinType: async function (_, args, context, info) {
                    if (!Auth.verifyContext(context)) {
                        throw new Error('You are not authenticated!')
                    }

                    return Type.addType(_, args, context, info)
                },
                deleteCoinType: async function (_, args, context, info) {
                    if (!Auth.verifyContext(context)) {
                        throw new Error('You are not authenticated!')
                    }

                    return Type.deleteType(args.id)
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

        for (let route of routes) {
            const method = route.method || "all"
            app[method](route.route, route.handler)
        }

        app.use("/", (req, res, next) => {
            res.send("Welcome")
        })



        const instance = app.listen(expressPort, () => {
            console.log(`Express GraphQL Server Is Running On http://localhost:${expressPort}/graphql`)
            resolve({ app, instance })
        })
    })
}

module.exports = start