const { expect, config } = require('chai')
const { graphql } = require('../helpers/graphql')
const TestUser = require('../helpers/test-user')

// config.truncateThreshold = 0

const startData = {
    "data": {
        "person": [
            {
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
            },
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
                "id": "2",
                "name": "Angela Merkel",
                "shortName": "Merkel",
                "role": {
                    "id": null,
                    "name": null
                },
                "dynasty": {
                    "id": "1",
                    "name": "Deutsche"
                },
                "color": "#0000FF"
            },
            {
                "id": "22",
                "name": "Arielle",
                "shortName": "Ari",
                "role": {
                    "id": null,
                    "name": null
                },
                "dynasty": {
                    "id": "5",
                    "name": "Atlant"
                },
                "color": "#FF0000"
            },
            {
                "id": "10",
                "name": "Charles de Gaulle",
                "shortName": "de Gaulle",
                "role": {
                    "id": null,
                    "name": null
                },
                "dynasty": {
                    "id": "2",
                    "name": "Franzosen"
                },
                "color": "#DDDD00"
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
                "id": "6",
                "name": "Emmanuel Macron",
                "shortName": "Macron",
                "role": {
                    "id": null,
                    "name": null
                },
                "dynasty": {
                    "id": "2",
                    "name": "Franzosen"
                },
                "color": "#00CC0F"
            },
            {
                "id": "20",
                "name": "Fisch",
                "shortName": null,
                "role": {
                    "id": null,
                    "name": null
                },
                "dynasty": {
                    "id": "5",
                    "name": "Atlant"
                },
                "color": "#0000FF"
            },
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
                "id": "17",
                "name": "Guido Westerwelle",
                "shortName": "Westerwelle",
                "role": {
                    "id": null,
                    "name": null
                },
                "dynasty": {
                    "id": "1",
                    "name": "Deutsche"
                },
                "color": "#DD33FF"
            },
            {
                "id": "1",
                "name": "Helmut Kohl",
                "shortName": "Kohl",
                "role": {
                    "id": null,
                    "name": null
                },
                "dynasty": {
                    "id": "1",
                    "name": "Deutsche"
                },
                "color": "#111111"
            },
            {
                "id": "9",
                "name": "Jaques Chirac",
                "shortName": "Chirac",
                "role": {
                    "id": null,
                    "name": null
                },
                "dynasty": {
                    "id": "2",
                    "name": "Franzosen"
                },
                "color": "#FF1996"
            },
            {
                "id": "3",
                "name": "Joachim Gauck",
                "shortName": "Gauck",
                "role": {
                    "id": null,
                    "name": null
                },
                "dynasty": {
                    "id": "1",
                    "name": "Deutsche"
                },
                "color": "#EE3333"
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
                "id": "8",
                "name": "Nicolas Sarkozy",
                "shortName": "Sarkozy",
                "role": {
                    "id": null,
                    "name": null
                },
                "dynasty": {
                    "id": "2",
                    "name": "Franzosen"
                },
                "color": "#EECCAA"
            },
            {
                "id": "19",
                "name": "Plankton",
                "shortName": "Planki",
                "role": {
                    "id": null,
                    "name": null
                },
                "dynasty": {
                    "id": "5",
                    "name": "Atlant"
                },
                "color": "#11FFAA"
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
                "id": "23",
                "name": "Sebastian",
                "shortName": "Sebi",
                "role": {
                    "id": null,
                    "name": null
                },
                "dynasty": {
                    "id": null,
                    "name": null
                },
                "color": "#DD0101"
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
            },
            {
                "id": "14",
                "name": "Winston Churchill",
                "shortName": "Churchill",
                "role": {
                    "id": null,
                    "name": null
                },
                "dynasty": {
                    "id": "3",
                    "name": "Briten"
                },
                "color": "#004433"
            }
        ]
    }
}

const body = `{
    id name shortName role {
        id
        name
    }, dynasty {
        id
            name
    },
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
                    {
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
                    },
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
        let promise = graphql(`mutation{updatePerson(data:{id:26, name: "changed"})}`)
        await expect(promise).to.be.rejectedWith(["401"])
    })

    it("Update", async function () {
        let promise = graphql(`mutation{updatePerson(data:{id:26, name: "changed"})}`, {}, TestUser.users[0].token)
        await expect(promise).to.be.fulfilled
    })


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
