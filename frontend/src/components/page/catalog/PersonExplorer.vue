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
        :initOpen="hasSelection(person.id)"
        :editmode="editmode"
        :selection="personSelection(person.id)"
        @order-changed="orderChanged"
        @person-selected="personSelected"
        @person-unselected="personUnselected"
        @selection-changed="
          (selection) => updateSelection(person.id, selection)
        "
      />
    </div>
  </div>
</template>

<script>
import Query from '../../../database/query';
import Button from '../../layout/buttons/Button.vue';
import EditorToolbar from '../editor/EditorToolbar.vue';
import PersonExplorerPersonView from './PersonExplorerPersonView.vue';

const selectionLocalStorageName = 'sikka-buya-person-explorer-selection';

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
      selection: {},
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

          let selection = {};

          let item = localStorage.getItem(selectionLocalStorageName);
          if (item != null) {
            try {
              selection = JSON.parse(item);
            } catch (e) {
              console.error(e);
            }
          }

          console.log(item);

          this.selection = Object.assign({}, selection);

          this.personMap = {};
          persons.forEach((person) => {
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

    personSelected(person) {
      if (!this.selection[person]) this.selection[person] = {};
    },
    personUnselected(person) {
      if (this.selection[person]) delete this.selection[person];
    },
    updateSelection(personId, options) {
      if (options == null) delete this.selection[personId];
      else {
        this.selection[personId] = Object.assign(
          {},
          this.selection[personId],
          options
        );
      }
      console.log(JSON.stringify(this.selection));

      localStorage.setItem(
        selectionLocalStorageName,
        JSON.stringify(this.selection)
      );
    },
    hasSelection(personId) {
      return !!this.selection[personId];
    },
    personSelection(personId) {
      console.log(this.selection);
      return this.hasSelection(personId) ? this.selection[personId] : {};
    },
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
      > header {
        font-weight: bold;

        &::before {
          content: '';
          display: block;
          $size: 8px;
          margin-right: $padding;
          width: $size;
          height: $size;
          border-radius: math.div($size, 2);
          background-color: $primary-color;
        }
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
