/**
 * Baseclass for the GQL klasses.
 * 
 * With the GQL files, related queries stay neatly together in 
 * one file.
 * 
 */

class GQL {

    /**
     * mutations implement all mutations
     */
    static get Mutations() {
        return {}
    }

    /**
     * queries implement all public queries
     */
    static get Queries() {
        return {}
    }
}

module.exports = GQL