const chai = require('chai')
const expect = chai.expect
const { graphql } = require('../helpers/graphql')
const TestUser = require('../helpers/test-user')
const { KOHL, WESTERWELLE, MERKEL, DUERER, KARL, CHIRAC, CHARLES_DE_GAULLE, MACRON, HOLLANDE, SARKOZY, UDERZO, GOSCINNY, LOUIS, ARIELLE, SEBASTIAN, PLANKTON, FISCH, WAL, MICHELANGELO, BERNINI, POSEIDON, ELIZABETH_II, GAUCK } = require('../mockdata/persons')
const gql = String.raw

chai.config.truncateThreshold = 0
chai.config.showDiff = true

const body = gql` 
      id
projectId
treadwellId
mint {
  id
  name
  location
  uncertain
  uncertainArea
}
mintAsOnCoin
material {
  id
  name
}
nominal {
  id
  name
}
yearOfMint
donativ
procedure
issuers {
  id
  titles {
    id
    name
  }
  honorifics {
    id
    name
  }
  name
  shortName
  role {
    id
    name
  }
  dynasty {
    id
    name
  }
  color
}
overlords {
  id
  rank
  name
  titles {
    id
    name
  }
  honorifics {
    id
    name
  }
  dynasty {
    id
    name
  }
  shortName
  role {
    id
    name
  }
  color
}
otherPersons {
  id
  name
  shortName
  role {
    id
    name
  }
  dynasty{
      id,
      name
    }
  color
}
caliph {
  id
  name
  shortName
  role {
    id
    name
  }
  dynasty{id,name}
  color
}
avers {
  fieldText
  innerInscript
  intermediateInscript
  outerInscript
  misc
}
reverse {
  fieldText
  innerInscript
  intermediateInscript
  outerInscript
  misc
}
cursiveScript
coinMarks {
  id
  name
}
literature
pieces
specials
excludeFromTypeCatalogue
excludeFromMapApp
internalNotes
yearUncertain
mintUncertain
`

describe(`Type Queries`, function () {
  it(`List`, async function () {
    let result = await graphql(`{ coinType{
      types {
      ${body}
    }}}`)

    expect(result.data).to.deep.equal({
      "data": {
        "coinType": {
          "types": [
            FRENCH_TYPE,
            GERMAN_TYPE,
          ]
        }
      }
    })
  })

  it("Get", async function () {
    let result = await graphql(`
          {
              getCoinType(id:2) {
                  ${body}
              }
          }
  `)

    expect(result.data).to.deep.equal({
      "data": {
        "getCoinType": FRENCH_TYPE
      }
    })
  })

  it("Search with regular characters", async function () {
    let result = await graphql(`
          {searchType(text: "revo") {
              ${body}
            }}`)

    expect(result.data).to.deep.equal({
      "data": {
        "searchType": [
          FRENCH_TYPE
        ]
      }
    })
  })

  it("Search with exact characters", async function () {
    let result = await graphql(`
          {searchType(text: "R??v??") {
              ${body}
            }}`)

    expect(result.data).to.deep.equal({
      "data": {
        "searchType": [
          FRENCH_TYPE
        ]
      }
    })
  })

  it("Unauthorized Add Rejected", async function () {
    let promise = graphql(`mutation{addCoinType(data: ${ATLANTIS_INPUT})}`)
    await expect(promise).to.be.rejectedWith(["401"])
  })

  it("Add", async function () {
    let promise = graphql(`mutation{addCoinType(data: ${ATLANTIS_INPUT})}`, {}, TestUser.users[0].token)
    await expect(promise).to.be.fulfilled
  })

  it("Add was successfull", async function () {
    let result = await graphql(`{coinType{ types {${body}}}}`)

    expect(result.data.data).to.deep.equal({
      "coinType": {
        "types": [
          ATLANTIS_TYPE,
          FRENCH_TYPE,
          GERMAN_TYPE,
        ]
      }
    })
  })

  it("Unauthorized Update Rejected", async function () {
    let promise = graphql(`mutation{updateCoinType(id:3,data: ${ATLANTIS_INPUT_UPDATED} )}`)
    await expect(promise).to.be.rejectedWith(["401"])
  })

  it("Update", async function () {
    let promise = graphql(`mutation{updateCoinType(id:3,data:${ATLANTIS_INPUT_UPDATED})}`, {}, TestUser.users[0].token)
    await expect(promise).to.be.fulfilled
  })

  it("Updated Values are correct", async function () {
    let result = await graphql(`
          {
              getCoinType(id:3) {
                  ${body}
              }
          }`)

    expect(result.data.data.getCoinType).to.deep.equal(ATLANTIS_TYPE_UPDATED)
  })



})


const GERMAN_TYPE = {
  "id": "1",
  "projectId": "GER1989",
  "treadwellId": "GD89",
  "mint": {
    "id": "1",
    "name": "Berlin",
    "location": "{\"type\":\"Point\",\"coordinates\":[52.51968196,13.376689258]}",
    "uncertain": false,
    "uncertainArea": null
  },
  "mintAsOnCoin": "B??rlin",
  "material": {
    "id": "1",
    "name": "G??ld"
  },
  "nominal": {
    "id": "2",
    "name": "1 Mark"
  },
  "yearOfMint": "1989",
  "donativ": true,
  "procedure": "pressed",
  "issuers": [
    Object.assign({
      "titles": [
        {
          "id": "1",
          "name": "Prof."
        },
        {
          "id": "2",
          "name": "Dr."
        }
      ],
      "honorifics": [
        {
          "id": "1",
          "name": "der Schwarze Riese"
        },
        {
          "id": "2",
          "name": "die Birne"
        }
      ]
    }, KOHL)
  ],
  "overlords": [
    Object.assign({
      "rank": 1,
      "titles": [
        {
          "id": "2",
          "name": "Dr."
        }
      ],
      "honorifics": [
        {
          "id": "6",
          "name": "von Deutschland"
        }
      ],
    }, WESTERWELLE),
    Object.assign({
      "rank": 2,
      "titles": [
        {
          "id": "1",
          "name": "Prof."
        }
      ],
      "honorifics": [
        {
          "id": "1",
          "name": "der Schwarze Riese"
        },
        {
          "id": "6",
          "name": "von Deutschland"
        }
      ]
    }, MERKEL)
  ],
  "otherPersons": [
    DUERER
  ],
  "caliph": KARL,
  "avers": {
    "fieldText": "<div>Abbildung des deutschen Michels</div>",
    "innerInscript": "<div>Danach lasst uns alle streben</div>",
    "intermediateInscript": "<div>f??r das deutsche Vaterland!</div>",
    "outerInscript": "<div>Einigkeit und Recht und Freiheit</div>",
    "misc": "<div>Michel ohne M??tze</div>"
  },
  "reverse": {
    "fieldText": "<div>Abbildung eines Birnbaums</div>",
    "innerInscript": "<div>Und kam die goldene Herbsteszeit,</div>",
    "intermediateInscript": "<div>Ein Birnbaum in seinem Garten stand,</div>",
    "outerInscript": "<div>Herr von Ribbeck auf Ribbeck im Havelland,</div>",
    "misc": "<div>Birnbaum ohne Fr??chte</div>"
  },
  "cursiveScript": false,
  "coinMarks": [
    {
      "id": "1",
      "name": "??"
    },
    {
      "id": "2",
      "name": "??"
    },
    {
      "id": "4",
      "name": "??"
    }
  ],
  "literature": "<div style=\" text - align: center;\">Av: Nationalhymne</div><div style=\" text - align: center;\">Rev. Gedicht Fontane</div>",
  "pieces": ["https://www.berlin.de/", "https://de.wikipedia.org/wiki/Berlin"],
  "specials": "<div style=\" text - align: center;\">Keine</div>",
  "excludeFromTypeCatalogue": false,
  "excludeFromMapApp": false,
  "internalNotes": "<div style=\" text - align: center;\">Bitte nochmal neu!</div>",
  "yearUncertain": false,
  "mintUncertain": false
}

const FRENCH_TYPE = {
  "id": "2",
  "projectId": "FR??v??1789",
  "treadwellId": "FR1789",
  "mint": {
    "id": "2",
    "name": "Paris",
    "location": "{\"type\":\"Point\",\"coordinates\":[48.863113497,2.337794633]}",
    "uncertain": false,
    "uncertainArea": null
  },
  "mintAsOnCoin": "Paris",
  "material": {
    "id": "4",
    "name": "Silber"
  },
  "nominal": {
    "id": "3",
    "name": "1 Taler"
  },
  "yearOfMint": "1789",
  "donativ": true,
  "procedure": "cast",
  "issuers": [
    Object.assign(
      {
        "titles": [
          {
            "id": "1",
            "name": "Prof."
          },
          {
            "id": "2",
            "name": "Dr."
          },
          {
            "id": "3",
            "name": "Monsieur"
          }
        ],
        "honorifics": [
          {
            "id": "3",
            "name": "bulldozer"
          },
          {
            "id": "4",
            "name": "le Fran??ais"
          }
        ]
      }, CHIRAC),
    Object.assign({
      "titles": [
        {
          "id": "3",
          "name": "Monsieur"
        }
      ],
      "honorifics": [
        {
          "id": "3",
          "name": "bulldozer"
        },
        {
          "id": "5",
          "name": "le g??n??rale"
        }
      ]
    },
      CHARLES_DE_GAULLE)
  ],
  "overlords": [
    Object.assign({
      "rank": 1,
      "titles": [
        {
          "id": "1",
          "name": "Prof."
        },
        {
          "id": "3",
          "name": "Monsieur"
        }
      ],
      "honorifics": [
        {
          "id": "6",
          "name": "von Deutschland"
        }
      ],
    }, MACRON),
    Object.assign({
      "rank": 2,
      "titles": [
        {
          "id": "2",
          "name": "Dr."
        },
        {
          "id": "3",
          "name": "Monsieur"
        }
      ],
      "honorifics": [
        {
          "id": "4",
          "name": "le Fran??ais"
        },
        {
          "id": "3",
          "name": "bulldozer"
        }
      ],
    }, HOLLANDE),
    Object.assign({
      "rank": 3,
      "titles": [
        {
          "id": "3",
          "name": "Monsieur"
        }
      ],
      "honorifics": [
        {
          "id": "4",
          "name": "le Fran??ais"
        }
      ],
    }, SARKOZY)
  ],
  "otherPersons": [
    UDERZO,
    GOSCINNY
  ],
  "caliph": LOUIS,
  "avers": {
    "fieldText": "<div>Abb. Franz??sische Flagge</div>",
    "innerInscript": "<div>Contre nous de la tyrannie</div>",
    "intermediateInscript": "<div>Le jour de gloire est arriv??!</div>",
    "outerInscript": "<div>Allons enfants de la Patrie,</div>",
    "misc": "<div>Flagge wehend</div>"
  },
  "reverse": {
    "fieldText": "<div>Franz??sischer Hahn</div>",
    "innerInscript": "<div>Fraternit??</div>",
    "intermediateInscript": "<div>??galit??</div>",
    "outerInscript": "<div>Libert??</div>",
    "misc": "<div>Hahn tr??gt Hose</div>"
  },
  "cursiveScript": false,
  "coinMarks": [
    {
      "id": "3",
      "name": "??"
    },
    {
      "id": "4",
      "name": "??"
    }
  ],
  "literature": "<div style=\" text - align: center;\">Av: Nationalhymne</div><div style=\" text - align: center;\">Rev. revolution??rer Asusspruch</div>",
  "pieces": [
    "https://de.wikipedia.org/wiki/Paris"
  ],
  "specials": "<div style=\" text - align: center;\">Revolutionsm??nze mit K??nig</div>",
  "excludeFromTypeCatalogue": false,
  "excludeFromMapApp": false,
  "internalNotes": "<div style=\" text - align: center;\">Unfug</div>",
  "yearUncertain": true,
  "mintUncertain": true
}

const ATLANTIS_TYPE = {
  "id": "3",
  "projectId": "???TLxxx",
  "treadwellId": "???x",
  "mint": {
    "id": "3",
    "name": "??tlantis",
    "location": "{\"type\":\"Point\",\"coordinates\":[40.450505694,6.15439645]}",
    "uncertain": true,
    "uncertainArea": "{\"type\":\"Polygon\",\"coordinates\":[[[5.2734375,41.697525911],[3.779296875,40.838749138],[5.438232422,39.300299186],[6.877441406,39.283293869],[7.492675781,40.513799155],[6.701660156,41.557921578],[5.2734375,41.697525911]]]}"
  },
  "mintAsOnCoin": "???tl???ntis",
  "material": {
    "id": "3",
    "name": "Perlmutt"
  },
  "nominal": {
    "id": "1",
    "name": "?????? ???die"
  },
  "yearOfMint": "xxx",
  "donativ": true,
  "procedure": "cast",
  "issuers": [
    Object.assign({
      "titles": [
        {
          "id": "5",
          "name": "K??nigin"
        }
      ],
      "honorifics": [
        {
          "id": "7",
          "name": "Meerjungfrau"
        },
        {
          "id": "9",
          "name": "Wesen des Meeres"
        }
      ]
    }, ARIELLE),
    Object.assign({
      "titles": [
        {
          "id": "3",
          "name": "Monsieur"
        },
        {
          "id": "6",
          "name": "Tier"
        }
      ],
      "honorifics": [
        {
          "id": "9",
          "name": "Wesen des Meeres"
        }
      ]
    }, SEBASTIAN)

  ],
  "overlords": [
    Object.assign(
      {
        "rank": 1,
        "titles": [
          {
            "id": "3",
            "name": "Monsieur"
          },
          {
            "id": "6",
            "name": "Tier"
          }
        ],
        "honorifics": [
          {
            "id": "9",
            "name": "Wesen des Meeres"
          },
          {
            "id": "7",
            "name": "Meerjungfrau"
          }
        ]
      }, PLANKTON),
    Object.assign({
      "rank": 2,
      "titles": [
        {
          "id": "6",
          "name": "Tier"
        }
      ],
      "honorifics": [
        {
          "id": "8",
          "name": "der Gro??e"
        },
        {
          "id": "9",
          "name": "Wesen des Meeres"
        }
      ]
    }, FISCH),
    Object.assign({
      "rank": 3,
      "titles": [
        {
          "id": "6",
          "name": "Tier"
        }
      ],
      "honorifics": [
        {
          "id": "9",
          "name": "Wesen des Meeres"
        }
      ]
    }, WAL)
  ],
  "otherPersons": [
    MICHELANGELO,
    BERNINI
  ],
  "caliph": POSEIDON,
  "avers": {
    "fieldText": "<div>Ein Mann in Lokf??hrermontur vor einer Dampflokomotive.</div>",
    "innerInscript": "<div>Eine Insel mit zwei Bergen,</div>",
    "intermediateInscript": "<div>und dem tiefen weiten Meer,</div>",
    "outerInscript": "<div>mit viel Tunnels und Gleisen.</div>",
    "misc": "<div>Lokf??hrer scheint an F??den zu h??ngen.</div>"
  },
  "reverse": {
    "fieldText": "<div>Gro??es '???'</div>",
    "innerInscript": "<div>Die W??hrung</div>",
    "intermediateInscript": "<div>des Landes</div>",
    "outerInscript": "<div>unter dem Meer.</div>",
    "misc": "<div>Jahreszahl unter '???' nicht lesbar.</div>"
  },
  "cursiveScript": true,
  "coinMarks": [
    {
      "id": "1",
      "name": "??"
    },
    {
      "id": "2",
      "name": "??"
    },
    {
      "id": "3",
      "name": "??"
    }
  ],
  "literature": "<div>Keine Literatur vorhanden</div>",
  "pieces": [
    "https://de.wikipedia.org/wiki/Atlantis",
    "https://de.wikipedia.org/wiki/Poseidon"
  ],
  "specials": "<div>Einzige bekannte M??nze aus Atlantis</div>",
  "excludeFromTypeCatalogue": true,
  "excludeFromMapApp": true,
  "internalNotes": "Ziemlich sicher eine F??schung!",
  "yearUncertain": true,
  "mintUncertain": true
}




const ATLANTIS_INPUT = `{
      projectId: "???TLxxx",
      treadwellId: "???x",
      mint: 3,
      mintAsOnCoin: "???tl???ntis",
      material: 3,
      nominal: 1,
      yearOfMint: "xxx",
      donativ: true,
      procedure: "cast",
      issuers: [
        {
          person: 22,
          titles: [5],
          honorifics: [7, 9]
        }, {
          person: 23,
          titles: [3, 6],
          honorifics: [9]
        }
      ],
      overlords: [
        {
          person: 19,
          rank: 1,
          titles: [3, 6],
          honorifics: [9, 7],
        },
        {
          person: 20,
          rank: 2,
          titles: [6],
          honorifics: [8, 9],
        },
        {
          person: 21,
          rank: 3,
          titles: [6
          ],
          honorifics: [9
          ]
        }
      ],
      otherPersons: [
        24, 25
      ],
      caliph: 18,
      avers: {
        fieldText: "<div>Ein Mann in Lokf??hrermontur vor einer Dampflokomotive.</div>",
        innerInscript: "<div>Eine Insel mit zwei Bergen,</div>",
        intermediateInscript: "<div>und dem tiefen weiten Meer,</div>",
        outerInscript: "<div>mit viel Tunnels und Gleisen.</div>",
        misc: "<div>Lokf??hrer scheint an F??den zu h??ngen.</div>"
      },
      reverse: {
        fieldText: "<div>Gro??es '???'</div>",
        innerInscript: "<div>Die W??hrung</div>",
        intermediateInscript: "<div>des Landes</div>",
        outerInscript: "<div>unter dem Meer.</div>",
        misc: "<div>Jahreszahl unter '???' nicht lesbar.</div>"
      },
      cursiveScript: true,
      coinMarks: [1, 3, 2],
      literature: "<div>Keine Literatur vorhanden</div>",
      pieces: [
        "https://de.wikipedia.org/wiki/Atlantis",
        "https://de.wikipedia.org/wiki/Poseidon"
      ],
      specials: "<div>Einzige bekannte M??nze aus Atlantis</div>",
      excludeFromTypeCatalogue: true,
      excludeFromMapApp: true,
      internalNotes: "Ziemlich sicher eine F??schung!",
      yearUncertain: true,
      mintUncertain: true,
    }`

const ATLANTIS_INPUT_UPDATED = `{
      projectId: "???T",
      treadwellId: "???",
      mint: 1,
      mintAsOnCoin: "???tl",
      material: 4,
      nominal: 3,
      yearOfMint: "100",
      donativ: false,
      procedure: "pressed",
      issuers: [
        {
          person: 1,
          titles: [2, 4],
          honorifics: [1, 2]
        },
        {
          person: 9,
          titles: [1, 3],
          honorifics: [4, 5]
        }
      ],
      overlords: [
        {
          person: 2,
          rank: 1,
          titles: [1, 2, 5],
          honorifics: [6, 8],
        },
        {
          person: 6,
          rank: 2,
          titles: [2],
          honorifics: [4]
        }
      ],
      otherPersons: [
        3, 5
      ],
      caliph: 15,
      avers: {
        fieldText: "<div>Dampflokomotive</div>",
        innerInscript: "<div>Bergen</div>",
        intermediateInscript: "<div>Meer</div>",
        outerInscript: "<div>Gleisen</div>",
        misc: "<div>Lokf??hrer</div>"
      },
      reverse: {
        fieldText: "<div>???</div>",
        innerInscript: "<div>Die</div>",
        intermediateInscript: "<div>des</div>",
        outerInscript: "<div>unter</div>",
        misc: "<div>nicht lesbar.</div>"
      },
      cursiveScript: false,
      coinMarks: [4, 5],
      literature: "<div>vorhanden</div>",
      pieces: [
        "https://de.wikipedia.org/wiki/Pompeji"
      ],
      specials: "<div>Eis</div>",
      excludeFromTypeCatalogue: false,
      excludeFromMapApp: false,
      internalNotes: "F??schung!",
      yearUncertain: false,
      mintUncertain: false,
    }`


const ATLANTIS_TYPE_UPDATED = {
  "id": "3",
  "projectId": "???T",
  "treadwellId": "???",
  "mint": {
    "id": "1",
    "name": "Berlin",
    "location": "{\"type\":\"Point\",\"coordinates\":[52.51968196,13.376689258]}",
    "uncertain": false,
    "uncertainArea": null
  },
  "mintAsOnCoin": "???tl",
  "material": {
    "id": "4",
    "name": "Silber"
  },
  "nominal": {
    "id": "3",
    "name": "1 Taler"
  },
  "yearOfMint": "100",
  "donativ": false,
  "procedure": "pressed",
  "issuers": [
    Object.assign({
      "titles": [
        {
          "id": "2",
          "name": "Dr."
        },
        {
          "id": "4",
          "name": "K??nig"
        }
      ],
      "honorifics": [
        {
          "id": "1",
          "name": "der Schwarze Riese"
        },
        {
          "id": "2",
          "name": "die Birne"
        }
      ]
    }, KOHL),
    Object.assign({
      "titles": [
        {
          "id": "1",
          "name": "Prof."
        },
        {
          "id": "3",
          "name": "Monsieur"
        }
      ],
      "honorifics": [
        {
          "id": "4",
          "name": "le Fran??ais"
        },
        {
          "id": "5",
          "name": "le g??n??rale"
        }
      ],
    }, CHIRAC)
  ],
  "overlords": [
    Object.assign({
      "rank": 1,
      "titles": [
        {
          "id": "1",
          "name": "Prof."
        },
        {
          "id": "2",
          "name": "Dr."
        }, {
          "id": "5",
          "name": "K??nigin"
        }
      ],
      "honorifics": [{
        "id": "6",
        "name": "von Deutschland"
      }, {
        "id": "8",
        "name": "der Gro??e"
      }
      ]
    }, MERKEL),
    Object.assign({
      "rank": 2,
      "titles": [{
        "id": "2",
        "name": "Dr."
      }],
      "honorifics": [{
        "id": "4",
        "name": "le Fran??ais"
      }]
    }, MACRON)
  ],
  "otherPersons": [
    GAUCK, DUERER
  ],
  "caliph": ELIZABETH_II,
  "avers": {
    "fieldText": "<div>Dampflokomotive</div>",
    "innerInscript": "<div>Bergen</div>",
    "intermediateInscript": "<div>Meer</div>",
    "outerInscript": "<div>Gleisen</div>",
    "misc": "<div>Lokf??hrer</div>"
  },
  "reverse": {
    "fieldText": "<div>???</div>",
    "innerInscript": "<div>Die</div>",
    "intermediateInscript": "<div>des</div>",
    "outerInscript": "<div>unter</div>",
    "misc": "<div>nicht lesbar.</div>"
  },
  "cursiveScript": false,
  "coinMarks": [
    {
      "id": "4",
      "name": "??"
    }, {
      "id": "5",
      "name": "???"
    }
  ],
  "literature": "<div>vorhanden</div>",
  "pieces": [
    "https://de.wikipedia.org/wiki/Pompeji"
  ],
  "specials": "<div>Eis</div>",
  "excludeFromTypeCatalogue": false,
  "excludeFromMapApp": false,
  "internalNotes": "F??schung!",
  "yearUncertain": false,
  "mintUncertain": false
}