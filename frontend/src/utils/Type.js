import Query from '../database/query';

export default class Type {



    static queryFiltered() {
        Query(`
            query ($filters: TypeFilter){
            coinType(filters: $filters){
              types {
                id, projectId,
                material {id, name}
              }
            }
          }`)
    }

}