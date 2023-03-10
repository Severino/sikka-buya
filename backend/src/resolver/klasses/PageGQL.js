const Auth = require('../../auth')
const Argument = require('../../argument')
const { Database, WriteableDatabase } = require('../../utils/database')
const GQL = require('./gql')

function resultsToGraphQLPage(arr) {
    return arr.map(res => {
        let obj = {}
        obj.id = res.id
        obj.title = res.title
        obj.subtitle = res.subtitle
        obj.summary = res.summary
        obj.body = res.body
        obj.image = res.image
        obj.createdTimestamp = res.created_timestamp
        obj.publishedTimestamp = res.published_timestamp
        obj.modifiedTimestamp = res.modified_timestamp
        return obj
    })
}

class PageGQL extends GQL {
    static get Mutations() {
        return {
            createPageGroup: async function (_, { name } = {}) {
                if (!name || name == "") throw new Error("Name is required!")
                const { id } = await WriteableDatabase.one(`INSERT INTO web_page_group (name) VALUES ($[name]) RETURNING id`, { name })
                return id
            },
            createPage: async function (_, { title = "", type } = {}) {

                let returnedValue = await WriteableDatabase.oneOrNone("SELECT id FROM web_page_group WHERE name=$1 LIMIT 1", type)
                if (returnedValue == null)
                    returnedValue = await WriteableDatabase.one("INSERT INTO web_page_group (name) VALUES ($1) RETURNING id", type)

                const groupId = returnedValue.id

                let pageResult
                try {
                    pageResult = await WriteableDatabase.one(`
                INSERT INTO web_page 
                (title, page_group, created_timestamp, modified_timestamp) 
                VALUES 
                ($[title], $[groupId], NOW(), NOW()) 
                RETURNING id`, { title, groupId })
                } catch (e) {
                    console.log(e)
                }

                return pageResult.id || null
            },
            deletePage: async function (_, { id } = {}) {
                Argument.require({ id })
                await WriteableDatabase.none(`DELETE FROM web_page WHERE id=$[id]`, { id })
            },
            updatePage: async function (_, { id, page: pageInput } = args = {}) {
                Argument.require({ id })

                delete pageInput.id
                let values = Object.assign({
                    id: id,
                    title: null,
                    subtitle: null,
                    summary: null,
                    body: null,
                    image: null,
                    publishedTimestamp: null
                }, pageInput)

                values.publishedTimestamp = values.publishedTimestamp / 1000


                await WriteableDatabase.none(`UPDATE web_page SET 
                    title= $[title],
                    subtitle= $[subtitle],
                    summary= $[summary],
                    body= $[body],
                    image= $[image],
                    published_timestamp= to_timestamp($[publishedTimestamp]),
                    modified_timestamp= NOW()
                    WHERE id= $[id]`
                    , values)

            }
        }
    }

    static get Queries() {
        return {
            getPageGroup: async function (_, { name } = {}, context) {
                if (Auth.verifyContext(context)) {
                    const result = await Database.oneOrNone(`SELECT * FROM web_page_group WHERE name=$[name]`, { name })
                    return result?.id || null
                }
                return null
            },
            getPage: async function (_, { id } = {}) {
                Argument.require({ id })

                let page = {}

                await Database.tx(async t => {

                    let results = await t.manyOrNone(`
                    SELECT *   FROM web_page 
                    LEFT JOIN web_page_group ON web_page_group.id = web_page.page_group
                    WHERE web_page.id = $[id]
                    LIMIT 1
                    `, { id });

                    let childBlocks = await t.manyOrNone(`
                    SELECT * FROM web_page_block WHERE page=$[id] ORDER BY position
                    `, { id })



                    page = resultsToGraphQLPage(results)[0]
                    page.blocks = childBlocks
                })

                return page
            },
            getPageList: async function (_, { type } = args = {}) {
                Argument.require({ type })

                let results = []
                try {
                    results = await Database.manyOrNone(`
                    SELECT web_page.* FROM web_page 
                    LEFT JOIN web_page_group ON web_page_group.id = web_page.page_group
                    WHERE web_page_group.name = $1
                    ORDER BY published_timestamp DESC;
                `, type)
                } catch (e) {
                    console.log(e)
                }

                return resultsToGraphQLPage(results)
            }
        }
    }
}

module.exports = PageGQL