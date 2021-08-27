
const { expect } = require('chai')
const { graphql } = require('../helpers/graphql')
const TestUser = require('../helpers/test-user')

describe(`Dynasty Queries`, function () {
    it(`List`, async function () {
        let result = await graphql(`{dynasty{id,name}}`)

        expect(result.data).to.deep.equal({
            "data": {
                "dynasty": [
                    {
                        "id": "3",
                        "name": "Briten"
                    },
                    {
                        "id": "1",
                        "name": "Deutsche"
                    },
                    {
                        "id": "2",
                        "name": "Franzosen"
                    },
                    {
                        "id": "4",
                        "name": "Österreicher"
                    },
                ]
            }
        })
    })

    it("Get", async function () {
        let result = await graphql(`
        {
            getDynasty(id:2) {
                id,
                name
            }
        }
`)

        expect(result.data).to.deep.equal({
            "data": {
                "getDynasty": {
                    "id": "2",
                    "name": "Franzosen"
                }
            }
        })
    })

    it("Search with regular characters", async function () {
        let result = await graphql(`
            {searchDynasty(text: "ös") {
                id,
                name
              }}`)

        expect(result.data).to.deep.equal({
            "data": {
                "searchDynasty": [
                    {
                        "id": "2",
                        "name": "Franzosen"
                    },
                    {
                        "id": "4",
                        "name": "Österreicher"
                    }
                ]
            }
        })
    })

    it("Search with exact characters", async function () {
        let result = await graphql(`
            {searchDynasty(text: "Ös") {
                id,
                name
              }}`)

        expect(result.data).to.deep.equal({
            "data": {
                "searchDynasty": [
                    {
                        "id": "2",
                        "name": "Franzosen"
                    },
                    {
                        "id": "4",
                        "name": "Österreicher"
                    }
                ]
            }
        })
    })

    it("Unauthorized Add Rejected", async function () {
        let promise = graphql(`mutation{addDynasty(data:{name:"test"})}`)
        await expect(promise).to.be.rejectedWith(["401"])
    })

    it("Add", async function () {
        let promise = graphql(`mutation{addDynasty(data:{name:"test"})}`, {}, TestUser.users[0].token)
        await expect(promise).to.be.fulfilled
    })


    it("Unauthorized Update Rejected", async function () {
        let promise = graphql(`mutation{updateDynasty(data:{id:5, name: "changed"})}`)
        await expect(promise).to.be.rejectedWith(["401"])
    })

    it("Update", async function () {
        let promise = graphql(`mutation{updateDynasty(data:{id:5, name: "changed"})}`, {}, TestUser.users[0].token)
        await expect(promise).to.be.fulfilled
    })

    it("Unauthorized Delete Rejected", async function () {
        let promise = graphql(`mutation{deleteDynasty(id:5)}`)
        await expect(promise).to.be.rejectedWith(["404"])
    })

    it("Delete", async function () {
        let promise = graphql(`mutation{deleteDynasty(id:5)}`, {}, TestUser.users[0].token)
        await expect(promise).to.be.fulfilled
    })

})
