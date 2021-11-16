<template>
  <div class="content-wrapper">
    <header>
      <h1>Personen Überblick</h1>
      <Button
        v-if="$store.state.user != null"
        @click="toggleEditMode()"
        :class="{ active: editmode }"
        >Reihenfolge bearbeiten</Button
      >
    </header>
    <div class="person-explorer">
      <div class="list">
        <collapsible
          v-for="person of persons"
          :class="{ highlight: person.id == 8 }"
          :key="person.id"
          @open="getTypesByPerson(person)"
        >
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
            {{ person.name }} ({{ person.id }} | {{ person.dynasty.name }})
          </template>
          <div v-if="map[person.id]">
            <p
              v-if="
                !map[person.id] || Object.values(map[person.id]).length == 0
              "
              class="error"
            >
              Keine Typen mit dieser Person vorhanden
            </p>
            <div class="flex">
              <div
                v-for="yearObject of stringsToSortedArray(map[person.id])"
                :key="'mint-' + person.id + '-' + yearObject.value"
                class="initial-group inline-group"
              >
                <Button
                  class="initial-button year-grid"
                  :class="{ active: yearObject.active }"
                  @click="toggleActive(yearObject)"
                >
                  {{ yearObject.value }}
                </Button>
                <div v-if="yearObject.active" class="inline-child-group">
                  <div
                    class="inline-group"
                    v-for="mintObject of yearObject.children"
                    :key="
                      'mint-' +
                      person.id +
                      '-' +
                      yearObject.value +
                      '-' +
                      mintObject.value.name
                    "
                  >
                    <Button
                      :class="{ active: mintObject.active }"
                      @click="toggleActive(mintObject)"
                    >
                      {{ mintObject.value.name }}</Button
                    >
                    <div class="inline-child-group" v-if="mintObject.active">
                      <Button
                        :class="{
                          active: isPersonTypeActive(person, type),
                        }"
                        v-for="type of objectToSortedArray(mintObject.children)"
                        :key="
                          'mint-' +
                          person.id +
                          '-' +
                          yearObject.value +
                          '-' +
                          mintObject.value.name +
                          '-' +
                          type.id
                        "
                        @click="selectType(person, type.projectId)"
                      >
                        {{ type.projectId }}
                      </Button>

                      <!-- <Button
                        v-for="type of availableTypes(map[person.id])"
                        :key="'selectedType-' + type.id"
                        @click="selectType(person, type.projectId)"
                      >
                        {{ type.projectId }}
                      </Button> -->
                    </div>
                  </div>
                </div>
              </div>

              <!-- 
              
            <hr />
            <div>
              <hr />
              <div>
                <labeled-property
                  v-if="availableTypes(map[person.id]).length > 0"
                  label="Typen"
                >
                  <div class="flex">
                    <Button
                      v-for="type of availableTypes(map[person.id])"
                      :key="'selectedType-' + type.id"
                      @click="selectType(person, type.projectId)"
                    >
                      {{ type.projectId }}
                    </Button>
                  </div>
                </labeled-property>
              </div>
              <hr />-->

              <type-view v-if="person.activeType" :type="person.activeType" />
            </div>
            <!-- <Button
                v-for="mintObject of yearObject.children"
                :key="
                  'mint-' +
                  person.id +
                  '-' +
                  yearObject.value +
                  '-' +
                  mintObject.value.name
                "
              >
                {{ mintObject.value.name }}</Button
              > -->

            <!-- <div class="flex">
                  <Button
                    v-for="type of mintObject.children"
                    :key="
                      'mint-' +
                      person.id +
                      '-' +
                      yearObject.value +
                      '-' +
                      mintObject.value.name +
                      '-' +
                      type.id
                    "
                    >{{ type.projectId }}</Button
                  >
                 </div> -->

            <!-- <collapsible
                  v-for="type of mintObject.children"
                  :key="
                    'mint-' +
                    person.id +
                    '-' +
                    yearObject.value +
                    '-' +
                    mintObject.value.name +
                    '-' +
                    type.id
                  "
                >
                  <template slot="header">
                    {{ type.projectId }}
                  </template>

                  <div class="grid">
                    <labeled-property label="Material">
                      {{ type.material.name }}
                    </labeled-property>
                    <labeled-property label="Donativ">
                      {{ type.donativ ? 'Geschenkmünze' : 'Umlaufmünze' }}
                    </labeled-property>
                    <labeled-property label="Herstellungsart">
                      {{ type.procedure == 'pressed' ? 'Geprägt' : 'Gegossen' }}
                    </labeled-property>
                  </div>
                  <labeled-property label="Avers">
                    <div v-html="type.avers.fieldText" />
                    <b>Umschriften</b>
                    <ol>
                      <li
                        v-for="(inscript, idx) of getInscripts(type.avers)"
                        :key="idx"
                        v-html="inscript"
                      />
                    </ol>
                  </labeled-property>
                </collapsible> 
              </collapsible>
            </collapsible>-->
          </div>
        </collapsible>
      </div>
    </div>
  </div>
</template>

<script>
import Query from '../../../database/query';
import LabeledProperty from '../../display/LabeledProperty.vue';
import Button from '../../layout/buttons/Button.vue';
import Collapsible from '../../layout/Collapsible.vue';
import TypePage from '../TypePage.vue';
var deburr = require('lodash.deburr');

import ArrowUp from 'vue-material-design-icons/ArrowUpBold.vue';
import ArrowDown from 'vue-material-design-icons/ArrowDownBold.vue';
import TypeView from '../TypeView.vue';

export default {
  components: {
    ArrowUp,
    ArrowDown,
    Collapsible,
    LabeledProperty,
    TypePage,
    Button,
    TypeView,
  },
  data: function () {
    return {
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
          persons.forEach((person) => (person.activeType = null));
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
          mintAsOnCoin
          mint {id name}
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

            let years = {};
            types.forEach((type) => {
              if (type?.yearOfMint) {
                const yearId = type.yearOfMint;
                if (!years[yearId])
                  years[yearId] = {
                    value: type.yearOfMint,
                    active: false,
                    children: {},
                  };

                if (type?.mint?.id) {
                  const mintId = type?.mint?.id;
                  if (!years[yearId].children[mintId]) {
                    years[yearId].children[mintId] = {
                      value: type.mint,
                      active: false,
                      children: [],
                    };
                  }

                  years[yearId].children[mintId].children.push(type);
                } else console.error('Type has no year set.');
              }
            });

            this.$set(this.map, person.id, years);
          })
          .catch(console.error);
      }
    },
    stringsToSortedArray(obj) {
      let arr = Object.values(obj).sort((a, b) =>
        a.toString() > b.toString() ? -1 : 1
      );

      // console.log(arr.map((o) => deburr(o.value.name.toLowerCase())));
      return arr;
    },
    objectToSortedArray(obj) {
      let arr = Object.values(obj).sort((a, b) => {
        if (!a || !b) console.log(a, b);
        if (!a && !b) return 0;
        else if (!a) return -1;
        else return 1;
        deburr(a.value.name.toLowerCase()) < deburr(b.value.name.toLowerCase())
          ? -1
          : 1;
      });

      // console.log(arr.map((o) => deburr(o.value.name.toLowerCase())));
      return arr;
    },
    toggleActive(obj) {
      obj.active = !obj.active;
    },
    selectType(person, type) {
      person.activeType = this.types[person.id].find(
        (element) => element.projectId == type
      );
    },
    isPersonTypeActive(person, type) {
      return person.activeType && person.activeType.id == type.id;
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

      return selected.sort((a, b) =>
        deburr(a.projectId.toLowerCase()) < deburr(a.projectId.toLowerCase())
          ? -1
          : 1
      );
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
};
</script>

<style lang="scss" scoped>
.content-wrapper header {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

<style lang="scss">
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

.initial-group {
  > .button {
    padding: 12px;
  }
  .inline-child-group > .button {
    padding: 5px;
  }
  .inline-child-group > .inline-child-group > .button {
    padding: 2px;
  }
}

.button {
  border-radius: $border-radius;
}

.inline-group {
  display: flex;
  background-color: $primary-color;
  border-radius: $border-radius;
  border: 1px solid $gray;
  box-sizing: border-box;
  overflow: hidden;

  > .button {
    border: none;
  }

  .button.active {
    border-right: none;
  }

  > .inline-child-group {
    display: flex;
    background-color: $border-color;
    flex-wrap: wrap;
    box-sizing: border-box;
    border-left: none;

    > * {
      margin: 2px;
    }
  }
}
</style>