<template>
  <div class="catalogEntry">
    <header>
      <h1>{{ type.projectId }}</h1>
      <br>
      
      <!-- <Gift v-if="type.donativ" />
      <RecycleVariant v-else /> -->
    </header>
    <Gift />
    <p style="opacity:0.5;">Geschenkmünze</p>
    <div class="catalogFields">
      <div class="property-row">
        <div
          class="property"
          v-for="(val, idx) of ['mint', 'year', 'nominal', 'material']"
          v-bind:key="`property-${val}-${idx}`"
        >
          <catalog-property :label="val" :value="printTypeProperty(val)" />
        </div>
      </div>

      <div class="coin-sides">
        <div
          v-for="(side, sideIdx) in ['avers', 'reverse']"
          :key="`coin-sides-${sideIdx}`"
          class="avers"
        >
          <h2>{{ side[0].toUpperCase() + side.substr(1) }}</h2>

          <catalog-property
            class="property"
            v-for="(val, idx) of getFilledFields(side)"
            :key="`property-${val}-${idx}`"
            :html="type[side][val]"
            :label="$tc(`property.${camelToSnake(val)}`)"
          />
        </div>
      </div>

      <div v-if="persons.length > 0" class="person-wrapper">
        <h2>Persons</h2>
        <div
          class="person-container"
          v-for="(personObj, idx) of persons"
          v-bind:key="`person-${idx}`"
        >
          <catalog-item
            :label="$tc(`person.${personObj.name}`)"
            :value="personObj.value"
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
import CaseHelper from "../../../utils/CaseHelper";

import Gift from "vue-material-design-icons/Gift";
import RecycleVariant from "vue-material-design-icons/RecycleVariant";
import CatalogProperty from "../../catalog/CatalogProperty.vue";

export default {
  components: {
    CatalogItem,
    CoinSideField,
    LabeledField,
    Gift,
    RecycleVariant,
    CatalogProperty,
  },
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

      let map = { year: "yearOfMinting" };

      if (map[key]) {
        key = map[key];
      }

      if (typeof this.$data.type[key] == "object") {
        if (this.$data.type[key]) {
          if (this.$data.type[key][attr] !== null) {
            text = this.$data.type[key][attr];
          } else {
            text = this.$data.type[key];
          }
        }
      } else {
        text = this.$data.type[key];
      }
      return text;
    },
    camelToSnake(value) {
      return CaseHelper.camelToSnake(value);
    },
    getFilledFields(str) {
      let result = [];
      console.log(this.type[str]);
      if (this.type[str]) {
        result = Object.entries(this.type[str])
          .filter(([_, val]) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(val, "text/html");

            return doc.documentElement.innerText;
          })
          .map(([key, val]) => key);
      }

      console.log(result);
      return result;
    },
  },
  computed: {
    persons: function () {
      let personType = [
        "issuers",
        "overlords",
        "caliph",
        "heir",
        "warden",
        "cutter",
      ];

      let filteredPersons = [];

      personType.forEach((t) => {
        if (this.type[t]) {
          if (Array.isArray(this.type[t])) {
            if (this.type[t].length == 1) {
              console.log(this.type[t][0].person.name);
              filteredPersons.push({
                name: t,
                value: this.type[t][0].person.name,
              });
            }
            // else if (this.type[t].length > 1){
            //     filteredPersons.push({name: t, value: this.type[t].map(item => item.person.name)})
            // }
          } else {
            console.log(this.type[t]);
            filteredPersons.push({
              name: t,
              value: this.type[t].name,
            });
          }
        }
      });

      console.log(filteredPersons);

      return filteredPersons;
    },
  },
};
</script>

<style lang="scss" scoped>

h2 {
  margin-top: 2em;
}

header {
  font-weight: 700;
  margin-top: 5em;
  margin-bottom: 4em;
  display: flex;
  align-items: baseline;

  .material-design-icon {
    color: $primary-color;
    padding: 0 1em;
  }
}

.property-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: $padding;

  @include media_phone {
    grid-template-columns: 1fr 1fr;
  }
}

.person-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $padding;

  h2 {
  grid-column: span 2;
}

  @include media_phone {
    grid-template-columns: 1fr;

    h2 {
  grid-column: span 1;
}
  }

  > * {
    column-span: 2;
  }
}

.coin-sides {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $padding;

  > * {
    > * {
      margin-bottom: $padding * 2;
    }

    > h2 {
      margin-bottom: 1em;
    }
  }
  @include media_phone {
    grid-template-columns: 1fr;
  }
}

.catalogEntry {
  margin-bottom: 50vh;;
}

</style>
