const { log, error } = require('./logging');


class Async {
    static main(callback) {
        callback().then(log).catch(error)
    }
}

module.exports = Async