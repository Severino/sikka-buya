const { expect } = require('chai')
const { graphql } = require('../helpers/graphql')
const TestUser = require('../helpers/test-user')
const fs = require("fs")
const path = require('path')

const body = ` 
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
}
otherPersons {
id
name
shortName
role {
id
name
}
dynasty{id,name}
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
    let result = await graphql(`{coinType{${body}}}`)

    expect(result.data).to.deep.equal({
      "data": {
        "coinType": [
          GERMAN_TYPE,
          FRENCH_TYPE
        ]
      }
    })
  })

  it("Get", async function () {
    let result = await graphql(`
          {
              getCoinType(id:1) {
                  ${body}
              }
          }
  `)

    expect(result.data).to.deep.equal({
      "data": {
        "getCoinType": GERMAN_TYPE
      }
    })
  })

  it("Search with regular characters", async function () {
    let result = await graphql(`
          {searchType(text: "revo") {
              ${body}
            }}`)


    fs.writeFileSync(path.join(__dirname, "test.json"), JSON.stringify(result.data))

    // console.log(JSON.stringify(result.data))

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
          {searchType(text: "Révô") {
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
    console.log(TestUser.users[0].token)
    let promise = graphql(`mutation{addCoinType(data: ${ATLANTIS_INPUT})}`, {}, TestUser.users[0].token)

    console.log(promise)
    await expect(promise).to.be.fulfilled
  })

  it("Add was successfull", async function () {
    let result = await graphql(`{coinType{${body}}}`)

    expect(result.data).to.deep.equal({
      "data": {
        "coinType": [
          GERMAN_TYPE,
          FRENCH_TYPE,
          ATLANTIS_TYPE
        ]
      }
    })
  })


  // it("Unauthorized Update Rejected", async function () {
  //     let promise = graphql(`mutation{updateType(data:{id:5, name: "changed"})}`)
  //     await expect(promise).to.be.rejectedWith(["401"])
  // })

  // it("Update", async function () {
  //     let promise = graphql(`mutation{updateType(data:{id:5, name: "changed"})}`, {}, TestUser.users[0].token)
  //     await expect(promise).to.be.fulfilled
  // })

  // it("Unauthorized Delete Rejected", async function () {
  //     let promise = graphql(`mutation{deleteType(id:4)}`)
  //     await expect(promise).to.be.rejectedWith(["404"])
  // })

  // it("Delete", async function () {
  //     let promise = graphql(`mutation{deleteType(id:4)}`, {}, TestUser.users[0].token)
  //     await expect(promise).to.be.fulfilled
  // })



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
  "mintAsOnCoin": "Börlin",
  "material": {
    "id": "1",
    "name": "Gøld"
  },
  "nominal": {
    "id": "1",
    "name": "1 Mark"
  },
  "yearOfMint": "1989",
  "donativ": true,
  "procedure": "pressed",
  "issuers": [
    {
      "id": "1",
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
      ],
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
    }
  ],
  "overlords": [
    {
      "id": "17",
      "rank": 1,
      "name": "Guido Westerwelle",
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
      "dynasty": {
        "id": "1",
        "name": "Deutsche"
      },
      "shortName": "Westerwelle",
      "role": {
        "id": null,
        "name": null
      }
    },
    {
      "id": "2",
      "rank": 2,
      "name": "Angela Merkel",
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
      ],
      "dynasty": {
        "id": "1",
        "name": "Deutsche"
      },
      "shortName": "Merkel",
      "role": {
        "id": null,
        "name": null
      }
    }
  ],
  "otherPersons": [
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
    }
  ],
  "caliph": {
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
  "literature": "<div style=\" text - align: center;\">Av: Nationalhymne</div><div style=\" text - align: center;\">Rev. Gedicht Fontane</div>",
  "pieces": ["https://www.berlin.de/", "https://de.wikipedia.org/wiki/Berlin"],
  "specials": "<div style=\" text - align: center;\">Keine</div>",
  "excludeFromTypeCatalogue": false,
  "excludeFromMapApp": false,
  "internalNotes": "<div style=\" text - align: center;\">Bitte nochmal neu!</div>",
  "yearUncertain": false,
  "mintUncertain": null
}

const FRENCH_TYPE = {
  "id": "2",
  "projectId": "FRévô1789",
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
    "id": "3",
    "name": "Silber"
  },
  "nominal": {
    "id": "2",
    "name": "1 Taler"
  },
  "yearOfMint": "1789",
  "donativ": true,
  "procedure": "cast",
  "issuers": [
    {
      "id": "9",
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
      ],
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
      "id": "10",
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
      ],
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
    }
  ],
  "overlords": [
    {
      "id": "6",
      "rank": 1,
      "name": "Emmanuel Macron",
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
      "dynasty": {
        "id": "2",
        "name": "Franzosen"
      },
      "shortName": "Macron",
      "role": {
        "id": null,
        "name": null
      }
    },
    {
      "id": "7",
      "rank": 2,
      "name": "François Hollande",
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
      "dynasty": {
        "id": "2",
        "name": "Franzosen"
      },
      "shortName": "Hollande",
      "role": {
        "id": null,
        "name": null
      }
    },
    {
      "id": "8",
      "rank": 3,
      "name": "Nicolas Sarkozy",
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
      "dynasty": {
        "id": "2",
        "name": "Franzosen"
      },
      "shortName": "Sarkozy",
      "role": {
        "id": null,
        "name": null
      }
    }
  ],
  "otherPersons": [
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
    }
  ],
  "caliph": {
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
  "literature": "<div style=\" text - align: center;\">Av: Nationalhymne</div><div style=\" text - align: center;\">Rev. revolutionärer Asusspruch</div>",
  "pieces": [
    "https://de.wikipedia.org/wiki/Paris"
  ],
  "specials": "<div style=\" text - align: center;\">Revolutionsmünze mit König</div>",
  "excludeFromTypeCatalogue": false,
  "excludeFromMapApp": false,
  "internalNotes": "<div style=\" text - align: center;\">Unfug</div>",
  "yearUncertain": true,
  "mintUncertain": null
}

const ATLANTIS_TYPE = {
  "id": "3",
  "projectId": "ẲTLxxx",
  "treadwellId": "Ẳx",
  "mint": {
    "id": "4", "name": "Ǎtlantis",
    "uncertain": true,
    "uncertain_area": `ST_AsGeoJson(
  '{ "type": "Polygon",
  "coordinates": [ [ [ 5.2734375, 41.69752591075902 ],
  [ 3.779296875, 40.83874913796459 ],
  [ 5.438232421875, 39.30029918615029 ],
  [ 6.87744140625, 39.2832938689385 ],
  [ 7.492675781249999, 40.51379915504413 ],
  [ 6.701660156249999, 41.5579215778042 ],
  [ 5.2734375, 41.69752591075902 ] ] ] }'`
  },
  "mintAsOnCoin": "Ẳtlảntis",
  "material": { "id": "3", "name": "Perlmutt" },
  "nominal": { "id": "1", "name": "⅟₂ ₳die" },
  "yearOfMint": "xxx",
  "donativ": "true",
  "procedure": "cast",
  "issuers": [
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
    }

  ],
  "overlords": [
    {
      "id": "21",
      "name": "Wal",
      "shortName": null,
      "role": {
        "id": null,
        "name": null
      },
      "dynasty": {
        "id": "5",
        "name": "Atlant"
      }
    }, {
      "id": "19",
      "name": "Plankton",
      "shortName": null,
      "role": {
        "id": null,
        "name": null
      },
      "dynasty": {
        "id": "5",
        "name": "Atlant"
      }
    }, {
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
  ],
  "other_persons": [],
  "caliph": {
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
}

const ATLANTIS_INPUT = `{
  projectId: "ẲTLxxx",
  treadwellId: "Ẳx",
  mint: 4,
  mintAsOnCoin: "Ẳtlảntis",
  material: 3,
  nominal: 1,
  yearOfMint: "xxx",
  donativ: true,
  procedure: "cast",
  issuers: [
    {
      person: 22,
      titles: [6],
      honorifics: [7, 9]
    }, {
      person: 23,
      titles: [3, 6],
      honorifics: [9]
    }
  ],
  overlords: [
    {
      person: 21,
      rank: 3,
      titles: [],
      honorifics: []
    }, {
      person: 19,
      rank: 1,
      titles: [],
      honorifics: []
    }, {
      person: 20,
      rank: 2,
      titles: [],
      honorifics: []
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