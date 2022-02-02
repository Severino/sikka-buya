class Dictionary {

    constructor(lang, dictionary) {
        this.lang = lang
        this._inventory = dictionary
    }

    add(key, val) {
        this._inventory[key] = val
    }

    get(key) {
        if (this._inventory[key] == null) {
            return key
        } else {
            return this._inventory[key]
        }
    }
}

module.exports = Dictionary