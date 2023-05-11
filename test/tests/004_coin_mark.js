const { expect } = require('chai')
const { graphql } = require('../helpers/graphql')
const { User1 } = require('../mockdata/users')

const startData = {
    "data": {
        "coinMark": [
            {
                "id": "5",
                "name": "€"
            }, {
                "id": "1",
                "name": "Ä"
            },
            {
                "id": "3",
                "name": "ê"
            },
            {
                "id": "2",
                "name": "Ü"
            },
            {
                "id": "4",
                "name": "π"
            }
        ]
    }
}

const body = `{
        id,
        name
    }`



describe(`CoinMark Queries`, function () {
    it(`List`, async function () {
        let result = await graphql(`{coinMark ${body}}`)

        expect(result.data).to.deep.equal(startData)
    })

    it("Get", async function () {
        let result = await graphql(`
        {
            getCoinMark(id:3) ${body}
        }
`)

        expect(result.data).to.deep.equal({
            "data": {
                "getCoinMark": {
                    "id": "3",
                    "name": "ê"
                }
            }
        })
    })

    it("Search with regular characters", async function () {
        let result = await graphql(`
            {searchCoinMark(text: "e") ${body}}`)

        expect(result.data).to.deep.equal({
            "data": {
                "searchCoinMark": [
                    {
                        "id": "3",
                        "name": "ê"
                    }
                ]
            }
        })
    })

    it("Search with exact characters", async function () {
        let result = await graphql(`
            {searchCoinMark(text: "ê") ${body}}`)

        expect(result.data).to.deep.equal({
            "data": {
                "searchCoinMark": [
                    {
                        "id": "3",
                        "name": "ê"
                    }
                ]
            }
        })
    })

    it("Unauthorized Add Rejected", async function () {
        let promise = graphql(`mutation{addCoinMark(name:"test")}`)
        await expect(promise).to.be.rejectedWith(["401"])
    })

    it("Add", async function () {
        let promise = graphql(`mutation{addCoinMark(name:"test")}`, {}, User1.token)
        await expect(promise).to.be.fulfilled
    })

    it("Unauthorized Update Rejected", async function () {
        let promise = graphql(`mutation{updateCoinMark(id:6, name: "changed")}`)
        await expect(promise).to.be.rejectedWith(["401"])
    })

    it("Update", async function () {
        let promise = graphql(`mutation{updateCoinMark(id:6, name: "changed")}`, {}, User1.token)
        await expect(promise).to.be.fulfilled
    })

    it("Unauthorized Delete Rejected", async function () {
        let promise = graphql(`mutation{deleteCoinMark(id:6)}`)
        await expect(promise).to.be.rejectedWith(["404"])
    })

    it("Delete", async function () {
        let promise = graphql(`mutation{deleteCoinMark(id:6)}`, {}, User1.token)
        await expect(promise).to.be.fulfilled
    })

    it("Table is the same as when started", async function () {
        let result = await graphql(`{coinMark ${body}}`)
        expect(result.data).to.deep.equal(startData)
    })

})
