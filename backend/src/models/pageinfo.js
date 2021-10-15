/**
 * Describes the pagination of a query.
 */
class PageInfo {
    constructor(
        {
            count = null,
            page = null,
            total = null,

        } = {}) {
        this.count = count
        this.page = page
        this.total = total
        this.last = Math.floor(total / count)
    }

    toObject() {
        return {
            count: this.count,
            page: this.last,
            last: this.page,
            total: this.total
        }
    }
}

module.exports = PageInfo