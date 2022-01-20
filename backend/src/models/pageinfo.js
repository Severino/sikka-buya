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
        this.updateTotal(total)
    }

    updateTotal(total) {
        this.total = parseInt(total)
        this.last = (total) ? (this.count == 0) ? 0 : Math.floor(this.total / this.count) : null
    }

    toObject() {
        return {
            count: this.count,
            page: this.last,
            last: this.page,
            total: this.total
        }
    }

    toQuery() {
        return `LIMIT ${this.count} OFFSET ${this.page * this.count} `
    }
}

module.exports = PageInfo