export default class PersonMint {

    constructor({
        mint = { id: 0 },
        issuers = [],
        caliphs = [],
        overlords = [],
    } = {}) {
        this.mint = mint
        this.issuers = issuers
        this.caliphs = caliphs
        this.overlords = overlords
    }

    static getPersonArray(pm) {
        return [...pm.issuers, ...pm.overlords, ...pm.caliphs]
    }

    static isEmpty(pm) {
        let count = PersonMint.getPersonArray(pm).length
        return count === 0
    }

    static containsSelectedRulers(pm, selectedRulers) {
        const all = this.getPersonArray(pm)
        return all.some(person => {
            return selectedRulers.indexOf(person.id) !== -1
        })
    }
}