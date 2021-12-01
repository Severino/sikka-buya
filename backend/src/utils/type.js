const { ALLOWED_STYLES, DB_FIELDS } = require("../../constants/html_formatted_fields")
const { Database, pgp } = require("./database")
const SQLUtils = require("./sql")
const HTMLSanitizer = require("./HTMLSanitizer")
const Overlord = require("../../overlord")
const Mint = require("../models/mint")
const { camelCaseToSnakeCase } = require("./sql")
const Person = require('../models/person')
const Material = require('../models/material')
const Nominal = require('../models/nominal')
const PageInfo = require('../models/pageinfo')
const graphqlFields = require('graphql-fields')
const { JSDOM } = require("jsdom");

class Type {


    static async list() {
        return this.getTypes(...arguments)
    }


    static async updateType(id, data) {
        if (!id) throw new Error("Id is required for update.")

        this.postProcessUpsert(data)

        return Database.tx(async t => {

            data.id = id
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
            plain_text = $[plainText]
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


    static createPlainTextField(data) {

        const textFields = [
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

        const text = textFields.map(key => {
            let fieldText = ""
            if (data[key]) {
                const html = data[key]
                try {
                    const { document } = (new JSDOM(html)).window;
                    fieldText = document.body.textContent
                } catch (e) {
                    console.error(`Element with ${key} could not be parsed to html: ${e} `)
                }

            } else console.error(`${data[key].project_id} (${data[key].project_id}): Key ${key} does not exist on data object.`)

            return (fieldText != "") ? `${key}: ${fieldText}` : ""
        }).filter((txt) => txt != "").join("\n\n\n\n")

        return data.project_id + "\n\n\n\n" + text
    }

    static postProcessUpsert(data) {
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
        data.plainText = this.createPlainTextField(data)
        return data
    }

    static async addType(_, args, context, info) {
        const data = this.postProcessUpsert(args.data)

        return Database.tx(async t => {

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
                        plain_text
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
                        $[plainText]
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

    static async getTypesReducedList(_, args) {

        let { page = 0, count = 10 } = (args.pagination)

        let filter = []
        if (args.filter) {
            let { text, completed, reviewed } = args.filter



            if (text) {
                args.filter.text = `%${args.filter.text}%`
                filter.push("unaccent(project_id) ILIKE unaccent($[text])")
            }

            let {
                donativ,
                cursiveScript,
                excludeFromTypeCatalogue,
                excludeFromMapApp,
                yearUncertain,
                mintUncertain,
                mint,
                caliph,
                nominal,
                material,
            } = args.filter

            let obj = {
                donativ,
                cursiveScript,
                excludeFromTypeCatalogue,
                excludeFromMapApp,
                yearUncertain,
                mintUncertain,
                mint,
                caliph,
                nominal,
                material,
            }



            for (let [key, val] of Object.entries(obj)) {
                if (val != null) {
                    filter.push(`t.${camelCaseToSnakeCase(key)}=$[${key}]`)
                }
            }



            if (completed != null) {
                filter.push(`tc.type IS ${(completed == true) ? "NOT" : ""} NULL`)
            }

            if (reviewed != null) {
                filter.push(`tr.type IS ${(reviewed == true) ? "NOT" : ""} NULL`)
            }
        }

        let pageInfo = null
        let pagination = ""
        if (page != null && count != null) {

            let { total } = await Database.one(`
            SELECT COUNT(id) AS total FROM type t
            LEFT JOIN type_completed tc ON t.id = tc.type
            LEFT JOIN type_reviewed tr ON t.id = tr.type
            ${(filter != "") ? `WHERE ${filter.join(" AND ")}` : ""}
        `, args.filter)

            page = (Math.floor(total / count) < page) ? Math.floor(total / count) : page
            pagination = ` LIMIT ${count} OFFSET ${page * count} `

            pageInfo = new PageInfo({
                count,
                page,
                total
            })
        }

        let typeList = await Database.manyOrNone(`SELECT
        id, project_id, treadwell_id,
            CASE 
            WHEN tc.type IS NULL THEN false
            ELSE true
        END AS completed,
            CASE 
            WHEN tr.type IS NULL THEN false
            ELSE true
        END AS reviewed
        FROM type t
        LEFT JOIN type_completed tc ON t.id = tc.type
        LEFT JOIN type_reviewed tr ON t.id = tr.type
        ${(filter != "") ? `WHERE ${filter.join(" AND ")}` : ""}
        ORDER BY unaccent(project_id) COLLATE "C"
        ${pagination}
        ; `, args.filter)


        const map = {
            project_id: "projectId",
            treadwell_id: "treadwellId"
        }

        typeList = typeList.map(type => {
            for (let [key, val] of Object.entries(map)) {
                type[val] = type[key]
            }
            return type
        })

        return { pageInfo, types: typeList }
    }

    static buildWhereFilter(conditions) {
        if (!conditions || conditions.length == 0) return ""
        return `WHERE ${conditions.join(" AND ")} `
    }

    static objectToConditions(filterObj) {
        const filters = []
        for (let [key, val] of Object.entries(filterObj)) {
            filters.push(`${camelCaseToSnakeCase(key)}='${val}'`)
        }
        return filters
    }

    static async getTypes(_, filters = {}, context, info) {




        const conditions = this.objectToConditions(filters)
        const whereClause = this.buildWhereFilter(conditions)
        const query = `
        SELECT 
        ${this.rows}         
        FROM type t 
        ${this.joins}
        ${whereClause}
        ; `


        const result = await Database.manyOrNone(query)
        let fields = graphqlFields(info)
        for (let [idx, type] of result.entries()) {
            result[idx] = await this.postprocessType(type, fields)
        }

        return result
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

    static async getTypesByRuler(_, { id = null } = {}, context, info) {

        const person = id
        if (!person) throw new Error("Person must be provided!")


        const result = await Database.manyOrNone(`
        WITH rulers AS(
                SELECT type FROM overlord WHERE person = $1
                    UNION
                    SELECT type from issuer WHERE person = $1
                    UNION
                    SELECT id AS type from type WHERE caliph = $1
            )
        SELECT 
            ${this.rows}
        FROM type t
            ${this.joins}
        WHERE t.id IN(SELECT type FROM rulers)
            `, person);


        const fields = graphqlFields(info)
        for (let [key, value] of result.entries()) {
            result[key] = await this.postprocessType(value, fields)
        }


        return result
    }

    static get rows() {
        return ` t.*,
            ${Material.query()}
        ${Mint.query()}
        ${Nominal.query()}
        exclude_from_type_catalogue,
            exclude_from_map_app,
            internal_notes,
            year_uncertain,
            mint_uncertain as guessed_mint,
            p.id AS caliph_id`
    }

    static get joins() {
        return `
        LEFT JOIN material ma 
        ON t.material = ma.id
        LEFT JOIN mint mi 
        ON t.mint = mi.id
        LEFT JOIN nominal n 
        ON t.nominal = n.id
        LEFT JOIN person p
        ON t.caliph = p.id
            `
    }

    static async postprocessType(type, fields) {
        if (!type) throw new Error(`Type was not provided!`)

        const config = [
            {
                prefix: "material_",
                target: "material",
                keys: ["id", "name"]
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
            }
        ]

        config.forEach(conf => delete type[conf.target])
        SQLUtils.objectifyBulk(type, config)


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
            r.name as role_name
        FROM 
            other_person op 
        LEFT JOIN person p
            ON op.person = p.id
        LEFT JOIN 
            dynasty d ON p.dynasty=d.id
        LEFT JOIN 
            person_role r ON p.role=r.id
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

}

module.exports = Type