const { expect } = require('chai')
const { graphql } = require('../helpers/graphql')
const TestUser = require('../helpers/test-user')

const startData = {
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
                "id": "4",
                "name": "Perlmutt"
            },
            {
                "id": "3",
                "name": "Silber"
            }
        ]
    }
}

const body = `{
    id,
    name
}`

describe(`Material Queries`, function () {
    it(`List`, async function () {
        let result = await graphql(`{material{id,name}}`)

        expect(result.data).to.deep.equal(startData)
    })

    it("Get", async function () {
        let result = await graphql(`
        {
            getMaterial(id:3) ${body}
        }`)

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
            {searchMaterial(text: "go") ${body}}`)

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
            {searchMaterial(text: "Gø") ${body}}`)

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
        let promise = graphql(`mutation{deleteMaterial(id:5)}`)
        await expect(promise).to.be.rejectedWith(["404"])
    })

    it("Delete", async function () {
        let promise = graphql(`mutation{deleteMaterial(id:5)}`, {}, TestUser.users[0].token)
        await expect(promise).to.be.fulfilled
    })

    it("Table is the same as when started", async function () {
        let result = await graphql(`{material ${body}}`)
        expect(result.data).to.deep.equal(startData)
    })

})
