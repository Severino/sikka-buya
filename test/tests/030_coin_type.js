const chai = require('chai')

const { getDiff } = require("recursive-diff")
const expect = chai.expect
const { graphql } = require('../helpers/graphql')
const { KOHL, WESTERWELLE, MERKEL, DUERER, KARL, CHIRAC, CHARLES_DE_GAULLE, MACRON, HOLLANDE, SARKOZY, UDERZO, GOSCINNY, LOUIS, ARIELLE, SEBASTIAN, PLANKTON, FISCH, WAL, MICHELANGELO, BERNINI, POSEIDON, ELIZABETH_II, GAUCK } = require('../mockdata/persons')
const { User1 } = require('../mockdata/users')
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
nominal {
  id
  name
}
material {
  id
  name
}
purity
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
coinVerses {
  id
  name
}
small
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
  // it(`List`, async function () {
  //   let result = await graphql(`{ coinType{
  //     types {
  //     ${body}
  //   }}}`)
  //   expect(result.data).to.deep.equal({
  //     "data": {
  //       "coinType": {
  //         "types": [
  //           FRENCH_TYPE,
  //           GERMAN_TYPE,
  //         ]
  //       }
  //     }
  //   })
  // })

  // it("Get", async function () {
  //   let result = await graphql(`
  //         {
  //             getCoinType(id:2) {
  //                 ${body}
  //             }
  //         }
  // `)

  //   expect(result.data).to.deep.equal({
  //     "data": {
  //       "getCoinType": FRENCH_TYPE
  //     }
  //   })
  // })

  // it("Search with regular characters", async function () {
  //   let result = await graphql(`
  //         {searchType(text: "revo") {
  //             ${body}
  //           }}`)

  //   expect(result.data).to.deep.equal({
  //     "data": {
  //       "searchType": [
  //         FRENCH_TYPE
  //       ]
  //     }
  //   })
  // })

  // it("Search with exact characters", async function () {
  //   let result = await graphql(`
  //         {searchType(text: "Révô") {
  //             ${body}
  //           }}`)

  //   expect(result.data).to.deep.equal({
  //     "data": {
  //       "searchType": [
  //         FRENCH_TYPE
  //       ]
  //     }
  //   })
  // })

  it("Unauthorized Add Rejected", async function () {
    let promise = graphql(`mutation{addCoinType(data: ${ATLANTIS_INPUT})}`)
    await expect(promise).to.be.rejectedWith(["401"])
  })

  it("Add", async function () {
    let promise = graphql(`mutation{addCoinType(data: ${ATLANTIS_INPUT})}`, {}, User1.token)
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
    let promise = graphql(`mutation{updateCoinType(id:3,data:${ATLANTIS_INPUT_UPDATED})}`, {}, User1.token)
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

  it("Unauthorized Delete Rejected", async function () {
    let promise = graphql(`mutation {
      deleteCoinType(id: 3)
    }`)
    await expect(promise).to.be.rejectedWith(["401"])
  })

  it("Delete Type", async function () {
    let promise = graphql(`mutation {
      deleteCoinType(id: 3)
    }`, {}, User1.token)

    expect(promise).to.be.fulfilled
  })

  it("Was deleted succesfully", async function () {
    const result = graphql(` { 
      getCoinType(id: 3){
        projectId
      }
    }`)

    expect(result).to.be.rejected
  })
})


const GERMAN_TYPE = {
  "id": "1",
  "projectId": "GER1989",
  "treadwellId": "GD89",
  "mint": {
    "id": "1",
    "name": "Berlin",
    "location": { "type": "Point", "coordinates": [52.51968196, 13.376689258] },
    "uncertain": false,
    "uncertainArea": null
  },
  "mintAsOnCoin": "Börlin",
  "material": {
    "id": "1",
    "name": "Gøld"
  },
  "purity": 700,
  "nominal": {
    "id": "2",
    "name": "1 Mark"
  },
  "small": true,
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
    "intermediateInscript": "<div>für das deutsche Vaterland!</div>",
    "outerInscript": "<div>Einigkeit und Recht und Freiheit</div>",
    "misc": "<div>Michel ohne Mütze</div>"
  },
  "reverse": {
    "fieldText": "<div>Abbildung eines Birnbaums</div>",
    "innerInscript": "<div>Und kam die goldene Herbsteszeit,</div>",
    "intermediateInscript": "<div>Ein Birnbaum in seinem Garten stand,</div>",
    "outerInscript": "<div>Herr von Ribbeck auf Ribbeck im Havelland,</div>",
    "misc": "<div>Birnbaum ohne Früchte</div>"
  },
  "cursiveScript": false,
  "coinMarks": [
    {
      "id": "1",
      "name": "Ä"
    },
    {
      "id": "2",
      "name": "Ü"
    },
    {
      "id": "4",
      "name": "π"
    }
  ],
  "coinVerses": [
    {
      "id": "2",
      "name": "محمد رسول الله"
    },
    {
      "id": "3",
      "name": "Koran 30:4‒5"
    },
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
  "projectId": "FRévô1789",
  "treadwellId": "FR1789",
  "mint": {
    "id": "2",
    "name": "Paris",
    "location": { "type": "Point", "coordinates": [48.863113497, 2.337794633] },
    "uncertain": false,
    "uncertainArea": null
  },
  "mintAsOnCoin": "Paris",
  "material": {
    "id": "4",
    "name": "Silber"
  },
  "purity": null,
  "nominal": {
    "id": "3",
    "name": "1 Taler"
  },
  "small": false,
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
            "name": "le Français"
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
          "name": "le générale"
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
          "name": "le Français"
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
          "name": "le Français"
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
    "fieldText": "<div>Abb. Französische Flagge</div>",
    "innerInscript": "<div>Contre nous de la tyrannie</div>",
    "intermediateInscript": "<div>Le jour de gloire est arrivé!</div>",
    "outerInscript": "<div>Allons enfants de la Patrie,</div>",
    "misc": "<div>Flagge wehend</div>"
  },
  "reverse": {
    "fieldText": "<div>Französischer Hahn</div>",
    "innerInscript": "<div>Fraternité</div>",
    "intermediateInscript": "<div>Égalité</div>",
    "outerInscript": "<div>Liberté</div>",
    "misc": "<div>Hahn trägt Hose</div>"
  },
  "cursiveScript": false,
  "coinMarks": [
    {
      "id": "3",
      "name": "ê"
    },
    {
      "id": "4",
      "name": "π"
    }
  ],
  "coinVerses": [
    {
      "id": "1",
      "name": "Koran 9:33"
    }
  ],
  "literature": "<div style=\" text - align: center;\">Av: Nationalhymne</div><div style=\" text - align: center;\">Rev. revolutionärer Asusspruch</div>",
  "pieces": [
    "https://de.wikipedia.org/wiki/Paris"
  ],
  "specials": "<div style=\" text - align: center;\">Revolutionsmünze mit König</div>",
  "excludeFromTypeCatalogue": false,
  "excludeFromMapApp": false,
  "internalNotes": "<div style=\" text - align: center;\">Unfug</div>",
  "yearUncertain": true,
  "mintUncertain": true
}

const ATLANTIS_TYPE = {
  "id": "3",
  "projectId": "ẲTLxxx",
  "treadwellId": "Ẳx",
  "mint": {
    "id": "3",
    "name": "Ǎtlantis",
    "location": { "type": "Point", "coordinates": [40.450505694, 6.15439645] },
    "uncertain": true,
    "uncertainArea": { "type": "Polygon", "coordinates": [[[5.2734375, 41.697525911], [3.779296875, 40.838749138], [5.438232422, 39.300299186], [6.877441406, 39.283293869], [7.492675781, 40.513799155], [6.701660156, 41.557921578], [5.2734375, 41.697525911]]] }
  },
  "mintAsOnCoin": "Ẳtlảntis",
  "material": {
    "id": "3",
    "name": "Perlmutt"
  },
  "purity": 900,
  "nominal": {
    "id": "1",
    "name": "⅟₂ ₳die"
  },
  "small": true,
  "yearOfMint": "xxx",
  "donativ": true,
  "procedure": "cast",
  "issuers": [
    Object.assign({
      "titles": [
        {
          "id": "5",
          "name": "Königin"
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
          "name": "der Große"
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
    "fieldText": "<div>Ein Mann in Lokführermontur vor einer Dampflokomotive.</div>",
    "innerInscript": "<div>Eine Insel mit zwei Bergen,</div>",
    "intermediateInscript": "<div>und dem tiefen weiten Meer,</div>",
    "outerInscript": "<div>mit viel Tunnels und Gleisen.</div>",
    "misc": "<div>Lokführer scheint an Fäden zu hängen.</div>"
  },
  "reverse": {
    "fieldText": "<div>Großes '₳'</div>",
    "innerInscript": "<div>Die Währung</div>",
    "intermediateInscript": "<div>des Landes</div>",
    "outerInscript": "<div>unter dem Meer.</div>",
    "misc": "<div>Jahreszahl unter '₳' nicht lesbar.</div>"
  },
  "cursiveScript": true,
  "coinMarks": [
    {
      "id": "1",
      "name": "Ä"
    },
    {
      "id": "2",
      "name": "Ü"
    },
    {
      "id": "3",
      "name": "ê"
    }
  ], "coinVerses": [
    {
      "id": "1",
      "name": "Koran 9:33"
    },
    {
      "id": "3",
      "name": "Koran 30:4‒5"
    }
  ],
  "literature": "<div>Keine Literatur vorhanden</div>",
  "pieces": [
    "https://de.wikipedia.org/wiki/Atlantis",
    "https://de.wikipedia.org/wiki/Poseidon"
  ],
  "specials": "<div>Einzige bekannte Münze aus Atlantis</div>",
  "excludeFromTypeCatalogue": true,
  "excludeFromMapApp": true,
  "internalNotes": "Ziemlich sicher eine Fäschung!",
  "yearUncertain": true,
  "mintUncertain": true
}




const ATLANTIS_INPUT = `{
      projectId: "ẲTLxxx",
      treadwellId: "Ẳx",
      mint: 3,
      mintAsOnCoin: "Ẳtlảntis",
      material: 3,
      purity: 900,
      nominal: 1,
      small: true,
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
        fieldText: "<div>Ein Mann in Lokführermontur vor einer Dampflokomotive.</div>",
        innerInscript: "<div>Eine Insel mit zwei Bergen,</div>",
        intermediateInscript: "<div>und dem tiefen weiten Meer,</div>",
        outerInscript: "<div>mit viel Tunnels und Gleisen.</div>",
        misc: "<div>Lokführer scheint an Fäden zu hängen.</div>"
      },
      reverse: {
        fieldText: "<div>Großes '₳'</div>",
        innerInscript: "<div>Die Währung</div>",
        intermediateInscript: "<div>des Landes</div>",
        outerInscript: "<div>unter dem Meer.</div>",
        misc: "<div>Jahreszahl unter '₳' nicht lesbar.</div>"
      },
      cursiveScript: true,
      coinMarks: [1, 3, 2],
      coinVerses: [1,3],
      literature: "<div>Keine Literatur vorhanden</div>",
      pieces: [
        "https://de.wikipedia.org/wiki/Atlantis",
        "https://de.wikipedia.org/wiki/Poseidon"
      ],
      specials: "<div>Einzige bekannte Münze aus Atlantis</div>",
      excludeFromTypeCatalogue: true,
      excludeFromMapApp: true,
      internalNotes: "Ziemlich sicher eine Fäschung!",
      yearUncertain: true,
      mintUncertain: true,
    }`

const ATLANTIS_INPUT_UPDATED = `{
      projectId: "ẲT",
      treadwellId: "Ẳ",
      mint: 1,
      mintAsOnCoin: "Ẳtl",
      material: 4,
      purity: 500,
      nominal: 3,
      small: false,
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
        misc: "<div>Lokführer</div>"
      },
      reverse: {
        fieldText: "<div>₳</div>",
        innerInscript: "<div>Die</div>",
        intermediateInscript: "<div>des</div>",
        outerInscript: "<div>unter</div>",
        misc: "<div>nicht lesbar.</div>"
      },
      cursiveScript: false,
      coinMarks: [4, 5],
      coinVerses:[2],
      literature: "<div>vorhanden</div>",
      pieces: [
        "https://de.wikipedia.org/wiki/Pompeji"
      ],
      specials: "<div>Eis</div>",
      excludeFromTypeCatalogue: false,
      excludeFromMapApp: false,
      internalNotes: "Fäschung!",
      yearUncertain: false,
      mintUncertain: false,
    }`


const ATLANTIS_TYPE_UPDATED = {
  "id": "3",
  "projectId": "ẲT",
  "treadwellId": "Ẳ",
  "mint": {
    "id": "1",
    "name": "Berlin",
    "location": { "type": "Point", "coordinates": [52.51968196, 13.376689258] },
    "uncertain": false,
    "uncertainArea": null
  },
  "mintAsOnCoin": "Ẳtl",
  "material": {
    "id": "4",
    "name": "Silber"
  },
  "purity": 500,
  "nominal": {
    "id": "3",
    "name": "1 Taler"
  },
  "small": false,
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
          "name": "König"
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
          "name": "le Français"
        },
        {
          "id": "5",
          "name": "le générale"
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
          "name": "Königin"
        }
      ],
      "honorifics": [{
        "id": "6",
        "name": "von Deutschland"
      }, {
        "id": "8",
        "name": "der Große"
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
        "name": "le Français"
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
    "misc": "<div>Lokführer</div>"
  },
  "reverse": {
    "fieldText": "<div>₳</div>",
    "innerInscript": "<div>Die</div>",
    "intermediateInscript": "<div>des</div>",
    "outerInscript": "<div>unter</div>",
    "misc": "<div>nicht lesbar.</div>"
  },
  "cursiveScript": false,
  "coinMarks": [
    {
      "id": "4",
      "name": "π"
    }, {
      "id": "5",
      "name": "Ẳ"
    }
  ],
  "coinVerses": [
    {
      "id": "2",
      "name": "محمد رسول الله"
    }
  ],
  "literature": "<div>vorhanden</div>",
  "pieces": [
    "https://de.wikipedia.org/wiki/Pompeji"
  ],
  "specials": "<div>Eis</div>",
  "excludeFromTypeCatalogue": false,
  "excludeFromMapApp": false,
  "internalNotes": "Fäschung!",
  "yearUncertain": false,
  "mintUncertain": false
}