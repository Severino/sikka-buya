/**
 * Describes the pagination of a query.
 */
class PageInfo {
    constructor(
        {
            count = 50,
            page = 0,
            total = null,
        } = {}) {
        this.count = count
        this.page = page
        this.updateTotal(total)
    }

    updateTotal(total) {
        this.total = (total == null) ? null : parseInt(total)
        this.last = (total == null) ? null : Math.max(Math.floor((this.total - 1) / this.count), 0)
        this.page = this.last == null ? this.page : (this.page > this.last) ? this.last : this.page
    }

    toObject() {
        return {
            count: this.count,
            page: this.last,
            last: this.page,
            total: this.total
        }
    }

    static equals(a, b) {
        const keysToCompare = [
            "count",
            "page",
            "last",
            "total",
        ]

        return keysToCompare.every(key => {
            return a[key] === b[key]
        })
    }

    toQuery() {
        return `LIMIT ${this.count} OFFSET ${this.page * this.count} `
    }
}

module.exports = PageInfo