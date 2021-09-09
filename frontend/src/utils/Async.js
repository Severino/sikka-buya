class Async {

    static sleep(seconds) {
        return new Promise((r) => setTimeout(r, seconds));
    }
}

module.exports = Async