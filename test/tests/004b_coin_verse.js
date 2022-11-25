const { expect } = require('chai')
const { graphql } = require('../helpers/graphql')
const { User1 } = require('../mockdata/users')

const startData = {
    "data": {
        "coinVerse": [
            {
                "id": "3",
                "name": "Koran 30:4‒5"
            },
            {
                "id": "1",
                "name": "Koran 9:33"
            },
            {
                "id": "2",
                "name": "محمد رسول الله"
            }
        ]
    }
}

const body = `{
        id,
        name
    }`



describe(`CoinVerse Queries`, function () {
    it(`List`, async function () {
        let result = await graphql(`{coinVerse ${body}}`)

        expect(result.data).to.deep.equal(startData)
    })

    it("Get", async function () {
        let result = await graphql(`
            {
                getCoinVerse(id:2) ${body}
            }
    `)

        expect(result.data).to.deep.equal({
            "data": {
                "getCoinVerse": {
                    "id": "2",
                    "name": "محمد رسول الله"
                }
            }
        })
    })

    it("Search with regular characters", async function () {
        let result = await graphql(`
                {searchCoinVerse(text: "kor") ${body}}`)

        expect(result.data).to.deep.equal({
            "data": {
                "searchCoinVerse": [
                    {
                        "id": "3",
                        "name": "Koran 30:4‒5"
                    },
                    {
                        "id": "1",
                        "name": "Koran 9:33"
                    }
                ]
            }
        })
    })

    it("Search with exact characters", async function () {
        let result = await graphql(`
                {searchCoinVerse(text: "رسول") ${body}}`)

        expect(result.data).to.deep.equal({
            "data": {
                "searchCoinVerse": [
                    {
                        "id": "2",
                        "name": "محمد رسول الله"
                    }
                ]
            }
        })
    })

    it("Unauthorized Add Rejected", async function () {
        let promise = graphql(`mutation{addCoinVerse(name:"test")}`)
        await expect(promise).to.be.rejectedWith(["401"])
    })

    it("Add", async function () {
        let promise = graphql(`mutation{addCoinVerse(name:"test")}`, {}, User1.token)
        await expect(promise).to.be.fulfilled
    })

    it("Unauthorized Update Rejected", async function () {
        let promise = graphql(`mutation{updateCoinVerse(id:4, name: "changed")}`)
        await expect(promise).to.be.rejectedWith(["401"])
    })

    it("Update", async function () {
        let promise = graphql(`mutation{updateCoinVerse(id:4, name: "changed")}`, {}, User1.token)
        await expect(promise).to.be.fulfilled
    })

    it("Unauthorized Delete Rejected", async function () {
        let promise = graphql(`mutation{deleteCoinVerse(id:4)}`)
        await expect(promise).to.be.rejectedWith(["404"])
    })

    it("Reject Deleting used value", async function () {
        let promise = graphql(`mutation{deleteCoinVerse(id:2)}`, {}, User1.token)
        await expect(promise).to.be.rejectedWith(["400"])
    })

    it("Delete", async function () {
        let promise = graphql(`mutation{deleteCoinVerse(id:4)}`, {}, User1.token)
        await expect(promise).to.be.fulfilled
    })

    it("Table is the same as when started", async function () {
        let result = await graphql(`{coinVerse ${body}}`)
        expect(result.data).to.deep.equal(startData)
    })

})
