
import Query from "../database/query"
import Type from "../utils/Type"



export class PersonExplorer {
  constructor(items = []) {
    this.items = items
  }

  static async getItems() {

    const result = await Query.raw(
      `{
          person (dynasty: 1){
            id
              name
              dynasty{name}
          }
            getPersonExplorerOrder{
              order
              person
            }
          }`
    )

    let orderMap = result.data.data.getPersonExplorerOrder.reduce((prev, item) => {
      prev[item.person] = item.order
      return prev
    }, {})


    let rulers = result.data.data.person.sort((personA, personB) => {
      let personAOrder = orderMap[personA.id] || 0
      let personBOrder = orderMap[personB.id] || 0

      return personBOrder - personAOrder
    }, {}).map(person => {
      return new PersonExplorerTree(person, orderMap[person.id])
    })



    return rulers
  }
}

export class PersonExplorerTree {


  constructor(person, order) {
    this.person = person
    this.order = order
    this.issuerTree = {}
    this.overlordTree = {}

    this.mints = {}
    this.types = {}
  }

  get years() {
    return Array.from(new Set([...Object.keys(this.overlordTree), ...Object.keys(this.issuerTree)])).sort()
  }


  set(year, mintId = -1, typeId = -1, issuer = false) {
    let tree = (issuer) ? this.issuerTree : this.overlordTree

    let yearNode = tree[year]
    if (!yearNode) {
      yearNode = {}
      tree[year] = yearNode
    }

    let mintNode = yearNode[mintId]
    if (!mintNode) {
      mintNode = {}
      yearNode[mintId] = mintNode
    }

    mintNode[typeId] = true
  }


  async fetch(selection) {

    const { pageInfo, types } = await Type.filteredQuery({
      pagination: {
        page: 0,
        count: 100000,
      },
      filters: {
        ruler: [this.person.id],
        excludeFromTypeCatalogue: false,
      },
      typeBody: `id projectId treadwellId mint {name id location} mintAsOnCoin material {name id} nominal {name id}
  yearOfMint donativ procedure issuers {id name shortName} overlords {id name shortName} otherPersons {id role {name id} name shortName}
  caliph {id name shortName}
  avers {fieldText innerInscript intermediateInscript outerInscript misc}
  reverse {fieldText innerInscript intermediateInscript outerInscript misc} 
  cursiveScript coinMarks {name id}
  literature pieces  specials yearUncertain mintUncertain excludeFromMapApp
  `,
    });

    this.types = {}

    types.forEach(type => {

      this.types[type.id] = type

      type.issuers.forEach(i => {
        if (i.id === this.person.id) {
          this.set(type.yearOfMint, type.mint.id, type.id, true)
        }
      })
      type.overlords.forEach(i => {
        if (i.id === this.person.id)
          this.set(type.yearOfMint, type.mint.id, type.id)
      })
    })

    return this
  }

}