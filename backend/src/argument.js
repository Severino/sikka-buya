class Argument {

    static require(obj) {
        for (let [name, value] of Object.entries(obj)) {
            if (value == null) {
                throw new Error(`Missing required argument ${name}`)
            }
        }
    }
}

module.exports = Argument