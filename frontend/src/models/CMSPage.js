import Query from "../database/query"

export default class CMSPage {

    static async update(id, page) {
        console.log(id, page)

        let pageObject = Object.assign({
            id: null,
            title: null,
            subtitle: null,
            summary: null,
            body: null,
            image: null,
            published: null,
            createdTimestamp: null,
            publishedTimestamp: null,
            modifiedTimestamp: null,
        }, page)

        await Query.raw(`mutation UpdatePage($id:ID!, $page: PageInput){
            updatePage(id: $id,page: $page)
        }`, { id, page: pageObject }
        )
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