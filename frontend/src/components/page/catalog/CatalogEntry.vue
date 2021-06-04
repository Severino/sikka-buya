<template>
  <div class="catalogEntry">
    <header>
      <h1>{{ type.projectId }}</h1>
    </header>
    <div class="catalogFields">
      <div class="property-row">
        <div
          class="property"
          v-for="(val, idx) of ['mint', 'year', 'nominal', 'material']"
          v-bind:key="`property-${val}-${idx}`"
        >
          <labeled-field :label="val" :value="printTypeProperty(val)" />
        </div>
      </div>

      <div class="coin-sides">
        <div class="avers">
          <h2>Avers</h2>

          <div
            class="property"
            v-for="(val, idx) of [
              'fieldText',
              'innerInscript',
              'intermediateInscript',
              'outerInscript',
              'misc',
            ]"
            v-bind:key="`property-${val}-${idx}`"
          >
            <div class="property-label">
              {{ $tc(`property.${val}`) }}
            </div>
            <div class="property-value" v-html="type.avers[val]"></div>
          </div>
        </div>
        <div class="revers">
          <h2>Revers</h2>
          <div
            class="property"
            v-for="(val, idx) of [
              'fieldText',
              'innerInscript',
              'intermediateInscript',
              'outerInscript',
              'misc',
            ]"
            v-bind:key="`property-${val}-${idx}`"
          >
            <div class="property-label">
              {{ $tc(`property.${val}`) }}
            </div>
            <div class="property-value" v-html="type.reverse[val]"></div>
          </div>
        </div>
      </div>

      <div v-if="persons.length > 0" class="person-wrapper">
      <h2>Persons</h2>
        <div
          class="person-container"
          v-for="(val, idx) of persons"
          v-bind:key="`person-${val}-${idx}`"
        >
          <catalog-item
            :label="$tc(`person.${val}`)"
            :value="$data[val]"
          ></catalog-item>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Query from "../../../database/query";
import CatalogItem from "../../catalog/CatalogItem.vue";
import LabeledField from "../../display/LabeledField.vue";
import CoinSideField from "../../forms/coins/CoinSideField.vue";
export default {
  components: { CatalogItem, CoinSideField, LabeledField },
  name: "CatalogEntry",
  data: function () {
    return {
      type: {
        id: null,
        projectId: "",
        treadwellId: "",
        mint: { id: null, name: "" },
        mintAsOnCoin: "",
        material: { id: null, name: "" },
        nominal: { id: null, name: "" },
        yearOfMinting: "",
        donativ: false,
        procedure: "pressed",
        issuers: [],
        overlords: [],
        otherPersons: [],
        caliph: { id: null, name: "", role: null },
        avers: {
          fieldText: "",
          innerInscript: "",
          intermediateInscript: "",
          outerInscript: "",
          misc: "",
        },
        reverse: {
          fieldText: "",
          innerInscript: "",
          intermediateInscript: "",
          outerInscript: "",
          misc: "",
        },
        cursiveScript: false,
        coinMarks: [],
        pieces: [],
        specials: "",
      },
    };
  },
  created: function () {
    Query.raw(
      `
        {
            getCoinType(id:${this.$route.params.id}){
                id
                projectId
                treadwellId
                mint {
                  id,
                  name
                }
                mintAsOnCoin
                material {
                  id,
                  name
                }
                nominal {
                  id,
                  name
                }
                yearOfMinting
                donativ
                procedure
                issuers {
                  id
                  person {
                    id,
                    name,
                    role {
                      id, name
                    }
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
                  person {
                    id,
                    name,
                    role {
                      id, name
                    }
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
        }
      }
      `
    )
      .then((result) => {
        console.log("THEM", this.$data.type);
        Object.assign(this.$data.type, result.data.data.getCoinType);
      })
      .catch(console.error);
  },
  methods: {
    get(property) {
      return this[property];
    },
    printTypeProperty(key, attr = "name") {
      let text = "Unbekannt";
      if (this.$data.type[key]) {

        console.log(this.$data.type[key][attr], attr)
        if (this.$data.type[key][attr] !== null) {
          text = this.$data.type[key][attr];
        } else {
          text = this.$data.type[key];
        }
      }
  console.log(text)
      return text;
    },
  },
  computed: {
    persons: function () {
      let persons = [
        "issuers",
        "overlords",
        "caliph",
        "heir",
        "warden",
        "cutter",
      ];

      console.log(persons.filter((name) => this[name]));
      return persons.filter((name) => this[name]);
    },
  },
};
</script>



<style lang="scss" scoped>
header {
  font-weight: 700;
  margin-top: 5em;
  margin-bottom: 4em;
}

.property-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: $padding;
  
  margin: 2em 0;

  @include media_phone {
    grid-template-columns: 1fr 1fr
  }
}

.person-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $padding;

  > * {
    column-span: 2;
  }
}

.coin-sides {
  display: grid;
  grid-template-columns: 1fr 1fr;
    gap: $padding;

  >* {
    
    
    >*{
    margin-bottom: $padding*2;
  }

  
    > h2 {
      margin-bottom: 1em ;
    }
}
    @include media_phone {
      grid-template-columns: 1fr;
    }
}
</style>
