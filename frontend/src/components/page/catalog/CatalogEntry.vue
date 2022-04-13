<template>
  <div class="catalog-entry">
    <type-view v-if="!loading" :type="type" />
    <div class="center-frame" v-else>
      <loading-spinner :size="100" />
    </div>
  </div>
</template>

<script>
import Query from '../../../database/query';
import LoadingSpinner from '../../misc/LoadingSpinner.vue';
import TypeView from '../TypeView.vue';

export default {
  components: {
    TypeView,
    LoadingSpinner,
  },
  name: 'CatalogEntry',
  data: function () {
    return {
      loading: true,
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
        this.loading = false;
      })
      .catch(console.error);
  },
};
</script>

<style lang="scss" scoped>
.center-frame {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
