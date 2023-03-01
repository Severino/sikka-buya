import Query from "../database/query"

export default class CMSPage {

    static async delete(id) {
        await Query.raw(`mutation DeleteCMSPage($id:ID!){
            deletePage(id: $id)
        }`, { id })
    }

    static async create(pageGroup) {

        const result = await Query.raw(`mutation CreateCMSPage($pageGroup:String!){
            createPage(title: "", type: $pageGroup)
        }`, { pageGroup })

        return result.data.data.createPage
    }

    static async update(id, page) {

        let pageObject = Object.assign({
            id: null,
            title: null,
            subtitle: null,
            summary: null,
            body: null,
            image: null,
            createdTimestamp: null,
            publishedTimestamp: null,
            modifiedTimestamp: null,
        }, page)

        await Query.raw(`mutation UpdatePage($id:ID!, $page: PageInput){
            updatePage(id: $id,page: $page)
        }`, { id, page: pageObject }
        )
    }

    static async list(group) {
        const result = await Query.raw(`
        query GetPageList($group: String!){
            getPageList(type: $group)
            {
                id
                subtitle
                title
                body
                createdTimestamp
                modifiedTimestamp
                publishedTimestamp
                blocks {
                    id
                    type
                    position
                    text
                    image
                }
            }
        }`, { group })
        return result.data.data.getPageList
    }

    static async get(id) {
        const result = await Query.raw(`{
            getPage(id: ${id}){
            id
            subtitle
            title
            body
            createdTimestamp
            modifiedTimestamp
            publishedTimestamp
            blocks {
                id
                type
                position
                text
                image
            }
          }
        }`
        )
        return result.data.data.getPage
    }

}