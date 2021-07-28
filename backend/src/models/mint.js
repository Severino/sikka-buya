class Mint{
    static extract(result, prefix=""){
        return {
            id: result[`${prefix}id`],
            name: result[`${prefix}name`],
            location: result[`${prefix}location`],
            yearUncertain: result[`${prefix}yearUncertain`],
            uncertainLocation: result[`${prefix}uncertainLocation`]
        }
    }
}

module.exports = Mint