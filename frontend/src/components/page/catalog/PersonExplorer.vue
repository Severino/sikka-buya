<template>
  <div class="content-wrapper">
    <h1>Overlord List</h1>
    <div class="person-explorer">
      <div class="list">
        <collapsible
          v-for="person of persons"
          :class="{ highlight: person.id == 8 }"
          :key="person.id"
          @open="getTypesByPerson(person)"
        >
          <template slot="header">{{ person.name }}</template>
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
              <Button
                v-for="mintObject of objectToSortedArray(map[person.id])"
                :key="'mint-' + person.id + '-' + mintObject.value.name"
                class="year-grid"
                :class="{ active: mintObject.active }"
                @click="toggleActive(mintObject)"
              >
                {{ mintObject.value.name }}</Button
              >
            </div>
            <hr />
            <div>
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
              <hr />
              <div>
                <labeled-property
                  v-if="activeTypes(map[person.id]).length > 0"
                  label="Typen"
                >
                  <div class="flex">
                    <Button
                      v-for="type of activeTypes(map[person.id])"
                      :key="'selectedType-' + type.id"
                      @click="selectType(person, type.projectId)"
                    >
                      {{ type.projectId }}
                    </Button>
                  </div>
                </labeled-property>
              </div>
              <hr />
            </div>
            <!-- <Button
                v-for="timeObject of mintObject.children"
                :key="
                  'mint-' +
                  person.id +
                  '-' +
                  mintObject.value.name +
                  '-' +
                  timeObject.value
                "
              >
                {{ timeObject.value }}</Button
              > -->

            <!-- <div class="flex">
                  <Button
                    v-for="type of timeObject.children"
                    :key="
                      'mint-' +
                      person.id +
                      '-' +
                      mintObject.value.name +
                      '-' +
                      timeObject.value +
                      '-' +
                      type.id
                    "
                    >{{ type.projectId }}</Button
                  >
                 </div> -->

            <!-- <collapsible
                  v-for="type of timeObject.children"
                  :key="
                    'mint-' +
                    person.id +
                    '-' +
                    mintObject.value.name +
                    '-' +
                    timeObject.value +
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
import Collapsible from '../../layout/Collapsible.vue';
import TypePage from '../TypePage.vue';
var deburr = require('lodash.deburr');

export default {
  components: { Collapsible, LabeledProperty, TypePage },
  data: function () {
    return {
      persons: [],
      map: {},
    };
  },
  mounted() {
    Query.raw(
      `{
          person (dynasty: 1){
            id
              name
          } 
          }`
    )
      .then((result) => {
        console.log(result);
        this.persons = result.data.data.person;
        this.persons.forEach((person) => (person.activeType = null));
      })
      .catch(console.error);
  },
  methods: {
    getTypesByPerson: function (person) {
      if (!this.map[person.id]) {
        Query.raw(
          `{
        getTypesByOverlord(id:${person.id})
        {
          id
          projectId
          mint {id name}
          yearOfMint
          material {name}
          nominal {name}
          donativ
          procedure
          issuers {shortName}
          overlords {shortName}
          caliph {shortName}
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
        }
        }`
        )
          .then((result) => {
            const types = result.data.data.getTypesByOverlord;
            this.types = types;

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
          .catch(console.error);
      }
    },
    objectToSortedArray(obj) {
      let arr = Object.values(obj).sort((a, b) =>
        deburr(a.value.name.toLowerCase()) < deburr(b.value.name.toLowerCase())
          ? -1
          : 1
      );

      // console.log(arr.map((o) => deburr(o.value.name.toLowerCase())));
      return arr;
    },
    toggleActive(obj) {
      obj.active = !obj.active;
    },
    selectType(person, type) {
      person.activeType = type;
    },
    activeTypes(mintListObject) {
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

<style lang="scss">
.highlight header {
  color: white;
  background-color: $primary-color !important;
}

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

.flex {
  display: flex;
  flex-wrap: wrap;
  margin: -3px;
  align-items: center;
  > * {
    margin: 3px;
  }
}

.active {
  color: $white;
  background-color: $primary-color;

  &:hover {
    color: $white;
    background-color: darken($primary-color, 10%);
  }
}
</style>