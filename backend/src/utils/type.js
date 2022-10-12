const { ALLOWED_STYLES, DB_FIELDS } = require("../../constants/html_formatted_fields")
const { WriteableDatabase, Database, pgp } = require("./database")
const SQLUtils = require("./sql")
const HTMLSanitizer = require("./HTMLSanitizer")
const Overlord = require("../models/overlord")
const Mint = require("../models/mint")
const { camelCaseToSnakeCase } = require("./sql")
const Person = require('../models/person')
const Material = require('../models/material')
const Nominal = require('../models/nominal')
const PageInfo = require('../models/pageinfo')
const graphqlFields = require('graphql-fields')
const { JSDOM } = require("jsdom");
const QueryBuilder = require('./querybuilder')


let i = 0;
class Type {

    static async list() {
        return this.getTypes(...arguments)
    }

    static async deleteType(id) {
        if (!id) throw new Error("Id is required.")
        return WriteableDatabase.none(`DELETE FROM type * WHERE id=$[id]`, { id })
    }

    static async updateType(id, data) {
        if (!id) throw new Error("Id is required for update.")
        data.id = id
        data = await this.postProcessUpsert(data)

        return WriteableDatabase.tx(async t => {
            await t.none(`
        UPDATE type 
        SET
            project_id = $[projectId],
            treadwell_id = $[treadwellId],
            material = $[material],
            mint = $[mint],
            mint_as_on_coin = $[mintAsOnCoin],
            nominal = $[nominal],
            year_of_mint = $[yearOfMint],
            donativ = $[donativ],
            procedure = $[procedure],
            caliph = $[caliph],
            front_side_field_text = $[front_side_field_text],
            front_side_inner_inscript = $[front_side_inner_inscript],
            front_side_intermediate_inscript = $[front_side_intermediate_inscript],
            front_side_outer_inscript = $[front_side_outer_inscript],
            front_side_misc = $[front_side_misc],
            back_side_field_text = $[back_side_field_text],
            back_side_inner_inscript = $[back_side_inner_inscript],
            back_side_intermediate_inscript = $[back_side_intermediate_inscript],
            back_side_outer_inscript = $[back_side_outer_inscript],
            back_side_misc = $[back_side_misc],
            cursive_script = $[cursiveScript],
            literature = $[literature],
            specials=$[specials],
            exclude_from_type_catalogue=$[excludeFromTypeCatalogue],
            exclude_from_map_app=$[excludeFromMapApp],
            internal_notes = $[internalNotes],
            year_uncertain = $[yearUncertain],
            mint_uncertain = $[mintUncertain],
            plain_text = $[plainText],
            search_vectors = to_tsvector('german', plain_text)
            WHERE id = $[id] 
        `, data)


            await t.none("DELETE FROM overlord WHERE type=$1", id)
            await t.none("DELETE FROM issuer WHERE type=$1", id)
            await t.none("DELETE FROM other_person WHERE type=$1", id)
            await t.none("DELETE FROM piece WHERE type=$1", id)
            await t.none("DELETE FROM type_coin_marks WHERE type=$1", id)

            await this.addOverlords(t, data, id)
            await this.addIssuers(t, data, id)
            await this.addOtherPersons(t, data, id)
            await this.addPieces(t, data, id)
            await this.addCoinMarks(t, data, id)

            return id
        })
    }

    static cleanupHTMLFields(type) {
        DB_FIELDS.forEach(field => {
            type[field] = HTMLSanitizer.sanitize(type[field], ...ALLOWED_STYLES)
        })
    }

    static removeEmptyTitlesAndHonorifics(titledPerson) {
        function removeEmpty(el) {
            // This is not ideal, as the id in PSQL could be 0.
            // But only when explicitly defined. Otherwise counting starts at 1.
            // Therefore this should be fine. 
            return el != null && el != 0
        }
        titledPerson.titles = titledPerson.titles.filter(removeEmpty)
        titledPerson.honorifics = titledPerson.honorifics.filter(removeEmpty)
    }

    static wrapCoinSideInformation(source, prefix) {
        const coinSideInformation = {}
        coinSideInformation.fieldText = source[prefix + "field_text"]
        delete source[prefix + "field_text"]
        coinSideInformation.innerInscript = source[prefix + "inner_inscript"]
        delete source[prefix + "inner_inscript"]
        coinSideInformation.intermediateInscript = source[prefix + "intermediate_inscript"]
        delete source[prefix + "intermediate_inscript"]
        coinSideInformation.outerInscript = source[prefix + "outer_inscript"]
        delete source[prefix + "outer_inscript"]
        coinSideInformation.misc = source[prefix + "misc"]
        delete source[prefix + "misc"]

        return coinSideInformation
    }

    static unwrapCoinSideInformation(target, prefix, {
        fieldText,
        innerInscript,
        intermediateInscript,
        outerInscript,
        misc,
    } = {}) {
        let infos = {
            fieldText,
            innerInscript,
            intermediateInscript,
            outerInscript,
            misc
        }

        for (let [key, value] of Object.entries(infos)) {
            key = key.replace(/([A-Z]{1})/g, (match) => {
                return `_${match.toLowerCase()}`
            })
            const fullKey = prefix + key
            target[fullKey] = value
        }

        return target
    }


    static async createPlainTextField(type, skipFetch = false) {
        /**
         * We get the complete type to have all fields available.
         */
        if (!skipFetch)
            type = await this.getFullType(type.id)

        let textFields = [
            "project_id",
            "treadwell_id",
            "mint_as_on_coin",
            "year_of_mint",
        ]

        textFields = textFields.map(attribute => {
            return { key: attribute, text: type[attribute] }
        })

        let nameFields = [
            "material",
            "mint",
            "nominal",
            "donativ",
            "procedure",
            "caliph",
        ]

        nameFields = nameFields.map(attribute => {
            return { key: attribute, text: type[attribute] ? type[attribute].name : null }
        })

        let htmlFields = [
            "front_side_field_text",
            "front_side_inner_inscript",
            "front_side_intermediate_inscript",
            "front_side_outer_inscript",
            "front_side_misc",
            "back_side_field_text",
            "back_side_inner_inscript",
            "back_side_intermediate_inscript",
            "back_side_outer_inscript",
            "back_side_misc",
            "literature",
            "specials",
        ]


        let errors = {}
        htmlFields = htmlFields.map(key => {
            let text = type[key]
            return { key, text }
        })

        let fields = [...textFields, ...nameFields, ...htmlFields].filter(obj => {
            if (!obj || !obj.text || obj.text.trim() === "")
                return false

            try {
                const { document } = (new JSDOM(obj.text)).window;
                if (document.body.textContent.trim() === "") return false
            } catch (e) {
                errors[key] = `Element with ${key} could not be parsed to html: ${e} `
            }

            return true
        })

        fields = fields.map(obj => {
            try {
                const { document } = (new JSDOM(obj.text)).window;
                return document.body.textContent.trim()
            } catch (e) {
                errors[key] = `Element with ${key} could not be parsed to html: ${e} `
            }
            return ""
        })

        let text = fields.filter((text) => (text != null && text != "")).join("\n")
        return { text: type.projectId + "\n" + text, errors }
    }

    static async postProcessUpsert(data, skipFetch) {
        /**
        * Thus the avers and reverse data is nested inside a seperate object,
        * inside the GraphQL interface, we need to transform whose properties
        * to the top level, to store them inside the database.
        * 
        * ADDITIONALLY: The 'unwrapCoinSideInformation' takes care of creating
        * empty properties, if the CoinSideInformation is not provided and
        * therefore null.
        */
        this.unwrapCoinSideInformation(data, "front_side_", data.avers)
        this.unwrapCoinSideInformation(data, "back_side_", data.reverse)
        this.cleanupHTMLFields(data)
        data.plainText = (await this.createPlainTextField(data, skipFetch)).text
        return data
    }

    static async addType(_, args, context, info) {
        const data = await this.postProcessUpsert(args.data, true)

        return WriteableDatabase.tx(async t => {

            const { id: type } = await t.one(`
            INSERT INTO type(
                        project_id,
                        treadwell_id,
                        material,
                        mint,
                        mint_as_on_coin,
                        nominal,
                        year_of_mint,
                        donativ,
                        procedure,
                        caliph,
                        front_side_field_text,
                        front_side_inner_inscript,
                        front_side_intermediate_inscript,
                        front_side_outer_inscript,
                        front_side_misc,
                        back_side_field_text,
                        back_side_inner_inscript,
                        back_side_intermediate_inscript,
                        back_side_outer_inscript,
                        back_side_misc,
                        cursive_script,
                        literature,
                        specials,
                        exclude_from_type_catalogue,
                        exclude_from_map_app,
                        internal_notes,
                        mint_uncertain,
                        year_uncertain,
                        plain_text,
                        search_vectors
                    )  VALUES(
                        $[projectId],
                        $[treadwellId],
                        $[material],
                        $[mint],
                        $[mintAsOnCoin],
                        $[nominal],
                        $[yearOfMint],
                        $[donativ],
                        $[procedure],
                        $[caliph],
                        $[front_side_field_text],
                        $[front_side_inner_inscript],
                        $[front_side_intermediate_inscript],
                        $[front_side_outer_inscript],
                        $[front_side_misc],
                        $[back_side_field_text],
                        $[back_side_inner_inscript],
                        $[back_side_intermediate_inscript],
                        $[back_side_outer_inscript],
                        $[back_side_misc],
                        $[cursiveScript],
                        $[literature],
                        $[specials],
                        $[excludeFromTypeCatalogue],
                        $[excludeFromMapApp],
                        $[internalNotes],
                        $[mintUncertain],
                        $[yearUncertain],
                        $[plainText],
                        to_tsvector('german', $[plainText])
                    ) RETURNING id
                        `, data)

            await this.addOverlords(t, data, type)
            await this.addIssuers(t, data, type)
            await this.addOtherPersons(t, data, type)
            await this.addPieces(t, data, type)
            await this.addCoinMarks(t, data, type)
            return type
        })
    }

    static async addCoinMarks(t, data, type) {

        data.coinMarks = data.coinMarks.filter(coinMark => coinMark != null)
        for (let coinMark of data.coinMarks.values()) {
            await t.none("INSERT INTO type_coin_marks (coin_mark, type) VALUES ($1,$2)", [coinMark, type])
        }
    }

    static async addPieces(t, data, type) {
        for (let piece of data.pieces.values()) {
            await t.none("INSERT INTO piece (piece, type) VALUES ($1,$2)", [piece, type])
        }
    }

    static async addOtherPersons(t, data, type) {
        for (let otherPerson of data.otherPersons.values()) {
            await t.none("INSERT INTO other_person (person, type) VALUES ($1,$2)", [otherPerson, type])
        }
    }

    static async addIssuers(t, data, type) {
        for (let issuer of data.issuers.values()) {
            issuer.type = +type
            this.removeEmptyTitlesAndHonorifics(issuer)
            let { id: issuer_id } = await t.one(pgp.helpers.insert(issuer, ["type", "person"], "issuer") + " RETURNING id")

            for (let title of issuer.titles.values()) {
                await t.none("INSERT INTO issuer_titles(issuer, title) VALUES($1, $2)", [issuer_id, title])
            }

            for (let honorific of issuer.honorifics.values()) {
                await t.none("INSERT INTO issuer_honorifics(issuer, honorific) VALUES($1, $2)", [issuer_id, honorific])
            }
        }
    }

    static async addOverlords(t, data, type) {
        for (let overlord of data.overlords.values()) {
            overlord.type = +type
            overlord.rank = +overlord.rank
            this.removeEmptyTitlesAndHonorifics(overlord)
            let { id: overlord_id } = await t.one(pgp.helpers.insert(overlord, ["rank", "type", "person"], "overlord") + " RETURNING id")
            for (let title of overlord.titles.values()) {
                await t.none("INSERT INTO overlord_titles(overlord_id, title_id) VALUES($1, $2)", [overlord_id, title])
            }

            for (let honorific of overlord.honorifics.values()) {
                await t.none("INSERT INTO overlord_honorifics(overlord_id, honorific_id) VALUES($1, $2)", [overlord_id, honorific])
            }
        }
    }

    static async searchType(_, filters = {}, context, info) {

        let text = filters.text
        delete filters.text

        const f = this.objectToConditions(filters)
        const whereClause = this.buildWhereFilter([...f, "unaccent(t.project_id) ILIKE unaccent($[searchText])"])

        let result = await Database.manyOrNone(
            `
        SELECT 
            ${this.rows}
        FROM type t
            ${this.joins}
            ${whereClause}
        LIMIT ${process.env.MAX_SEARCH}
        `, { searchText: "%" + text + "%" })

        let fields = graphqlFields(info)
        for (let [idx, type] of result.entries()) {
            result[idx] = await this.postprocessType(type, fields)
        }

        return result
    }


    static buildWhereFilter(conditions) {
        if (!conditions || conditions.length == 0) return ""
        return `WHERE ${conditions.join(" AND ")} `
    }

    static get aliasMap() {
        return {
            "material": "ma",
            "mint": "mi"
        }
    }

    static get targetColumn() {
        return {
            "material": "id",
            "mint": "id"
        }
    }

    static objectToConditions(filterObj) {
        /**
         * TODO // WARNING // ALERT // ERROR: HERE WE HAVE THE DANGER OF SQLINJECTION
         */
        const where = []
        for (let [key, filters] of Object.entries(filterObj)) {
            let db_key = camelCaseToSnakeCase(key)
            if (
                // Skip if filter is invalid:
                filters == null ||
                filters === "" ||
                // Skip if an empty array is passed:
                (filters.length != null && filters.length === 0)) continue

            if (!Array.isArray(filters)) filters = [filters]

            const ors = []
            filters.forEach((filter) => {

                let tableName = this.aliasMap[db_key] ? this.aliasMap[db_key] : db_key
                if (this.targetColumn[db_key]) {
                    tableName = `${tableName}.${this.targetColumn[db_key]}`
                }
                ors.push(pgp.as.format("$1:value=$2", [tableName, filter]))
            })

            const filter = ors.length === 1 ? ors[0] : `(${ors.join(" OR ")})`
            where.push(filter)
        }
        return where
    }

    static async getTypes(_, { pagination = { count: 50, total: 0, page: 0 }, filters = {}, additionalJoin = "", additionalRows = [] }, context, info) {

        /**
         * 
         * Better innerjoin for coin_marks:
         * 
         * 
         * 
         *  SELECT * FROM type
            RIGHT JOIN
            (SELECT type_coin_marks.type, array_agg(to_json(coin_marks.*)) FROM type_coin_marks 
            JOIN coin_marks ON coin_marks.id = type_coin_marks.coin_mark
            GROUP BY type_coin_marks.type) AS cm
            ON cm.type = type.id
         */

        const queryBuilder = this.complexFilters(filters)
        const conditions = this.objectToConditions(filters)
        const joinClause = [this.joins, ...queryBuilder.join, additionalJoin].join("\n")
        const whereClause = this.buildWhereFilter([...conditions, ...queryBuilder.where])
        const pageInfo = new PageInfo(pagination)



        const totalQuery = `
        SELECT count(*)
        FROM type t 
        ${joinClause}
        ${whereClause}
        `

        const total = await Database.one(totalQuery)
        pageInfo.updateTotal(total.count)

        const query = `
        SELECT 
        ${[this.rows,
            ...additionalRows
            ].join(",")
            }
        FROM type t 
        ${joinClause}
        ${whereClause}
        ORDER BY t.project_id ASC
        ${pageInfo.toQuery()}
; `

        const result = await Database.manyOrNone(query)
        let fields = graphqlFields(info)

        for (let [idx, type] of result.entries()) {
            result[idx] = await this.postprocessType(type, fields.types)
        }

        return { types: result, pageInfo }
    }

    static complexFilters(filter) {

        const queryBuilder = new QueryBuilder()


        this._processComplexCoinMark(queryBuilder, filter)
        this._processComplexHonorificsFilter(queryBuilder, filter)
        this._processComplexOtherPersonFilter(queryBuilder, filter)
        this._processComplexTitleFilter(queryBuilder, filter)

        if (Object.hasOwnProperty.bind(filter)("completed")) {
            if (filter.completed != null) {
                let completedWhere = (filter.completed) ? "tc.type IS NOT NULL" : "tc.type IS NULL"
                queryBuilder.addWhere(completedWhere)
            }
            delete filter.completed
        }

        if (Object.hasOwnProperty.bind(filter)("reviewed")) {
            if (filter.reviewed != null) {
                let reviewedWhere = (filter.reviewed) ? "tr.type IS NOT NULL" : "tr.type IS NULL"
                queryBuilder.addWhere(reviewedWhere)
            }
            delete filter.reviewed
        }

        ;["projectId", "treadwellId"].forEach(val => {

            const sqlValue = { projectId: "project_id", treadwellId: "treadwell_id" }
            if (Object.hasOwnProperty.bind(filter)(val)) {
                filter[val] = filter[val].trim()
                if (filter[val] != "") {
                    queryBuilder.addWhere(pgp.as.format(`unaccent(t.${sqlValue[val]}) ILIKE unaccent('%$1#%')`, [filter[val]]))
                }
                delete filter[val]
            }
        })
        if (Object.hasOwnProperty.bind(filter)("plain_text")) {
            filter["plain_text"] = filter["plain_text"].trim()
            const searchValues = filter["plain_text"].split(/\s+/g)
            if (searchValues.length > 0) {
                queryBuilder.addWhere(pgp.as.format(`unaccent(t.${"plain_text"}) ILIKE unaccent($1)`, `%${searchValues.join("%")}%`))
            }
            delete filter["plain_text"]
        }

        if (Object.hasOwnProperty.bind(filter)("ruler")) {
            if (Array.isArray(filter.ruler) && filter.ruler.length > 0) {
                queryBuilder.addSelect(`(issuers || overlords) as rulers`)
                queryBuilder.addJoin(`LEFT JOIN(
                            SELECT
                        o.type,
                            COALESCE(array_agg(o.person)) as overlords
                    FROM
                        overlord o
                    GROUP BY
                        o.type
                        ) overlord_query ON overlord_query.type = t.id
                LEFT JOIN(
                            SELECT
                        i.type,
                            COALESCE(array_agg(i.person)) as issuers
                    FROM
                        issuer i
                    GROUP BY
                        i.type
                        ) issuer_query ON issuer_query.type = t.id`)
                queryBuilder.addWhere(pgp.as.format(`((issuers || overlords) && $[ruler]:: int[])`, { ruler: filter.ruler }))
            }
            delete filter.ruler
        }

        return queryBuilder
    }

    static counter = 0

    static async fullSearchTypes(_, { text = "", filters = {}, pagination = {} } = {}, context, info) {


        this.counter++

        pagination = new PageInfo(pagination)
        const conditions = this.objectToConditions(filters)
        let whereClause = this.buildWhereFilter(conditions)
        if (whereClause == "") whereClause = "WHERE"
        else whereClause += " AND "

        const additionalWhereClauses = ["search_vectors @@ keywords"]
        whereClause += " " + additionalWhereClauses.join(" AND ")


        const test_query = `
SELECT
COUNT(*) as total     
        FROM type t
        ${this.joins}
                , websearch_to_tsquery($[text]) as keywords
        ${whereClause}
; `
        const { total } = await Database.one(test_query, Object.assign(filters, { text }))
        pagination.updateTotal(total)

        const query = `
            SELECT 
        ${this.rows}, ts_headline(plain_text, keywords, 'MaxFragments=10, HighlightALL=true') as preview        
        FROM type t
        ${this.joins}
        , websearch_to_tsquery($[text]) as keywords 
        ${whereClause} 
        ORDER BY t.project_id ASC
        ${pagination.toQuery()}
            ; `


        const result = await Database.manyOrNone(query, { text })


        let fields = graphqlFields(info)
        for (let [idx, type] of result.entries()) {
            result[idx] = await this.postprocessType(type, fields)
        }
        const results = result.map(res => {
            return {
                type: res,
                preview: res.preview
            }
        })

        return {
            pagination,
            results
        }
    }

    static async getType(_, { id = null } = {}, context, info) {

        if (!id) throw new Error("Id must be provided!")

        const result = await Database.one(`
            SELECT 
                ${this.rows}
            FROM type t
                ${this.joins}
            WHERE t.id = $1
                `, id).catch((e) => {
            throw new Error("Requested type does not exist: " + e)
        })
        const fields = graphqlFields(info)
        return await this.postprocessType(result, fields);
    }


    /**
     * In contrast to getType, does the
     * getFullType not take any query into account.
     * So it can be easily used from utility scripts
     * that just need to get a type.
     * 
     * Therefore the function is also much slower than the getType
     * function an should only be used when not accessed
     * via GraphQL and performance is negligile.
     * 
     * @param {number} id - If of the type you want to access
     */
    static async getFullType(id) {
        const result = await Database.one(`
            SELECT 
            ${this.rows}
        FROM type t
            ${this.joins}
        WHERE t.id = $1
                `, id).catch((e) => {
            throw new Error("Requested type does not exist: " + e)
        })

        return await this.postprocessType(result);
    }

    static get rows() {
        return ` t.*,
                ${Material.query()}
    ${Material.colorQuery()},
        ${Mint.query()}
        plain_text,
            province.id AS mint_province_id,
                province.name AS mint_province_name,
                    ${Nominal.query()}
            exclude_from_type_catalogue,
                exclude_from_map_app,
                internal_notes,
                year_uncertain,
                mint_uncertain as guessed_mint,
                p.id AS caliph_id,
                    pc.color AS caliph_color`
    }

    static get joins() {
        return `
        ${Material.joins()}
        ${Material.colorJoin()}
        LEFT JOIN mint mi 
        ON t.mint = mi.id
        LEFT JOIN province
        ON mi.province = province.id 
        LEFT JOIN nominal n 
        ON t.nominal = n.id
        LEFT JOIN person p
        ON t.caliph = p.id
        LEFT JOIN person_color pc
        ON p.id = pc.person
                `
    }

    static async postprocessType(type, fields) {
        if (!type) throw new Error(`Type was not provided!`)

        const config = [
            {
                prefix: "material_",
                target: "material",
                keys: ["id", "name", "color"]
            },
            {
                prefix: "mint_",
                target: "mint",
                keys: ["id", "name", "location", "uncertain", "uncertain_area"]
            },
            {
                prefix: "nominal_",
                target: "nominal",
                keys: ["id", "name"]
            },
            {
                prefix: "mint_province_",
                target: "mint.province",
                keys: ["id", "name"]
            },
        ]

        config.forEach(conf => delete type[conf.target])
        SQLUtils.objectifyBulk(type, config)


        if (fields == null)
            fields = [
                "avers",
                "reverse",
                "coinMarks",
                "pieces",
                "caliph",
                "otherPersons",
                "overlords",
                "issuers",
            ]

        for (let property of Object.keys(fields)) {
            switch (property) {

                case 'avers':
                    type.avers = this.wrapCoinSideInformation(type, "front_side_")
                    break;
                case "reverse":
                    type.reverse = this.wrapCoinSideInformation(type, "back_side_")
                    break;

                // Arrays
                case "coinMarks":
                    type.coinMarks = await Type.getCoinMarks(type.id)
                    break
                case "pieces":
                    type.pieces = await Type.getPieces(type.id)
                    break

                // Persons
                case 'caliph':
                    type.caliph = (type.caliph == null) ? null : await Person.get(type.caliph)
                    break;
                case 'otherPersons':
                    type.otherPersons = await Type.getOtherPersonsByType(type.id)
                    break

                // Titled Persons
                case "overlords":
                    type.overlords = await Type.getOverlordsByType(type.id)
                    break;
                case "issuers":
                    type.issuers = await Type.getIssuerByType(type.id)
                    break;


            }
        }




        for (let [key, val] of Object.entries(this.databaseToGraphQlMap)) {
            if (type[key] != null) {
                type[val] = type[key]
                delete type[key]
            }
        }

        return type

    }

    static get databaseToGraphQlMap() {
        return {
            project_id: "projectId",
            treadwell_id: "treadwellId",
            mint_as_on_coin: "mintAsOnCoin",
            year_of_mint: "yearOfMint",
            cursive_script: "cursiveScript",
            exclude_from_type_catalogue: "excludeFromTypeCatalogue",
            exclude_from_map_app: "excludeFromMapApp",
            internal_notes: "internalNotes",
            guessed_mint: "mintUncertain",
            year_uncertain: "yearUncertain"
        }
    }


    // static async getOverlord(id) {

    //     const request = await Database.one(`
    //         SELECT O.ID,
    //         	O.RANK,
    //         	O.TYPE,
    //         	P.ID AS PERSON_ID,
    //         	P.NAME AS PERSON_NAME,
    //         	P.ROLE AS PERSON_ROLE,
    //         	T.TITLE_NAMES,
    //         	T.TITLE_IDS,
    //         	H.HONORIFIC_NAMES,
    //         	H.HONORIFIC_IDS
    //         FROM OVERLORD O JOIN
    //         				(SELECT OT.OVERLORD_ID AS ID,

    //         				ARRAY_AGG(T.NAME) AS TITLE_NAMES,
    //         				ARRAY_AGG(T.ID) AS TITLE_IDS
    //         					FROM OVERLORD_TITLES OT
    //         					JOIN TITLE T ON T.ID = OT.TITLE_ID
    //         					GROUP BY OT.OVERLORD_ID) T USING(ID) JOIN
    //         				(SELECT OH.OVERLORD_ID AS ID,

    //         				ARRAY_AGG(H.NAME) AS HONORIFIC_NAMES,
    //         				ARRAY_AGG(H.ID) AS HONORIFIC_IDS
    //         					FROM OVERLORD_HONORIFICS OH
    //         					JOIN HONORIFIC H ON H.ID = OH.HONORIFIC_ID
    //         					GROUP BY OH.OVERLORD_ID) H USING(ID)
    //         INNER JOIN PERSON P ON O.PERSON = P.ID
    //         WHERE O.id = 726
    //         `, id)

    //     Overlord.extract(request)

    //     return Promise.resolve(request)
    // }


    static async getOverlordsByType(type_id) {

        const response = await Database.multi(
            `
            SELECT o.id,
            o.rank,
            p.id as person_id,
            p.short_name as person_short_name,
            p.name as person_name,
            p.role as person_role,
            c.color as person_color,
            r.id as person_role_id,
            r.name as person_role_name,
            d.id as person_dynasty_id,
            d.name as person_dynasty_name,
            t.title_names,
            t.title_ids,
            h.honorific_names,
            h.honorific_ids 
            FROM overlord o
            LEFT JOIN(
                SELECT ot.overlord_id AS id, array_agg(t.name) AS title_names, array_agg(t.id) AS title_ids
                 FROM overlord_titles ot
                 JOIN title t ON t.id = ot.title_id
                 GROUP BY ot.overlord_id
            ) t USING(id)
            LEFT JOIN(
                SELECT oh.overlord_id AS id, array_agg(h.name) AS honorific_names, array_agg(h.id) AS honorific_ids
                 FROM overlord_honorifics oh
                 JOIN honorific h ON h.id = oh.honorific_id
                 GROUP BY oh.overlord_id
            ) h USING(id)
            INNER JOIN person p
                ON o.person = p.id
            LEFT JOIN dynasty d ON p.dynasty=d.id
            LEFT JOIN person_role r ON p.role=r.id
            LEFT JOIN person_color c ON c.person = p.id
			WHERE o.type = $1
            ORDER BY o.rank ASC
            `, type_id)

        let result = response[0]
        let overlords = Overlord.extractList(result)
        return overlords
    }

    static async getIssuerByType(type_id) {
        const response = await Database.multi(`
        SELECT i.id, i.type,p.id as person_id,
                p.short_name as person_short_name,
                p.name as person_name,
                c.color as person_color,
                r.id as person_role_id,
                r.name as person_role_name,
                d.id as person_dynasty_id,
                d.name as person_dynasty_name,
                t.title_names,
                t.title_ids,
                h.honorific_names,
                h.honorific_ids 
            FROM issuer i
            LEFT JOIN(
                SELECT it.issuer AS id, array_agg(t.name) AS title_names, array_agg(t.id) AS title_ids
                 FROM issuer_titles it
                 JOIN title t ON t.id = it.title
                 GROUP BY it.issuer
            ) t USING(id)
            LEFT JOIN(
                SELECT ih.issuer AS id, array_agg(h.name) AS honorific_names, array_agg(h.id) AS honorific_ids
                 FROM issuer_honorifics ih
                 JOIN honorific h ON h.id = ih.honorific
                 GROUP BY ih.issuer
            ) h USING(id)
            INNER JOIN person p
                ON i.person = p.id
            LEFT JOIN dynasty d ON p.dynasty=d.id
            LEFT JOIN person_role r ON p.role=r.id
            LEFT JOIN person_color c ON c.person = p.id
			WHERE i.type = $1
            `, type_id)

        let result = response[0]
        let issuers = Overlord.extractList(result)
        return issuers
    }

    static async getCoinMarks(type_id) {
        return await Database.manyOrNone(`
        SELECT cm.* FROM type_coin_marks tcm
        LEFT JOIN coin_marks cm
            ON tcm.coin_mark = cm.id
			WHERE tcm.type = $1
            `, type_id)
    }

    static async getOtherPersonsByType(type_id) {
        let result = await Database.manyOrNone(`
        SELECT 
            p.*,
            d.id as dynasty_id,
            d.name as dynasty_name,
            r.id as role_id,
            r.name as role_name,
            c.color as color
        FROM 
            other_person op 
        LEFT JOIN person p
            ON op.person = p.id
        LEFT JOIN 
            dynasty d ON p.dynasty=d.id
        LEFT JOIN 
            person_role r ON p.role=r.id
        LEFT JOIN
            person_color c ON p.id = c.person
		WHERE 
            op.type = $1
            `, type_id)




        return result.map(person => Person.decomposePersonResult(person))
    }

    static async getPieces(type_id) {
        let results = await Database.manyOrNone(`
        SELECT piece.piece FROM piece
			WHERE piece.type = $1
            `, type_id)

        return results.map(res => res.piece)
    }

    /**
     * Limit the filter arguments you can use to a single option.
     * This is good for properties, that you only want to filter once,
     * and if the user requests multiple filters of the same 
     * property, an error is thrown. 
     * 
     * E.g. when using the coin_mark and coin_mark_and filters.
     * 
     * @param {[string]} targetFilters - set of properties that are checkt for concurrency
     * @param {string} name - human readable name of the property to display the error (lower case)
     * @returns name of the active filter element, if no error was thrown
     */
    static _filterGate(filter, targetFilters, name) {
        let activeFilter = null
        targetFilters.forEach(filterName => {

            if (Object.hasOwnProperty.bind(filter)(filterName)) {
                if (activeFilter != null) throw new Error(`Too many ${name} filter. Only use one!`)
                activeFilter = filterName
            }
        })
        return activeFilter
    }

    static _processComplexCoinMark(queryBuilder, filter) {

        let activeCoinMarkFilter = this._filterGate(filter, ["coinMark_and_or", "coinMark", "coinMark_and", "coinMark_or_and"], "coin mark")

        // If a coinmark filter is applied, add the array object to the query:
        if (activeCoinMarkFilter != null) {

            queryBuilder.addJoin(`LEFT JOIN
            (SELECT tcm.type,
                COALESCE(ARRAY_AGG(id) FILTER(
                    WHERE id IS NOT NULL), '{}') as coin_marks
             FROM type_coin_marks tcm
             LEFT JOIN coin_marks cm ON tcm.coin_mark = cm.id
             GROUP BY tcm.type) agg_coin_marks ON agg_coin_marks.type = t.id`)

            queryBuilder.addSelect(`
             COALESCE(agg_coin_marks.titles, '{}') as coin_marks
             `)





            function _nonArrayError() {
                if (Array.isArray(filter[activeCoinMarkFilter]) && Array.isArray(filter[activeCoinMarkFilter])) {
                    throw new Error("Coin mark needs to be an non-empty array")
                }
            }

            if (activeCoinMarkFilter === "coinMark_and_or") {
                let nonEmptyArrays = filter[activeCoinMarkFilter].filter(el => el.length > 0)
                if (nonEmptyArrays.length > 0) {
                    let clauses = []
                    nonEmptyArrays.forEach(arr => {
                        clauses.push(pgp.as.format(`($[arr]:: int[] <@ agg_coin_marks.coin_marks)`, { arr }))
                    })

                    queryBuilder.addWhere(clauses.join(" OR "))
                }
            }

            if (activeCoinMarkFilter === "coinMark_or_and") {
                let nonEmptyArrays = filter[activeCoinMarkFilter].filter(el => el.length > 0)
                if (nonEmptyArrays.length > 0) {
                    let clauses = []
                    nonEmptyArrays.forEach(arr => {
                        clauses.push(pgp.as.format(`($[arr]:: int[] && agg_coin_marks.coin_marks)`, { arr }))
                    })

                    queryBuilder.addWhere(clauses.join(" AND "))
                }
            }

            if (["coinMark", "coinMark_and"].indexOf(activeCoinMarkFilter) != -1) {
                _nonArrayError()
                if (activeCoinMarkFilter === "coinMark")
                    queryBuilder.addWhere(pgp.as.format(`$[coin_marks]:: int[] && agg_coin_marks.coin_marks`, { coin_marks: filter[activeCoinMarkFilter] }))

                if (activeCoinMarkFilter === "coinMark_and")
                    queryBuilder.addWhere(pgp.as.format(`$[coin_marks]:: int[] <@ agg_coin_marks.coin_marks`, { coin_marks: filter[activeCoinMarkFilter] }))
            }


            delete filter[activeCoinMarkFilter]
        }
    }

    static _processComplexTitleFilter(queryBuilder, filter) {

        const activeTitleFilter = this._filterGate(filter, ["title", "title_and"], 'title')

        if (Object.hasOwnProperty.bind(filter)(activeTitleFilter)) {
            if (filter?.[activeTitleFilter] && Array.isArray(filter[activeTitleFilter]) && filter[activeTitleFilter].length > 0) {

                queryBuilder.addJoin(`LEFT JOIN
                (SELECT o.type,
                        COALESCE(ARRAY_AGG(title_id) FILTER (WHERE title_id IS NOT NULL ), '{}') as titles
                 FROM overlord o
                 LEFT JOIN overlord_titles ot ON o.id = ot.overlord_id
                 GROUP BY o.type) type_overlord_titles ON type_overlord_titles.type = t.id`)

                queryBuilder.addJoin(`LEFT JOIN
                (SELECT i.type,
                        COALESCE(ARRAY_AGG(title) FILTER (WHERE title IS NOT NULL ), '{}') as titles
                 FROM issuer i
                 LEFT JOIN issuer_titles it ON i.id = it.issuer
                 GROUP BY i.type) type_issuer_titles ON type_issuer_titles.type = t.id`)

                queryBuilder.addSelect(`
                 COALESCE(type_overlord_titles.titles, type_issuer_titles.titles, '{}') as titles
                 `)

                if (activeTitleFilter === "title")
                    queryBuilder.addWhere(pgp.as.format(`($[titles]:: int[] && type_overlord_titles.titles OR $[titles]:: int[] && type_issuer_titles.titles)`, { titles: filter[activeTitleFilter] }))
                else if (activeTitleFilter === "title_and") {
                    queryBuilder.addWhere(pgp.as.format(`($[titles]:: int[] <@ type_overlord_titles.titles OR $[titles]:: int[] <@ type_issuer_titles.titles)`, { titles: filter[activeTitleFilter] }))
                }

            }


            delete filter[activeTitleFilter]
        }
    }

    static _processComplexHonorificsFilter(queryBuilder, filter) {
        const activeTitleFilter = this._filterGate(filter, ["honorific", "honorific_and"], 'honorific')

        if (Object.hasOwnProperty.bind(filter)(activeTitleFilter)) {
            if (Array.isArray(filter.honorific) && filter.honorific.length > 0) {

                queryBuilder.addJoin(`LEFT JOIN
                (SELECT o.type,
                        COALESCE(ARRAY_AGG(honorific_id) FILTER (WHERE honorific_id IS NOT NULL ), '{}') as honorifics
                 FROM overlord o
                 LEFT JOIN overlord_honorifics oh ON o.id = oh.overlord_id
                 GROUP BY o.type) type_overlord_honorifics ON type_overlord_honorifics.type = t.id`)


                queryBuilder.addJoin(`LEFT JOIN
                (SELECT i.type,
                        COALESCE(ARRAY_AGG(honorific) FILTER (WHERE honorific IS NOT NULL ), '{}') as honorifics
                 FROM issuer i
                 LEFT JOIN issuer_honorifics ih ON i.id = ih.issuer
                 GROUP BY i.type) type_issuer_honorifics ON type_issuer_honorifics.type = t.id`)

                queryBuilder.addSelect(`
                 COALESCE(type_overlord_honorifics.honorifics, type_issuer_honorifics.honorifics , '{}') as honorifics
                 `)

                if (activeTitleFilter === "honorific")
                    queryBuilder.addWhere(pgp.as.format(`($[honorifics]:: int[] && type_overlord_honorifics.honorifics OR $[honorifics]:: int[] && type_issuer_honorifics.honorifics)`, { honorifics: filter[activeTitleFilter] }))
                else if (activeTitleFilter === "honorific_and") {
                    let honorificFilterGroups = filter[activeTitleFilter].filter(arr => arr?.length > 0)
                    queryBuilder.addWhere(pgp.as.format(`($[honorifics]:: int[] <@ type_overlord_honorifics.honorifics OR $[honorifics]:: int[] <@ type_issuer_honorifics.honorifics)`, { honorifics: honorificFilterGroups }))
                }

            }
        }
    }

    static _processComplexOtherPersonFilter(queryBuilder, filter) {

        const activePersonFilter = this._filterGate(filter, ["otherPerson", "otherPerson_and"], 'other person')

        if (Object.hasOwnProperty.bind(filter)(activePersonFilter)) {

            if (!(Array.isArray(filter[activePersonFilter]) && filter[activePersonFilter].length > 0)) {
                throw new Error(`Filter "${activePersonFilter}" needs to be an array with at least 1 element.`)
            }

            queryBuilder.addJoin(`LEFT JOIN(
                            SELECT
                    op.type,
                            COALESCE(array_agg(op.person)) as other_person
                FROM
                    other_person op
                GROUP BY
                    op.type
                        ) other_person_query ON other_person_query.type = t.id`)

            if (activePersonFilter === "otherPerson_and") {
                queryBuilder.addWhere(pgp.as.format(`(other_person @> $[otherPerson]:: int[])`, { otherPerson: filter[activePersonFilter] }))
            } else {
                queryBuilder.addWhere(pgp.as.format(`(other_person && $[otherPerson]:: int[])`, { otherPerson: filter[activePersonFilter] }))
            }
            delete filter[activePersonFilter]
        }
    }
}


module.exports = Type