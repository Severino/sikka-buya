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
                }
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
                }
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
                }
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
                }
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
                }
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
                }
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
                }
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
                }
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
                }
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
                }
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
                }
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
                }
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
                }
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
                }
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
                }
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
                }
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
                }
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
                }
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
                }
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
                }
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
                }
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
                }
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
                }
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
                }
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
                }
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
    }
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
                    }
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
                        }
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
                        }
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
                        }
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
                        }
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
                        }
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
                        }
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
                        }
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
                        }
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
                        }
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
                        }
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
                        }
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
                        }
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
                        }
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
