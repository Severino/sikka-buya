<template>
  <div class="catalogEntry">
    <header>
      <router-link :to="{ name: 'EditType', params: { id: type.id } }"
        >Edit</router-link
      >
      <h1>{{ type.projectId }}</h1>
    </header>

    <div class="catalogFields">
      <div class="tags">
        <tag
          v-if="type.cursiveScript"
          :text="$tc('property.cursive_script')"
          popup="Auf dieser Münze sind kursive Schriftzeichen enthalten."
        >
          <Italic />
        </tag>

        <tag
          v-if="type.donativ"
          :text="$tc('property.donativ')"
          popup="Diese Münze ist eine Geschenkmünze. Im Gegensatz zu den üblichen Umlaufmünzen, wurden diese zu besonderen Anlässen verschenkt."
        >
          <Gift />
        </tag>
      </div>
      <div class="property-row">
        <div
          class="property"
          v-for="(val, idx) of ['mintAsOnCoin', 'year', 'nominal', 'material']"
          v-bind:key="`property-${val}-${idx}`"
        >
          <catalog-property :label="mapText(val)">
            {{ printTypeProperty(val) }}</catalog-property
          >
        </div>
      </div>

      <div class="coin-sides">
        <div
          v-for="(sideObj, sideIdx) in [
            { prop: 'avers', label: 'frontside' },
            { prop: 'reverse', label: 'backside' },
          ]"
          :key="`coin-sides-${sideIdx}`"
          class="avers"
        >
          <h2>{{ $t(`property.${sideObj.label}`) }}</h2>

          <catalog-property
            class="property"
            v-for="(val, idx) of getFilledFields(sideObj.prop)"
            :key="`property-${val}-${idx}`"
            :html="type[sideObj.prop][val]"
            :label="$tc(`property.${camelToSnake(val)}`)"
          />
        </div>
      </div>

      <div v-if="persons.length > 0" class="person-wrapper">
        <h2>{{ $tc("property.person", 2) }}</h2>
        <div
          class="person-container"
          v-for="(personObj, idx) of persons"
          v-bind:key="`person-${idx}`"
        >
          <catalog-property :label="mapText(personObj.name)">
            <template v-if="Array.isArray(personObj.value)">
              <ul>
                <li
                  v-for="(person, pIdx) in personObj.value"
                  :key="`person-${personObj.name}-${pIdx}`"
                >
                  {{ person }}
                </li>
              </ul>
            </template>
            <template v-else>{{ personObj.value }}</template>
          </catalog-property>
        </div>
      </div>

      <div class="property-row specials">
        <div class="specials">
          <h2>Sonstiges</h2>
          <catalog-property
            :label="$t('property.specialities_and_variants')"
            :html="type.specials"
          />

          <catalog-property
            v-if="type.coinMarks.length > 0"
            class="coin-marks"
            :label="$t('property.coin_mark')"
          >
            <div>
              <span
                v-for="(cm, idx) in type.coinMarks"
                :key="`coin_mark-${cm.id}`"
                >{{ cm.name
                }}<template v-if="idx < type.coinMarks.length - 1"
                  >,
                </template></span
              >
            </div>
          </catalog-property>

          <catalog-property
            v-if="htmlHasContent(type.literature)"
            :label="$t('property.literature_and_remarks')"
            :html="type.literature"
          >
          </catalog-property>

          <catalog-property :label="$tc('property.piece', 2)">
            <div v-for="piece of type.pieces" :key="piece" class="piece">
              <a :href="piece" target="_blank">
                <img :src="getLogoFromPath(piece)" alt="" width="32" />
                {{ piece }}</a
              >
            </div>
          </catalog-property>

          <catalog-property
            v-if="type.treadwellId"
            :label="$tc('property.treadwell_id')"
          >
            {{ type.treadwellId }}
          </catalog-property>
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

import Gift from "vue-material-design-icons/GiftOutline";
import Italic from "vue-material-design-icons/FormatItalic.vue";
import CatalogProperty from "../../catalog/CatalogProperty.vue";
import Row from "../../layout/Row.vue";
import Tag from "../../Tag.vue";
import Web from "../../../utils/Web";

export default {
  components: {
    CatalogItem,
    CoinSideField,
    LabeledField,
    Gift,
    Italic,
    CatalogProperty,
    Row,
    Tag,
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
    getLogoFromPath(path) {
      const site = Web.extractDomainName(path);
      console.log(path, site);
      return site
        ? `/img/logos/${site}.png`
        : "https://www.fint-ikmk.uni-tuebingen.de/ikmk/special/favicons/android-chrome-256x256.png";
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
      if (this.type[str]) {
        result = Object.entries(this.type[str])
          .filter(([_, val]) => {
            return this.htmlHasContent(val);
          })
          .map(([key, val]) => key);
      }

      return result;
    },
    htmlHasContent(val) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(val, "text/html");
      return doc.documentElement.innerText;
    },
    mapText: function (val) {
      let map = {
        year: "mint_year",
        issuers: "issuer",
        caliph: { property: "role", value: "caliph" },
      };

      if (map[val]) {
        if (typeof map[val] == "object")
          val = `${map[val].property}.${map[val].value}`;
        else val = `property.${map[val]}`;
      }
      return this.$tc(val);
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
              filteredPersons.push({
                name: t,
                value: this.type[t][0].person.name,
              });
            } else if (this.type[t].length > 1) {
              filteredPersons.push({
                name: t,
                value: this.type[t].map((item) => item.person.name),
              });
            }
          } else {
            filteredPersons.push({
              name: t,
              value: this.type[t].name,
            });
          }
        }
      });

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

  &.specials {
    margin-top: 2 * $padding;
    grid-template-columns: 1fr;
  }

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

.specials > * {
  margin-bottom: $padding * 2;
}

.catalogEntry {
  margin-bottom: 50vh;
}

.tags {
  display: flex;

  > * {
    margin-right: $padding;
    margin-bottom: $padding;
  }
}

.piece a {
  display: flex;
  align-items: center;
  margin-bottom: 1em;
}
</style>
