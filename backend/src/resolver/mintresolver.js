const Mint = require('../models/mint.js')
const Resolver = require("../resolver.js")

class MintResolver extends Resolver {

    constructor() {
        super("mint")
    }

    async get(_, args) {
        return Mint.getById(args.id)
    }

    async add(_, args) {
        return Mint.add(args.data)
    }

    async update(_, args) {
        return Mint.update(args.data)
    }

    async search(_, args) {
        return Mint.search(args.text)
    }

    async list(_, args) {
        return Mint.list()
    }

}

module.exports = MintResolver