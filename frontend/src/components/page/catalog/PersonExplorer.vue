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
    <div class="list">
      <PersonExplorerPersonView
        v-for="person of persons"
        :key="person.id"
        :person="person"
        :orderMap="orderMap"
        :editmode="editmode"
        @order-changed="orderChanged"
      />
    </div>
  </div>
</template>

<script>
import Query from '../../../database/query';
import Button from '../../layout/buttons/Button.vue';
import EditorToolbar from '../editor/EditorToolbar.vue';
import PersonExplorerPersonView from './PersonExplorerPersonView.vue';

export default {
  components: {
    Query,
    EditorToolbar,
    Button,
    PersonExplorerPersonView,
  },
  data: function () {
    return {
      searchText: '',
      personMap: {},
      map: {},
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

          this.personMap = {};
          persons.forEach((person) => {
            person.activeYears = {};
            person.activeOverlords = {};
            person.activeIssuers = {};
            person.activeType = null;
            person.loading = true;
            person.orderNum = orderMap[person.id] || -1000;
            this.personMap[person.id] = person;
          });
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

    // toggleActive(obj) {
    //   obj.active = !obj.active;
    // },

    // availableTypes(mintListObject) {
    //   const selected = [];
    //   for (let mintObj of Object.values(mintListObject)) {
    //     if (mintObj.active) {
    //       for (let yearObj of Object.values(mintObj.children)) {
    //         if (yearObj.active) {
    //           selected.push(...yearObj.children);
    //         }
    //       }
    //     }
    //   }

    //   return selected.sort(Sort.stringPropAlphabetically('projectId'));
    // },
    // getActiveObjects(arr) {
    //   const active = Object.values(arr).filter((obj) => obj.active);
    //   return active;
    // },
    // getInscripts(coinside) {
    //   function hasContent(htmlString) {
    //     try {
    //       const parser = new DOMParser();
    //       let document = parser.parseFromString(htmlString, 'text/html');
    //       return document.body.textContent == '' ? false : true;
    //     } catch (e) {
    //       console.error(e);
    //     }

    //     return false;
    //   }

    //   let inscripts = [];
    //   ['innerInscript', 'intermediateInscript', 'outerInscript'].forEach(
    //     (prop) => {
    //       if (coinside[prop] && hasContent(coinside[prop])) {
    //         inscripts.push(coinside[prop]);
    //       }
    //     }
    //   );

    //   return inscripts;
    // },

    // mintOverlordChanged(person) {
    //   if (person.activeOverlords[person.id]) {
    //     delete person.activeOverlords[person.id];
    //   } else {
    //     person.activeOverlords[person.id] = true;
    //   }
    // },
    // mintIssuerChanged(person) {
    //   if (person.activeIssuers[person.id]) {
    //     delete person.activeIssuers[person.id];
    //   } else {
    //     person.activeIssuers[person.id] = true;
    //   }
    // },
  },
  computed: {
    persons() {
      return Object.values(this.personMap).sort((a, b) => {
        let aPos = this.orderMap[a.id] ? this.orderMap[a.id] : 0;
        let bPos = this.orderMap[b.id] ? this.orderMap[b.id] : 0;
        if (aPos < bPos) return 1;
        else if (aPos > bPos) return -1;
        else return 0;
      });
    },
  },
};
</script>

<style lang="scss">
.person-explorer {
  h6 {
    margin-top: 0;
    margin-bottom: 1rem;
  }

  .hint {
    display: block;
    margin: $padding auto;
    margin-top: 3 * $padding;
    text-align: center;
  }

  .collapsible {
    margin-bottom: 3px;

    border-radius: $border-radius;
    background-color: $white;

    &.open {
      header {
        font-weight: bold;
      }
    }
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

    a {
      color: $white;
    }

    &:hover {
      color: $white;
      background-color: darken($primary-color, 10%);
    }
  }
}
</style>
