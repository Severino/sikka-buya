


async function start({
    dbUser,
    dbPassword,
    dbName,
    dbHost,
    dbPort,
    expressPort,
    jwtSecret
} = {}) {

    process.env.DB_USER = dbUser
    process.env.DB_PASSWORD = dbPassword
    process.env.DB_NAME = dbName
    process.env.DB_HOST = dbHost
    process.env.DB_PORT = dbPort
    process.env.JWT_SECRET = jwtSecret

    /**
     * Database Packages
     */
    const { Database } = require("./src/utils/database.js")



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
            new Resolver("role", { tableName: "person_role" })
        ]



        /**
         *  Here custom resolvers are added to the object.
         */
        const resolvers = {
            Query: {
                ping: () => Date.now(),
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

                    // console.log(mints.findIndex(mint => mint.person.length > 0))

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

                    let range = await Database.manyOrNone(`SELECT year_of_mint FROM type WHERE year_of_mint !='';`)
                    range = range.map(row => row.year_of_mint).filter(res => res && res.match(/^\d+$/g)).sort()

                    if (range.length == 0) throw new Error("Could not get Range!")

                    console.log(range)
                    return { from: range[0], to: range[range.length - 1] }
                },
                getOverlord: function (_, args) {
                    return Type.getOverlord(args.id)
                },
                getReducedCoinTypeList: async function () {
                    return Type.getTypesReducedList()
                },
                getCoinType: async function (_, args) {
                    return Type.getType(args.id)
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
                        console.log(dominion)
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

                        console.log(obj)

                        if (obj.mint?.location) {
                            try {
                                obj.mint.location = JSON.parse(obj.mint.location)
                            } catch (e) { console.error(e, obj.mint.location) }
                        } else obj.mint.location = null


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

                    let query = pgp.as.format(`SELECT p.*, p.role AS role_id, r.name AS role_name FROM person p
            LEFT JOIN person_role r ON p.role = r.id
            WHERE r IS NOT NULL 
            AND unaccent(p.name) ILIKE $1`, search)


                    if (include) {
                        query = `${query} ${pgp.as.format("AND r.name IN ($1:list) IS true", include)}`
                    } else if (exclude) {
                        query = `${query} ${pgp.as.format("AND r.name IN ($1:list) IS NOT true", exclude)}`
                    }

                    result = await Database.manyOrNone(`${query} ORDER BY p.name ASC`)

                    result.forEach((item, idx) => {
                        result[idx] = SQLUtils.objectify(item, {
                            prefix: "role_",
                            target: "role",
                            keys: ["id", "name"]
                        })
                    })

                    return result
                },
                searchPersonsWithoutRole: async function (_, args) {
                    const searchString = args.text
                    let result = await Database.manyOrNone(`
            SELECT * FROM person WHERE role IS NULL AND unaccent(name) ILIKE $1 ORDER BY name ASC
            
            `, `%${searchString}%`)

                    result.forEach((item, idx) => {
                        result[idx]["role"] = { id: null, name: null }
                    })

                    return result
                },
                getTypesByOverlord: async function (_, args) {
                    return Type.getTypesByOverlord(args.id)
                },
                searchTypes: async function (_, args) {
                    const text = args.text
                    return Type.searchType(text)
                },
                getTypes: async function (_, args) {
                    return Type.getTypes(args)
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
                login: Auth.login,
                auth: async function (_, args) {
                    return Auth.verify(args.token)
                },
                users: async function () {
                    return await Database.manyOrNone("SELECT id, email FROM app_user")
                },

            }, Mutation: {
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
                            return await Database.none("INSERT INTO app_user (email, password, super) VALUES ($[email], $[password], TRUE)", { email, password: hashedPW })
                        } else {
                            throw new Error("You must provide an email and a password!")
                        }
                    } else {
                        throw new Error("Superuser was already initialized!")
                    }
                },
                addCoinType: async function (_, args, context) {

                    if (!Auth.verifyContext(context)) {
                        throw new Error('You are not authenticated!')
                    }

                    return Type.addType(args.data)
                },
                inviteUser: async function (_, { email } = {}, context) {
                    // console.log("SEND MAIL TO: ", arguments)
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