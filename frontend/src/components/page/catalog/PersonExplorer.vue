<template>
  <div class="content-wrapper">
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

            <collapsible
              v-for="mintObject of Object.values(map[person.id])"
              :key="'mint-' + person.id + '-' + mintObject.value.name"
              class="year-grid"
            >
              <template slot="header">{{ mintObject.value.name }}</template>
              <collapsible
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
                <template slot="header">{{ timeObject.value }}</template>
                <collapsible
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
                      {{ type.donativ }}
                    </labeled-property>
                    <labeled-property label="Herstellungsart">
                      {{ type.procedure }}
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
            </collapsible>
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
export default {
  components: { Collapsible, LabeledProperty },
  data: function () {
    return {
      persons: [],
      map: {},
    };
  },
  mounted() {
    Query.raw(
      `{
          person (role:null){
            id
              name
          } 
          }`
    )
      .then((result) => {
        console.log(result);
        this.persons = result.data.data.person;
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
                  mints[mintId] = { value: type.mint, children: {} };

                if (type.yearOfMint) {
                  if (!mints[mintId].children[type.yearOfMint]) {
                    mints[mintId].children[type.yearOfMint] = {
                      value: type.yearOfMint,
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
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  align-items: start;

  // .list-filter-container-content {
  //   background-color: red;
  //   align-self: start;
  // }
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
</style>