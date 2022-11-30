import Query from '../database/query';

export default class Type {



  static async filteredQuery({
    filters = {},
    pagination = { count: 20, page: 0 },
    typeBody = "id projectId"
  } = {}) {
    const result = await Query.raw(`
    query ($pagination: Pagination, $filters: TypeFilter) {
      coinType(pagination: $pagination, filters: $filters) {
        pageInfo {
          page
          count
          last
          total
        }
        types {
          ${typeBody}
        }
      }
    }
    `, {
      pagination,
      filters
    })

    return {
      pageInfo: result.data.data.coinType.pageInfo,
      types: result.data.data.coinType.types
    }
  }

}