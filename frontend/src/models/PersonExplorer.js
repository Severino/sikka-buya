import Query from "../database/query"

export class PersonExplorerQuery {
    async get() {
        const result = await Query.raw(
            `{
          person (dynasty: 1){
            id
              name
              role {name}
              dynasty{name}
          }
            getPersonExplorerOrder{
              order
              person
            }
          }`
        )

    }


}

export class PersonExplorer {
    constructor(items = []) {
        this.items = items
    }
}

export class PersonExplorerItem {
    constructor({
        years = [],
        mintsAsOverlord = [],
        mintsAsIssuer = [],
        typesAsOverlord = [],
        typesAsIssuer = [],
        type = null
    } = {}) {
        this.years = years
        this.mintsAsOverlord = mintsAsOverlord
        this.mintsAsIssuer = mintsAsIssuer
        this.typesAsOverlord = typesAsOverlord
        this.typesAsIssuer = typesAsIssuer
        this.type = type
    }
}