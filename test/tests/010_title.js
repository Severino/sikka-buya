const { expect } = require('chai')
const { graphql } = require('../helpers/graphql')
const TestUser = require('../helpers/test-user')

const startData = {
    "data": {
        "title": [
            {
                "name": "Dr.",
                "id": "2"
            },
            {
                "name": "König",
                "id": "4"
            },
            {
                "name": "Monsieur",
                "id": "3"
            },
            {
                "name": "Prof.",
                "id": "1"
            }
        ]
    }
}

describe(`Title Queries`, function () {
    it(`List`, async function () {
        let result = await graphql(`{title{id,name}}`)

        expect(result.data).to.deep.equal(startData)
    })

    it("Get", async function () {
        let result = await graphql(`
        {
            getTitle(id:3) {
                id,
                name
            }
        }
`)

        expect(result.data).to.deep.equal({
            "data": {
                "getTitle": {
                    "id": "3",
                    "name": "Monsieur"
                }
            }
        })
    })

    it("Search with regular characters", async function () {
        let result = await graphql(`
            {searchTitle(text: "Kö") {
                id,
                name
              }}`)

        expect(result.data).to.deep.equal({
            "data": {
                "searchTitle": [
                    {
                        "id": "4",
                        "name": 'König'
                    }
                ]
            }
        })
    })

    it("Search with exact characters", async function () {
        let result = await graphql(`
            {searchTitle(text: "Kö") {
                id,
                name
              }}`)

        expect(result.data).to.deep.equal({
            "data": {
                "searchTitle": [
                    {
                        "id": "4",
                        "name": 'König'
                    }
                ]
            }
        })
    })

    it("Unauthorized Add Rejected", async function () {
        let promise = graphql(`mutation{addTitle(data:{name:"test"})}`)
        await expect(promise).to.be.rejectedWith(["401"])
    })

    it("Add", async function () {
        let promise = graphql(`mutation{addTitle(data:{name:"test"})}`, {}, TestUser.users[0].token)
        await expect(promise).to.be.fulfilled
    })


    it(`Add results in correct Database`, async function () {
        let result = await graphql(`{title{id,name}}`)
        expect(result.data).to.deep.equal({
            "data": {
                "title": [
                    {
                        "id": "2",
                        "name": "Dr."
                    },
                    {
                        "id": "4",
                        "name": "König"
                    },
                    {
                        "id": "3",
                        "name": "Monsieur"
                    },
                    {
                        "id": "1",
                        "name": "Prof."
                    },
                    {
                        "id": "5",
                        "name": "test"
                    }
                ]
            }
        })
    })

    it("Unauthorized Update Rejected", async function () {
        let promise = graphql(`mutation{updateTitle(data:{id:5, name: "changed"})}`)
        await expect(promise).to.be.rejectedWith(["401"])
    })


    it("Update", async function () {
        let promise = graphql(`mutation{updateTitle(data:{id:5, name: "changed"})}`, {}, TestUser.users[0].token)
        await expect(promise).to.be.fulfilled
    })


    it(`Update results in correct Database`, async function () {
        let result = await graphql(`{title{id,name}}`)
        expect(result.data).to.deep.equal({
            "data": {
                "title": [
                    {
                        "id": "5",
                        "name": "changed"
                    },
                    {
                        "id": "2",
                        "name": "Dr."
                    },
                    {
                        "id": "4",
                        "name": "König"
                    },
                    {
                        "id": "3",
                        "name": "Monsieur"
                    },
                    {
                        "id": "1",
                        "name": "Prof."
                    }
                ]
            }
        })
    })

    it("Unauthorized Delete Rejected", async function () {
        let promise = graphql(`mutation{deleteTitle(id:5)}`)
        await expect(promise).to.be.rejectedWith(["404"])
    })

    it("Delete", async function () {
        let promise = graphql(`mutation{deleteTitle(id:5)}`, {}, TestUser.users[0].token)
        await expect(promise).to.be.fulfilled
    })


    it("Table is the same as when started", async function () {
        let result = await graphql(`{title{id,name}}`)
        expect(result.data).to.deep.equal(startData)
    })
})
