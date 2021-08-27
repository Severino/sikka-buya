const { expect } = require('chai')
const { graphql } = require('../helpers/graphql')
const TestUser = require('../helpers/test-user')

describe(`Role Queries`, function () {
    it(`List`, async function () {
        let result = await graphql(`{role{id,name}}`)

        expect(result.data).to.deep.equal({
            "data": {
                "role": [
                    {
                        "name": "caliph",
                        "id": "1"
                    },
                    {
                        "name": "cutter",
                        "id": "2"
                    },
                    {
                        "id": "3",
                        "name": "Dāula"
                    }
                ]
            }
        })
    })

    it("Get", async function () {
        let result = await graphql(`
        {
            getRole(id:2) {
                id,
                name
            }
        }
`)

        expect(result.data).to.deep.equal({
            "data": {
                "getRole": {
                    "id": "2",
                    "name": "cutter"
                }
            }
        })
    })

    it("Search with regular characters", async function () {
        let result = await graphql(`
            {searchRole(text: "da") {
                id,
                name
              }}`)

        expect(result.data).to.deep.equal({
            "data": {
                "searchRole": [
                    {
                        "id": "3",
                        "name": 'Dāula'
                    }
                ]
            }
        })
    })

    it("Search with exact characters", async function () {
        let result = await graphql(`
            {searchRole(text: "Dā") {
                id,
                name
              }}`)

        expect(result.data).to.deep.equal({
            "data": {
                "searchRole": [
                    {
                        "id": "3",
                        "name": 'Dāula'
                    }
                ]
            }
        })
    })

    it("Unauthorized Add Rejected", async function () {
        let promise = graphql(`mutation{addRole(data:{name:"test"})}`)
        await expect(promise).to.be.rejectedWith(["401"])
    })

    it("Add", async function () {
        let promise = graphql(`mutation{addRole(data:{name:"test"})}`, {}, TestUser.users[0].token)
        await expect(promise).to.be.fulfilled
    })


    it("Unauthorized Update Rejected", async function () {
        let promise = graphql(`mutation{updateRole(data:{id:5, name: "changed"})}`)
        await expect(promise).to.be.rejectedWith(["401"])
    })

    it("Update", async function () {
        let promise = graphql(`mutation{updateRole(data:{id:5, name: "changed"})}`, {}, TestUser.users[0].token)
        await expect(promise).to.be.fulfilled
    })

    it("Unauthorized Delete Rejected", async function () {
        let promise = graphql(`mutation{deleteRole(id:4)}`)
        await expect(promise).to.be.rejectedWith(["404"])
    })

    it("Delete", async function () {
        let promise = graphql(`mutation{deleteRole(id:4)}`, {}, TestUser.users[0].token)
        await expect(promise).to.be.fulfilled
    })

})
