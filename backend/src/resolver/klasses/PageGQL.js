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
        obj.published = res.published
        obj.createdTimestamp = res.created_timestamp
        obj.publishedTimestamp = res.published_timestamp
        obj.modifiedTimestamp = res.modified_timestamp
        return obj
    })
}

class PageGQL extends GQL {
    static get Mutations() {
        return {
            updatePage: async function (_, { id, page: pageInput } = {}) {

                if (!id) throw new Error("Id is required")
                delete pageInput.id
                let values = Object.assign({
                    id: id,
                    title: null,
                    subtitle: null,
                    summary: null,
                    body: null,
                    image: null,
                    published: null
                }, pageInput)


                await WriteableDatabase.none(`UPDATE web_page SET 
                    title= $[title],
                    subtitle= $[subtitle],
                    summary= $[summary],
                    body= $[body],
                    image= $[image],
                    published= $[published],
                    modified_timestamp= NOW()
                    WHERE id= $[id]`
                    , values)

            }
        }
    }

    static get Queries() {
        return {
            getPage: async function (_, { id } = {}) {
                if (!id) throw new Error("Require id")

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
            getPageList: async function (_, { type } = {}) {
                if (!type) throw new Error("Require type")

                let results = []
                try {
                    results = await Database.manyOrNone(`
                    SELECT web_page.* FROM web_page 
                    LEFT JOIN web_page_group ON web_page_group.id = web_page.page_group
                    WHERE web_page_group.name = $1;
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