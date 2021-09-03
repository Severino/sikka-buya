

const { expect } = require('chai')
const { graphql } = require('../helpers/graphql')
const TestUser = require('../helpers/test-user')


const startData = {
    "data": {
        "mint": [
            {
                "id": "1",
                "name": "Berlin",
                "location": "{\"type\":\"Point\",\"coordinates\":[52.51968196,13.376689258]}",
                "uncertain": false,
                "uncertainArea": null
            },
            {
                "id": "2",
                "name": "Paris",
                "location": "{\"type\":\"Point\",\"coordinates\":[48.863113497,2.337794633]}",
                "uncertain": false,
                "uncertainArea": null
            },
            {
                "id": "3",
                "name": "Rom",
                "location": "{\"type\":\"Point\",\"coordinates\":[41.9053729,12.452903458]}",
                "uncertain": false,
                "uncertainArea": null
            },
            {
                "id": "4",
                "name": "Ǎtlantis",
                "location": "{\"type\":\"Point\",\"coordinates\":[40.450505694,6.15439645]}",
                "uncertain": true,
                "uncertainArea": "{\"type\":\"Polygon\",\"coordinates\":[[[5.2734375,41.697525911],[3.779296875,40.838749138],[5.438232422,39.300299186],[6.877441406,39.283293869],[7.492675781,40.513799155],[6.701660156,41.557921578],[5.2734375,41.697525911]]]}"
            }
        ]
    }
}

const body = `{id,name,location , uncertain,uncertainArea}`


describe(`Mint Queries`, function () {
    it(`List`, async function () {
        let result = await graphql(`{mint ${body}}`)
        expect(result.data).to.deep.equal(startData)
    })

    it("Get", async function () {
        let result = await graphql(`{getMint(id:4)${body}}`)

        expect(result.data).to.deep.equal({
            "data": {
                "getMint": {
                    "id": "4",
                    "name": "Ǎtlantis",
                    "location": "{\"type\":\"Point\",\"coordinates\":[40.450505694,6.15439645]}",
                    "uncertain": true,
                    "uncertainArea": "{\"type\":\"Polygon\",\"coordinates\":[[[5.2734375,41.697525911],[3.779296875,40.838749138],[5.438232422,39.300299186],[6.877441406,39.283293869],[7.492675781,40.513799155],[6.701660156,41.557921578],[5.2734375,41.697525911]]]}"
                }
            }
        })
    })

    it("Search with regular characters", async function () {
        let result = await graphql(`
            {searchMint(text: "at") ${body}}`)

        expect(result.data).to.deep.equal({
            "data": {
                "searchMint": [
                    {
                        "id": "4",
                        "name": "Ǎtlantis",
                        "location": "{\"type\":\"Point\",\"coordinates\":[40.450505694,6.15439645]}",
                        "uncertain": true,
                        "uncertainArea": "{\"type\":\"Polygon\",\"coordinates\":[[[5.2734375,41.697525911],[3.779296875,40.838749138],[5.438232422,39.300299186],[6.877441406,39.283293869],[7.492675781,40.513799155],[6.701660156,41.557921578],[5.2734375,41.697525911]]]}"
                    }
                ]
            }
        })
    })

    it("Search with exact characters", async function () {
        let result = await graphql(`
            {searchMint(text: "Ǎt") ${body}}`)

        expect(result.data).to.deep.equal({
            "data": {
                "searchMint": [
                    {
                        "id": "4",
                        "name": "Ǎtlantis",
                        "location": "{\"type\":\"Point\",\"coordinates\":[40.450505694,6.15439645]}",
                        "uncertain": true,
                        "uncertainArea": "{\"type\":\"Polygon\",\"coordinates\":[[[5.2734375,41.697525911],[3.779296875,40.838749138],[5.438232422,39.300299186],[6.877441406,39.283293869],[7.492675781,40.513799155],[6.701660156,41.557921578],[5.2734375,41.697525911]]]}"
                    }
                ]
            }
        })
    })

    it("Unauthorized Add Rejected", async function () {
        let promise = graphql(`mutation{addMint(data:
            {
                name: "Test",
                location: "{'type':'Point','coordinates':[8,49]}", 
                uncertain: true,
                uncertainArea: "{'type':'Polygon','coordinates':[[[7.020263671875,50.97918242660188],[6.712646484375,49.13859653703879],[9.0087890625,48.922499263758255],[9.184570312499998,50.972264889367494],[7.020263671875,50.97918242660188]]]}"
            })}`)
        await expect(promise).to.be.rejectedWith(["401"])
    })

    it("Add", async function () {
        let promise = graphql(`mutation{addMint(data:
            {
                name: "Test",
                location: "{'type':'Point','coordinates':[8,49]}", 
                uncertain: true,
                uncertainArea: "{'type':'Polygon','coordinates':[[[7.020263671875,50.97918242660188],[6.712646484375,49.13859653703879],[9.0087890625,48.922499263758255],[9.184570312499998,50.972264889367494],[7.020263671875,50.97918242660188]]]}"
            })}`, {}, TestUser.users[0].token)
        await expect(promise).to.be.fulfilled

    })

    it("Added correctly", async function () {
        let result = await graphql(`{mint{id name location uncertain uncertainArea}}`)
        expect(result.data).to.deep.equal({
            "data": {
                "mint": [
                    {
                        "id": "1",
                        "name": "Berlin",
                        "location": "{\"type\":\"Point\",\"coordinates\":[52.51968196,13.376689258]}",
                        "uncertain": false,
                        "uncertainArea": null
                    },
                    {
                        "id": "2",
                        "name": "Paris",
                        "location": "{\"type\":\"Point\",\"coordinates\":[48.863113497,2.337794633]}",
                        "uncertain": false,
                        "uncertainArea": null
                    },
                    {
                        "id": "3",
                        "name": "Rom",
                        "location": "{\"type\":\"Point\",\"coordinates\":[41.9053729,12.452903458]}",
                        "uncertain": false,
                        "uncertainArea": null
                    },
                    {
                        "id": "4",
                        "name": "Ǎtlantis",
                        "location": "{\"type\":\"Point\",\"coordinates\":[40.450505694,6.15439645]}",
                        "uncertain": true,
                        "uncertainArea": "{\"type\":\"Polygon\",\"coordinates\":[[[5.2734375,41.697525911],[3.779296875,40.838749138],[5.438232422,39.300299186],[6.877441406,39.283293869],[7.492675781,40.513799155],[6.701660156,41.557921578],[5.2734375,41.697525911]]]}"
                    },
                    {
                        "id": "5",
                        "name": "Test",
                        "location": "{\"type\":\"Point\",\"coordinates\":[8,49]}",
                        "uncertain": true,
                        "uncertainArea": "{\"type\":\"Polygon\",\"coordinates\":[[[7.020263672,50.979182427],[6.712646484,49.138596537],[9.008789062,48.922499264],[9.184570312,50.972264889],[7.020263672,50.979182427]]]}"
                    }
                ]
            }
        })
    })


    it("Unauthorized Update Rejected", async function () {
        let promise = graphql(`mutation{updateMint(data:
            {
                id: 5,
                name: "Renamed",
                location: "{'type':'Point','coordinates':[12,51]}", 
                uncertain: false,
                uncertainArea: "{'type':'Polygon','coordinates':[[[11,51],[11,51],[12,50],[12,50],[13,51],[12,51],[11,51]]]}"
            })}`)
        await expect(promise).to.be.rejectedWith(["401"])
    })

    it("Update", async function () {
        let promise = graphql(`mutation{updateMint(data:
            {
                id: 5,
                name: "Renamed",
                location: "{'type':'Point','coordinates':[12,51]}", 
                uncertain: false,
                uncertainArea: "{'type':'Polygon','coordinates':[[[11,51],[11,51],[12,50],[12,50],[13,51],[12,51],[11,51]]]}"
            })}`, {}, TestUser.users[0].token)
        await expect(promise).to.be.fulfilled
    })

    it("Updated correctly", async function () {

        let result = await graphql(`{mint{id name location uncertain uncertainArea}}`)
        expect(result.data).to.deep.equal(
            {
                "data": {
                    "mint": [
                        {
                            "id": "1",
                            "name": "Berlin",
                            "location": "{\"type\":\"Point\",\"coordinates\":[52.51968196,13.376689258]}",
                            "uncertain": false,
                            "uncertainArea": null
                        },
                        {
                            "id": "2",
                            "name": "Paris",
                            "location": "{\"type\":\"Point\",\"coordinates\":[48.863113497,2.337794633]}",
                            "uncertain": false,
                            "uncertainArea": null
                        },
                        {
                            "id": "3",
                            "name": "Rom",
                            "location": "{\"type\":\"Point\",\"coordinates\":[41.9053729,12.452903458]}",
                            "uncertain": false,
                            "uncertainArea": null
                        },
                        {
                            "id": "4",
                            "name": "Ǎtlantis",
                            "location": "{\"type\":\"Point\",\"coordinates\":[40.450505694,6.15439645]}",
                            "uncertain": true,
                            "uncertainArea": "{\"type\":\"Polygon\",\"coordinates\":[[[5.2734375,41.697525911],[3.779296875,40.838749138],[5.438232422,39.300299186],[6.877441406,39.283293869],[7.492675781,40.513799155],[6.701660156,41.557921578],[5.2734375,41.697525911]]]}"
                        },
                        {
                            "id": "5",
                            "name": "Renamed",
                            "location": "{\"type\":\"Point\",\"coordinates\":[12,51]}",
                            "uncertain": false,
                            "uncertainArea": "{\"type\":\"Polygon\",\"coordinates\":[[[11,51],[11,51],[12,50],[12,50],[13,51],[12,51],[11,51]]]}"
                        }
                    ]
                }
            }
        )
    })

    it("Unauthorized Delete Rejected", async function () {
        let promise = graphql(`mutation{deleteMint(id:5)}`)
        await expect(promise).to.be.rejectedWith(["404"])
    })

    it("Delete", async function () {
        let promise = graphql(`mutation{deleteMint(id:5)}`, {}, TestUser.users[0].token)
        await expect(promise).to.be.fulfilled
    })

    it("Table is the same as when started", async function () {
        let result = await graphql(`{mint${body}}`)
        expect(result.data).to.deep.equal(startData)
    })

})
