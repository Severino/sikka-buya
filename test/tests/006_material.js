const { expect } = require('chai')
const { graphql } = require('../helpers/graphql')
const TestUser = require('../helpers/test-user')

describe(`Material Queries`, function () {
    it(`List`, async function () {
        let result = await graphql(`{material{id,name}}`)

        expect(result.data).to.deep.equal({
            "data": {
                "material": [
                    {
                        "id": "1",
                        "name": "Gøld"
                    },
                    {
                        "id": "2",
                        "name": "Kupfer"
                    },
                    {
                        "id": "3",
                        "name": "Silber"
                    }
                ]
            }
        })
    })

    it("Get", async function () {
        let result = await graphql(`
        {
            getMaterial(id:3) {
                id,
                name
            }
        }
`)

        expect(result.data).to.deep.equal({
            "data": {
                "getMaterial": {
                    "id": "3",
                    "name": "Silber"
                }
            }
        })
    })

    it("Search with regular characters", async function () {
        let result = await graphql(`
            {searchMaterial(text: "go") {
                id,
                name
              }}`)

        expect(result.data).to.deep.equal({
            "data": {
                "searchMaterial": [
                    {
                        "id": "1",
                        "name": 'Gøld'
                    }
                ]
            }
        })
    })

    it("Search with exact characters", async function () {
        let result = await graphql(`
            {searchMaterial(text: "Gø") {
                id,
                name
              }}`)

        expect(result.data).to.deep.equal({
            "data": {
                "searchMaterial": [
                    {
                        "id": "1",
                        "name": 'Gøld'
                    }
                ]
            }
        })
    })

    it("Unauthorized Add Rejected", async function () {
        let promise = graphql(`mutation{addMaterial(data:{name:"test"})}`)
        await expect(promise).to.be.rejectedWith(["401"])
    })

    it("Add", async function () {
        let promise = graphql(`mutation{addMaterial(data:{name:"test"})}`, {}, TestUser.users[0].token)
        await expect(promise).to.be.fulfilled
    })

    it("Unauthorized Update Rejected", async function () {
        let promise = graphql(`mutation{updateMaterial(data:{id:5, name: "changed"})}`)
        await expect(promise).to.be.rejectedWith(["401"])
    })


    it("Update", async function () {
        let promise = graphql(`mutation{updateMaterial(data:{id:5, name: "changed"})}`, {}, TestUser.users[0].token)
        await expect(promise).to.be.fulfilled
    })

    it("Unauthorized Delete Rejected", async function () {
        let promise = graphql(`mutation{deleteMaterial(id:4)}`)
        await expect(promise).to.be.rejectedWith(["404"])
    })

    it("Delete", async function () {
        let promise = graphql(`mutation{deleteMaterial(id:4)}`, {}, TestUser.users[0].token)
        await expect(promise).to.be.fulfilled
    })



})
