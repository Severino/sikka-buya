<template>
  <div class="catalog-entry">
    <type-view :type="type" />
  </div>
</template>

<script>
import Query from '../../../database/query';
import TypeView from '../TypeView.vue';

export default {
  components: {
    TypeView,
  },
  name: 'CatalogEntry',
  data: function () {
    return {
      type: {
        id: null,
        projectId: '',
        treadwellId: '',
        mint: { id: null, name: '', uncertain: false },
        mintAsOnCoin: '',
        material: { id: null, name: '' },
        nominal: { id: null, name: '' },
        yearOfMint: '',
        donativ: false,
        procedure: 'pressed',
        issuers: [],
        overlords: [],
        otherPersons: [],
        caliph: { id: null, name: '', role: null },
        avers: {
          fieldText: '',
          innerInscript: '',
          intermediateInscript: '',
          outerInscript: '',
          misc: '',
        },
        reverse: {
          fieldText: '',
          innerInscript: '',
          intermediateInscript: '',
          outerInscript: '',
          misc: '',
        },
        cursiveScript: false,
        pieces: [],
        specials: '',
      },
    };
  },
  computed: {
    id: function () {
      return this.$route.params.id;
    },
  },
  created: function () {
    Query.raw(
      `

        {
            getCoinType(id:${this.id}){
                id
                projectId
                treadwellId
                mint {
                  id,
                  name
                }
                mintAsOnCoin
                mintUncertain
                material {
                  id,
                  name
                }
                nominal {
                  id,
                  name
                }
                yearOfMint
                yearUncertain
                donativ
                procedure
                issuers {
                    id,
                    name,
                    role {
                      id, name

                  }
                  titles {
                    id,
                    name
                  }
                  honorifics{
                    id,
                    name}
                }
                overlords {
                  id
                  rank
                    name,
                    role {
                      id, name
                    }
                  titles {
                    id,
                    name
                  }
                  honorifics{
                    id,
                    name}
                }
                otherPersons {
                  id
                  name
                  role {
                    id, name
                  }
                }
                caliph {
                  id
                  name
                  role {
                    id, name
                  }
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
                literature
                pieces
                specials
                excludeFromTypeCatalogue
                excludeFromMapApp
                internalNotes
        }
      }
      `
    )
      .then((result) => {
        Object.assign(this.$data.type, result.data.data.getCoinType);
      })
      .catch(console.error);
  },
};
</script>
