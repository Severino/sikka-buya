const { expect, config } = require('chai')
const { graphql } = require('../helpers/graphql')
const TestUser = require('../helpers/test-user')
const { UDERZO,
    DUERER,
    MERKEL,
    ARIELLE,
    CHARLES_DE_GAULLE,
    ELIZABETH_II,
    MACRON,
    FISCH,
    HOLLANDE,
    BERNINI,
    WESTERWELLE,
    KOHL,
    CHIRAC,
    GAUCK,
    KARL,
    LOUIS,
    MICHELANGELO,
    SARKOZY,
    PLANKTON,
    POSEIDON,
    GOSCINNY,
    SEBASTIAN,
    WAL,
    TURNER,
    CHURCHILL } = require('../mockdata/persons')


// config.truncateThreshold = 0

const startData = {
    "data": {
        "person": [
            UDERZO,
            DUERER,
            MERKEL,
            ARIELLE,
            CHARLES_DE_GAULLE,
            ELIZABETH_II,
            MACRON,
            FISCH,
            HOLLANDE,
            BERNINI,
            WESTERWELLE,
            KOHL,
            CHIRAC,
            GAUCK,
            KARL,
            LOUIS,
            MICHELANGELO,
            SARKOZY,
            PLANKTON,
            POSEIDON,
            GOSCINNY,
            SEBASTIAN,
            WAL,
            TURNER,
            CHURCHILL
        ]
    }
}

const body = `{
    id name shortName 
    role {
        id
        name
    } 
    dynasty {
        id
        name
    }
    color
}`


describe(`Person Queries`, function () {
    it(`List`, async function () {
        let result = await graphql(`{person ${body}}`)

        expect(result.data).to.deep.equal(startData)
    })


    it("Get", async function () {
        let result = await graphql(`
        {
            getPerson(id:12) ${body}
        }
`)

        expect(result.data).to.deep.equal({
            "data": {
                "getPerson": {
                    "id": "12",
                    "name": "Albert Uderzo",
                    "shortName": "Uderzo",
                    "role": {
                        "id": "2",
                        "name": "cutter"
                    },
                    "dynasty": {
                        "id": "2",
                        "name": "Franzosen"
                    },
                    "color": "#FFFF00"
                }
            }
        })
    })

    it("Search with regular characters", async function () {
        let result = await graphql(`
            {searchPerson(text: "cois ") ${body}}`)

        expect(result.data).to.deep.equal({
            "data": {
                "searchPerson": [
                    {
                        "id": "7",
                        "name": "François Hollande",
                        "shortName": "Hollande",
                        "role": {
                            "id": null,
                            "name": null
                        },
                        "dynasty": {
                            "id": "2",
                            "name": "Franzosen"
                        },
                        "color": "#58ecF0"
                    }
                ]
            }
        })
    })

    it("Search with exact characters", async function () {
        let result = await graphql(`
              {searchPerson(text: "çois ") ${body}}`)

        expect(result.data).to.deep.equal({
            "data": {
                "searchPerson": [
                    {
                        "id": "7",
                        "name": "François Hollande",
                        "shortName": "Hollande",
                        "role": {
                            "id": null,
                            "name": null
                        },
                        "dynasty": {
                            "id": "2",
                            "name": "Franzosen"
                        },
                        "color": "#58ecF0"
                    }
                ]
            }
        })
    })

    it("Search Person With Role", async function () {
        let result = await graphql(`{searchPersonsWithRole(text:"") ${body}}`)

        expect(result.data).to.deep.equal({
            "data": {
                "searchPersonsWithRole": [
                    UDERZO,
                    {
                        "id": "5",
                        "name": "Albrecht Dürer",
                        "shortName": "Dürer",
                        "role": {
                            "id": "2",
                            "name": "cutter"
                        },
                        "dynasty": {
                            "id": "1",
                            "name": "Deutsche"
                        },
                        "color": "#FF00FF"
                    },
                    {
                        "id": "15",
                        "name": "Elizabeth II",
                        "shortName": "The Queen",
                        "role": {
                            "id": "1",
                            "name": "caliph"
                        },
                        "dynasty": {
                            "id": "3",
                            "name": "Briten"
                        },
                        "color": "#DDDDFF"
                    },
                    {
                        "id": "25",
                        "name": "Gian Lorenzo Bernini",
                        "shortName": "Bernini",
                        "role": {
                            "id": "2",
                            "name": "cutter"
                        },
                        "dynasty": {
                            "id": "5",
                            "name": "Atlant"
                        },
                        "color": "#AB87DF"
                    },
                    {
                        "id": "4",
                        "name": "Karl der Große",
                        "shortName": "Karl",
                        "role": {
                            "id": "1",
                            "name": "caliph"
                        },
                        "dynasty": {
                            "id": "1",
                            "name": "Deutsche"
                        },
                        "color": "#F3C3A3"
                    },
                    {
                        "id": "11",
                        "name": "Louis XVI",
                        "shortName": "Louis",
                        "role": {
                            "id": "1",
                            "name": "caliph"
                        },
                        "dynasty": {
                            "id": "2",
                            "name": "Franzosen"
                        },
                        "color": "#3333FF"
                    },
                    {
                        "id": "24",
                        "name": "Michelangelo",
                        "shortName": "Miquel",
                        "role": {
                            "id": "2",
                            "name": "cutter"
                        },
                        "dynasty": {
                            "id": "5",
                            "name": "Atlant"
                        },
                        "color": "#3FF3FF"
                    },
                    {
                        "id": "18",
                        "name": "Poseidon",
                        "shortName": "Neptun",
                        "role": {
                            "id": "1",
                            "name": "caliph"
                        },
                        "dynasty": {
                            "id": "5",
                            "name": "Atlant"
                        },
                        "color": "#99FFAA"
                    },
                    {
                        "id": "13",
                        "name": "René Goscinny",
                        "shortName": "Goscinny",
                        "role": {
                            "id": "2",
                            "name": "cutter"
                        },
                        "dynasty": {
                            "id": "2",
                            "name": "Franzosen"
                        },
                        "color": "#FE0101"
                    },
                    {
                        "id": "21",
                        "name": "Wal",
                        "shortName": null,
                        "role": {
                            "id": "2",
                            "name": "cutter"
                        },
                        "dynasty": {
                            "id": "5",
                            "name": "Atlant"
                        },
                        "color": "#222222"
                    },
                    {
                        "id": "16",
                        "name": "William Turner",
                        "shortName": "Turner",
                        "role": {
                            "id": "2",
                            "name": "cutter"
                        },
                        "dynasty": {
                            "id": "3",
                            "name": "Briten"
                        },
                        "color": "#555555"
                    }
                ]
            }
        })
    })



    it("Unauthorized Add Rejected", async function () {
        let promise = graphql(`mutation {
            addPerson(data:{name:"Claude Monet", shortName: "Monet", role: 2, dynasty:2})
          }`)
        await expect(promise).to.be.rejectedWith(["401"])
    })

    it("Add", async function () {
        let promise = graphql(`mutation {
            addPerson(data:{name:"Claude Monet", shortName: "Monet", role: 2, dynasty:2})
          }`, {}, TestUser.users[0].token)
        await expect(promise).to.be.fulfilled
    })

    it("Unauthorized Update Rejected", async function () {
        let promise = graphql(`mutation{updatePerson(data:{id:26, name: "changed", role: 1, dynasty: 1, color:"#ff0000"})}`)
        await expect(promise).to.be.rejectedWith(["401"])
    })

    it("Update", async function () {
        let promise = graphql(`mutation{updatePerson(data:{id:26, name: "changed", role: 1, dynasty: 1, color:"#00ff00"})}`, {}, TestUser.users[0].token)
        await expect(promise).to.be.fulfilled
    })

    //TODO CHECK IF UPDATED SUCCESSFULLY

    it("Unauthorized Delete Rejected", async function () {
        let promise = graphql(`mutation{deletePerson(id:26)}`)
        await expect(promise).to.be.rejectedWith(["404"])
    })

    it("Delete", async function () {
        let promise = graphql(`mutation{deletePerson(id:26)}`, {}, TestUser.users[0].token)
        await expect(promise).to.be.fulfilled
    })

    it("Table is the same as when started", async function () {
        let result = await graphql(`{person ${body}}`)
        expect(result.data).to.deep.equal(startData)
    })

})
