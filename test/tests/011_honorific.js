const { expect } = require('chai')
const { graphql } = require('../helpers/graphql')
const TestUser = require('../helpers/test-user')


const startData = {
    "data": {
        "honorific": [
            {
                "name": "bulldozer",
                "id": "3"
            },
            {
                "name": "der Schwarze Riese",
                "id": "1"
            },
            {
                "name": "die Birne",
                "id": "2"
            },
            {
                "name": "le Français",
                "id": "4"
            },
            {
                "name": "le générale",
                "id": "5"
            },
            {
                "name": "von Deutschland",
                "id": "6"
            }
        ]
    }
}

describe(`Honorific Queries`, function () {
    it(`List`, async function () {
        let result = await graphql(`{honorific{id,name}}`)

        expect(result.data).to.deep.equal(startData)
    })

    it("Get", async function () {
        let result = await graphql(`
        {
            getHonorific(id:5) {
                id,
                name
            }
        }
`)

        expect(result.data).to.deep.equal({
            "data": {
                "getHonorific": {
                    "name": "le générale",
                    "id": "5"
                }
            }
        })
    })

    it("Search with regular characters", async function () {
        let result = await graphql(`
            {searchHonorific(text: "ça") {
                id,
                name
              }}`)

        expect(result.data).to.deep.equal({
            "data": {
                "searchHonorific": [
                    {
                        "id": "4",
                        "name": "le Français"
                    }
                ]
            }
        })
    })

    it("Search with exact characters", async function () {
        let result = await graphql(`
            {searchHonorific(text: "ça") {
                id,
                name
              }}`)

        expect(result.data).to.deep.equal({
            "data": {
                "searchHonorific": [
                    {
                        "id": "4",
                        "name": "le Français"
                    }
                ]
            }
        })
    })

    it("Unauthorized Add Rejected", async function () {
        let promise = graphql(`mutation{addHonorific(data:{name:"test"})}`)
        await expect(promise).to.be.rejectedWith(["401"])
    })

    it("Add", async function () {
        let promise = graphql(`mutation{addHonorific(data:{name:"test"})}`, {}, TestUser.users[0].token)
        await expect(promise).to.be.fulfilled
    })

    it(`Add results in correct Database`, async function () {
        let result = await graphql(`{honorific{id,name}}`)
        expect(result.data).to.deep.equal({
            "data": {
                "honorific": [
                    {
                        "id": "3",
                        "name": "bulldozer"
                    },
                    {
                        "id": "1",
                        "name": "der Schwarze Riese"
                    },
                    {
                        "id": "2",
                        "name": "die Birne"
                    },
                    {
                        "id": "4",
                        "name": "le Français"
                    },
                    {
                        "id": "5",
                        "name": "le générale"
                    },
                    {
                        "id": "7",
                        "name": "test"
                    },
                    {
                        "id": "6",
                        "name": "von Deutschland"
                    }
                ]
            }
        })
    })


    it("Unauthorized Update Rejected", async function () {
        let promise = graphql(`mutation{updateHonorific(data:{id:7, name: "changed"})}`)
        await expect(promise).to.be.rejectedWith(["401"])
    })


    it("Update", async function () {
        let promise = graphql(`mutation{updateHonorific(data:{id:7, name: "changed"})}`, {}, TestUser.users[0].token)
        await expect(promise).to.be.fulfilled
    })

    it(`Update results in correct Database`, async function () {
        let result = await graphql(`{honorific{id,name}}`)
        expect(result.data).to.deep.equal({
            "data": {
                "honorific": [
                    {
                        "id": "3",
                        "name": "bulldozer"
                    },
                    {
                        "id": "7",
                        "name": "changed"
                    },
                    {
                        "id": "1",
                        "name": "der Schwarze Riese"
                    },
                    {
                        "id": "2",
                        "name": "die Birne"
                    },
                    {
                        "id": "4",
                        "name": "le Français"
                    },
                    {
                        "id": "5",
                        "name": "le générale"
                    },
                    {
                        "id": "6",
                        "name": "von Deutschland"
                    }
                ]
            }
        })
    })

    it("Unauthorized Delete Rejected", async function () {
        let promise = graphql(`mutation{deleteHonorific(id:7)}`)
        await expect(promise).to.be.rejectedWith(["404"])
    })

    it("Delete", async function () {
        let promise = graphql(`mutation{deleteHonorific(id:7)}`, {}, TestUser.users[0].token)
        await expect(promise).to.be.fulfilled
    })


    it("Table is the same as when started", async function () {
        let result = await graphql(`{honorific{id,name}}`)
        expect(result.data).to.deep.equal(startData)
    })
})
