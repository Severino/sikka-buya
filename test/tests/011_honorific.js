const { expect } = require('chai')
const { graphql } = require('../helpers/graphql')
const { User1 } = require('../mockdata/users')


const startData = {
    "data": {
        "honorific": [
            {
                "id": "3",
                "name": "bulldozer"
            },
            {
                "id": "8",
                "name": "der Große"
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
                "name": "Meerjungfrau"
            },
            {
                "id": "6",
                "name": "von Deutschland"
            },
            {
                "id": "9",
                "name": "Wesen des Meeres"
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
        let promise = graphql(`mutation{addHonorific(name:"test")}`)
        await expect(promise).to.be.rejectedWith(["401"])
    })

    it("Add", async function () {
        let promise = graphql(`mutation{addHonorific(name:"test")}`, {}, User1.token)
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
                        "id": "8",
                        "name": "der Große"
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
                        "name": "Meerjungfrau"
                    },
                    {
                        "id": "10",
                        "name": "test"
                    },
                    {
                        "id": "6",
                        "name": "von Deutschland"
                    },
                    {
                        "id": "9",
                        "name": "Wesen des Meeres"
                    }
                ]
            }
        })
    })


    it("Unauthorized Update Rejected", async function () {
        let promise = graphql(`mutation{updateHonorific(id:10, name: "changed")}`)
        await expect(promise).to.be.rejectedWith(["401"])
    })


    it("Update", async function () {
        let promise = graphql(`mutation{updateHonorific(id:10, name: "changed")}`, {}, User1.token)
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
                    }, {
                        "id": "10",
                        "name": "changed"
                    },
                    {
                        "id": "8",
                        "name": "der Große"
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
                        "name": "Meerjungfrau"
                    },

                    {
                        "id": "6",
                        "name": "von Deutschland"
                    },
                    {
                        "id": "9",
                        "name": "Wesen des Meeres"
                    }
                ]
            }
        })
    })

    it("Unauthorized Delete Rejected", async function () {
        let promise = graphql(`mutation{deleteHonorific(id:10)}`)
        await expect(promise).to.be.rejectedWith(["404"])
    })

    it("Delete", async function () {
        let promise = graphql(`mutation{deleteHonorific(id:10)}`, {}, User1.token)
        await expect(promise).to.be.fulfilled
    })


    it("Table is the same as when started", async function () {
        let result = await graphql(`{honorific{id,name}}`)
        expect(result.data).to.deep.equal(startData)
    })
})
