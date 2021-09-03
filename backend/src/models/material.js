

class Material {
    static query({
        tableName = "ma"
    } = {}) {
        return `
        ${tableName}.id AS material_id,
        ${tableName}.name AS material_name,
    `
    }
}

module.exports = Material