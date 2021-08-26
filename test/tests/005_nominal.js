const { expect } = require('chai')
const { graphql } = require('../helpers/graphql')
const TestUser = require('../helpers/test-user')

describe(`Nominal Queries`, function () {
    it(`List`, async function () {
        let result = await graphql(`{nominal{id,name}}`)

        expect(result.data).to.deep.equal({
            "data": {
                "nominal": [
                    {
                        "id": "1",
                        "name": "1 Mark"
                    },
                    {
                        "id": "2",
                        "name": "1 Taler"
                    },
                    {
                        "id": "3",
                        "name": "1 Złoty"
                    }
                ]
            }
        })
    })

    it("Get", async function () {
        let result = await graphql(`
        {
            getNominal(id:1) {
                id,
                name
            }
        }
`)

        expect(result.data).to.deep.equal({
            "data": {
                "getNominal": {
                    "id": "1",
                    "name": "1 Mark"
                }
            }
        })
    })

    it("Search with regular characters", async function () {
        let result = await graphql(`
            {searchNominal(text: "zl") {
                id,
                name
              }}`)

        expect(result.data).to.deep.equal({
            "data": {
                "searchNominal": [
                    {
                        "id": "3",
                        "name": '1 Złoty'
                    }
                ]
            }
        })
    })

    it("Search with exact characters", async function () {
        let result = await graphql(`
            {searchNominal(text: "Zł") {
                id,
                name
              }}`)

        expect(result.data).to.deep.equal({
            "data": {
                "searchNominal": [
                    {
                        "id": "3",
                        "name": '1 Złoty'
                    }
                ]
            }
        })
    })

    it("Unauthorized Add Rejected", async function () {
        let promise = graphql(`mutation{addNominal(data:{name:"test"})}`)
        await expect(promise).to.be.rejectedWith(["401"])
    })

    it("Add", async function () {
        let promise = graphql(`mutation{addNominal(data:{name:"test"})}`, {}, TestUser.users[0].token)
        await expect(promise).to.be.fulfilled
    })


    it("Unauthorized Update Rejected", async function () {
        let promise = graphql(`mutation{updateNominal(data:{id:5, name: "changed"})}`)
        await expect(promise).to.be.rejectedWith(["401"])
    })

    it("Update", async function () {
        let promise = graphql(`mutation{updateNominal(data:{id:5, name: "changed"})}`, {}, TestUser.users[0].token)
        await expect(promise).to.be.fulfilled
    })

    it("Unauthorized Delete Rejected", async function () {
        let promise = graphql(`mutation{deleteNominal(id:4)}`)
        await expect(promise).to.be.rejectedWith(["404"])
    })

    it("Delete", async function () {
        let promise = graphql(`mutation{deleteNominal(id:4)}`, {}, TestUser.users[0].token)
        await expect(promise).to.be.fulfilled
    })



})
