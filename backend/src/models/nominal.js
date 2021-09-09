class Nominal {

    static query({
        tableName = "n"
    } = {}) {
        return `
    ${tableName}.id AS nominal_id,
    ${tableName}.name AS nominal_name,
`
    }
}

module.exports = Nominal