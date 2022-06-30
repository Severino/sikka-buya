<template>
  <div class="person-explorer">
    <editor-toolbar>
      <Button
        v-if="$store.state.user != null"
        @click="toggleEditMode()"
        :class="{ active: editmode }"
        >Reihenfolge bearbeiten</Button
      >
    </editor-toolbar>
    <search-field v-model="searchText" />
    <div class="list">
      <collapsible
        v-for="person of filteredPersons"
        :class="{ highlight: person.id == 8 }"
        :key="person.id"
        @open="getTypesByPerson(person)"
      >
        <loading-spinner v-if="person.loading" />
        <template slot="header">
          <div class="edit-toolbar" v-if="editmode">
            <input
              type="number"
              name=""
              id=""
              style="width: 75px"
              @click.stop
              :value="orderMap[person.id]"
              @change="orderChanged($event, person.id)"
            />
          </div>
          {{ person.name }}
        </template>
        <div
          class="mint-area area"
          v-if="
            map[person.id] && objectToSortedArray(map[person.id]).length > 0
          "
        >
          <h6>Prägeort</h6>
          <p
            v-if="!map[person.id] || Object.values(map[person.id]).length == 0"
            class="error"
          >
            Keine Typen mit dieser Person vorhanden
          </p>
          <div class="flex">
            <Button
              v-for="mintObject of objectToSortedArray(map[person.id])"
              :key="'mint-' + person.id + '-' + mintObject.value.name"
              class="year-grid"
              :class="{ active: mintObject.active }"
              @click="toggleActive(mintObject)"
            >
              {{ mintObject.value.name }}
            </Button>
          </div>
          <div
            class="year-area area"
            v-if="getActiveObjects(map[person.id]).length > 0"
          >
            <h6>Prägejahr</h6>
            <div
              class="flex"
              v-for="mintObject of getActiveObjects(map[person.id])"
              :key="
                'mint-' + person.id + '-' + mintObject.value.name + '-active'
              "
            >
              <b>{{ mintObject.value.name }}:</b>
              <Button
                v-for="timeObject of mintObject.children"
                :key="
                  'mint-' +
                  person.id +
                  '-' +
                  mintObject.value.name +
                  '-' +
                  timeObject.value
                "
                :class="{ active: timeObject.active }"
                @click="toggleActive(timeObject)"
              >
                {{ timeObject.value }}</Button
              >
              <div class="grid"></div>
            </div>
            <div
              class="type-area area"
              v-if="availableTypes(map[person.id]).length > 0"
            >
              <h6>Typ</h6>

              <div class="flex">
                <MultiButton
                  v-for="type of availableTypes(map[person.id])"
                  :key="'selectedType-' + type.id"
                >
                  <Button
                    @click="selectType(person, type)"
                    :class="{
                      active: isActive(person, type),
                    }"
                  >
                    {{ type.projectId }}
                  </Button>
                  <Button
                    :class="{
                      active: isActive(person, type),
                    }"
                  >
                    <router-link
                      :to="{ name: 'CatalogEntry', params: { id: type.id } }"
                      target="_blank"
                      ><ExternalLinkIcon :size="16"
                    /></router-link>
                  </Button>
                </MultiButton>
              </div>
              <span v-if="!person.activeType" class="hint"
                >Wähle einen Typ</span
              >
            </div>
            <span class="hint" v-else>Wähle ein Prägejahr</span>

            <type-view v-if="person.activeType" :type="person.activeType" />
          </div>
          <span class="hint" v-else>Wähle einen Prägeort</span>
        </div>
      </collapsible>
      <Button
        class="filter-button"
        @click="resetFilters"
        :multiline="true"
        v-if="filteredPersonsInactive.length > 0"
      >
        <span>
          Es wurden {{ filteredPersonsInactive.length }} Personen von der Suche
          ausgeschlossen.
        </span>
        <span class="note">Klicken um alle Elemente anzuzeigen.</span>
      </Button>
    </div>
  </div>
</template>

<script>
import Query from '../../../database/query';
import LabeledProperty from '../../display/LabeledProperty.vue';
import Button from '../../layout/buttons/Button.vue';
import Collapsible from '../../layout/Collapsible.vue';
import TypePage from '../TypePage.vue';

import ArrowUp from 'vue-material-design-icons/ArrowUpBold.vue';
import ArrowDown from 'vue-material-design-icons/ArrowDownBold.vue';
import TypeView from '../TypeView.vue';
import Sort from '../../../utils/Sorter';
import LoadingSpinner from '../../misc/LoadingSpinner.vue';
import MultiButton from '../../layout/buttons/MultiButton.vue';

import ExternalLinkIcon from 'vue-material-design-icons/OpenInNew.vue';

import SearchField from '../../layout/SearchField.vue';
import SearchUtils from '../../../utils/SearchUtils';
import EditorToolbar from '../editor/EditorToolbar.vue';

export default {
  components: {
    ArrowUp,
    ArrowDown,
    Collapsible,
    LabeledProperty,
    TypePage,
    Button,
    TypeView,
    LoadingSpinner,
    MultiButton,
    ExternalLinkIcon,
    SearchField,
    EditorToolbar,
  },
  data: function () {
    return {
      searchText: '',
      persons: [],
      map: {},
      types: {},
      orderMap: {},
      editmode: false,
    };
  },
  mounted() {
    this.updateRulers();
  },
  methods: {
    resetFilters() {
      this.searchText = '';
    },
    updateRulers() {
      Query.raw(
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
        .then((result) => {
          const order = result.data.data.getPersonExplorerOrder;
          const orderMap = {};
          order.forEach((item) => {
            if (item.person != null) {
              orderMap[item.person] = item.order;
            }
          });
          this.orderMap = orderMap;

          const persons = result.data.data.person;
          persons.sort((a, b) => {
            let aPos = orderMap[a.id] ? orderMap[a.id] : 0;
            let bPos = orderMap[b.id] ? orderMap[b.id] : 0;
            if (aPos < bPos) return 1;
            else if (aPos > bPos) return -1;
            else return 0;
          });
          persons.forEach((person) => {
            person.activeType = null;
            person.loading = true;
          });
          this.persons = persons;
        })
        .catch(console.error);
    },
    orderChanged(event, personId) {
      Query.raw(
        `mutation {
          changePersonExplorerOrder (person: ${personId}, position: ${event.target.value})
        }`
      )
        .then(() => {
          this.updateRulers();
        })
        .catch(console.error);
    },
    toggleEditMode() {
      if (this.$store.state.user) {
        this.editmode = !this.editmode;
      }
    },
    getTypesByPerson: function (person) {
      if (!this.map[person.id]) {
        Query.raw(
          `{
        getTypesByRuler(id:${person.id})
        {
          id
          projectId
          treadwellId
          mint {id name}
          mintAsOnCoin
          yearOfMint
          material {name}
          nominal {name}
          donativ
          procedure
          issuers {shortName, name}
          overlords {shortName,name}
          caliph {shortName, name}
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
          coinMarks {
            id
            name
          }
          pieces
          literature
        }
        }`
        )
          .then((result) => {
            const types = result.data.data.getTypesByRuler;
            this.types[person.id] = types;

            let mints = {};
            types.forEach((type) => {
              if (type?.mint?.id) {
                const mintId = type.mint.id;
                if (!mints[mintId])
                  mints[mintId] = {
                    value: type.mint,
                    active: false,
                    children: {},
                  };

                if (type.yearOfMint) {
                  if (!mints[mintId].children[type.yearOfMint]) {
                    mints[mintId].children[type.yearOfMint] = {
                      value: type.yearOfMint,
                      active: false,
                      children: [],
                    };
                  }

                  mints[mintId].children[type.yearOfMint].children.push(type);
                } else console.error('Type has no year set.');
              }
            });

            this.$set(this.map, person.id, mints);
          })
          .catch(() => {
            person.error();
          })
          .finally(() => {
            person.loading = false;
          });
      }
    },
    objectToSortedArray(obj) {
      let arr = Object.values(obj).sort((a, b) => {
        return Sort.stringPropAlphabetically('name')(a.value, b.value);
      });
      return arr;
    },
    toggleActive(obj) {
      obj.active = !obj.active;
    },
    selectType(person, type) {
      if (this.isActive(person, type)) {
        person.activeType = null;
      } else {
        person.activeType = this.types[person.id].find(
          (element) => element.projectId == type.projectId
        );
      }
    },
    isActive(person, type) {
      return person?.activeType?.projectId == type.projectId;
    },
    availableTypes(mintListObject) {
      const selected = [];
      for (let mintObj of Object.values(mintListObject)) {
        if (mintObj.active) {
          for (let yearObj of Object.values(mintObj.children)) {
            if (yearObj.active) {
              selected.push(...yearObj.children);
            }
          }
        }
      }

      return selected.sort(Sort.stringPropAlphabetically('projectId'));
    },
    getActiveObjects(arr) {
      return Object.values(arr).filter((obj) => obj.active);
    },
    getInscripts(coinside) {
      function hasContent(htmlString) {
        try {
          const parser = new DOMParser();
          let document = parser.parseFromString(htmlString, 'text/html');
          return document.body.textContent == '' ? false : true;
        } catch (e) {
          console.error(e);
        }

        return false;
      }

      let inscripts = [];
      ['innerInscript', 'intermediateInscript', 'outerInscript'].forEach(
        (prop) => {
          if (coinside[prop] && hasContent(coinside[prop])) {
            inscripts.push(coinside[prop]);
          }
        }
      );

      return inscripts;
    },
  },
  computed: {
    filteredPersons() {
      console.log(
        SearchUtils.filter(this.searchText, this.persons, 'name').map(
          (p) => p.name
        )
      );
      return SearchUtils.filter(this.searchText, this.persons, 'name');
    },
    filteredPersonsInactive() {
      const filteredIds = this.filteredPersons.map((p) => p.id);
      console.log(filteredIds);
      return this.persons.filter((p) => {
        return !filteredIds.includes(p.id);
      });
    },
  },
};
</script>

<style lang="scss">
.person-explorer {
  .search {
    margin-bottom: 2 * $padding;
  }
  .collapsible {
    // border: 1px solid $gray;
    // border-radius: $border-radius;
    margin-bottom: 3px;

    border-radius: $border-radius;
    background-color: $white;
  }

  .collapsible-header {
    color: $black;
    // font-weight: bold;
    padding: $padding;
  }

  .collapsible-content {
    min-height: 50px;
    padding: $padding;
  }

  .button {
    padding: $padding/2 $padding;
  }

  .spinner {
    margin: auto;
    color: $primary-color;
  }

  .type-view {
    background-color: whitesmoke;
    padding: $padding;
    border-radius: $border-radius;
    padding-top: 3 * $padding;

    h1 {
      padding-bottom: 1rem;
    }
  }
}
</style>

<style lang="scss" scoped>
.mint-area {
  > h6 {
    margin-block-start: 0;
  }
}

.hint {
  display: block;
  margin: $padding auto;
  margin-top: 3 * $padding;
  text-align: center;
}

.edit-toolbar {
  // position: absolute;
  top: 0;
  left: 0;
  // transform: translateX(-100%);
  margin-right: 20px;
  display: flex;
}

.flex {
  display: flex;
  flex-wrap: wrap;
  margin: -3px;
  align-items: center;
  > * {
    margin: 3px;
  }
}
</style>

<style lang="scss" scoped>
.year-grid > .list-filter-container-content {
  display: flex;
  // grid-template-columns: repeat(3, 1fr);
  // gap: 10px;
  // align-items: start;

  // .list-filter-container-content {
  //   background-color: red;
  //   align-self: start;
  // }
}

.grid {
  display: flex;
  gap: 10px;

  grid-template-columns: repeat(3, 1fr);
}

.active {
  color: $white;
  background-color: $primary-color;

  &:hover {
    color: $white;
    background-color: darken($primary-color, 10%);
  }
}

.filter-button {
  width: 100%;
  min-height: 40px;
  justify-content: center;
}
</style>