

class Material {
    static query({
        tableName = "ma"
    } = {}) {
        return `
        ${tableName}.id AS material_id,
        ${tableName}.name AS material_name,
    `
    }

    static joins({
        typeTableName = "t",
        tableName = "material",
        tableAlias = "ma"
    } = {}) {
        return `LEFT JOIN ${tableName} ${tableAlias} 
        ON ${typeTableName}.material = ${tableAlias}.id
        `
    }

    static colorQuery({
        tableName = "mac"
    } = {}) {
        return `
        ${tableName}.color AS material_color
        `
    }

    static colorJoin({
        tableName = "material_color",
        tableAlias = "mac",
        mintTableName = "ma",
    } = {}) {
        return `
            LEFT JOIN ${tableName}  AS ${tableAlias}   ON ${mintTableName}.id = ${tableAlias}.material
        `
    }

}

module.exports = Material