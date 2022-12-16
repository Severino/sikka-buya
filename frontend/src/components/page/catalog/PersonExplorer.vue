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
        v-for="pes of personExplorerSelection"
        :key="pes.person.id"
        :personExplorerSelection="pes"
        :initOpen="hasSelection(pes.person.id)"
        :editmode="editmode"
        :selection="personSelection(pes.person.id)"
        @order-changed="orderChanged"
        :activeType="getActiveType(pes.person)"
        @type-selected="(type) => selectType(pes.person, type)"
        @person-selected="personSelected"
        @person-unselected="personUnselected"
        @selection-changed="
          (selection) => updateSelection(pes.person.id, selection)
        "
      />
    </div>
  </div>
</template>

<script>
import Query from '../../../database/query';
import { PersonExplorer } from '../../../models/PersonExplorer';
import Button from '../../layout/buttons/Button.vue';
import EditorToolbar from '../editor/EditorToolbar.vue';
import PersonExplorerPersonView from './PersonExplorerPersonView.vue';

const selectionLocalStorageName = 'sikka-buya-person-explorer-selection';
const selectedTypesLocalStorageName =
  'sikka-buya-person-explorer-selected-types';

export default {
  components: {
    Query,
    EditorToolbar,
    Button,
    PersonExplorerPersonView,
  },
  data: function () {
    return {
      personExplorerSelection: [],
      searchText: '',
      personMap: {},
      map: {},
      editmode: false,
      selection: {},
      selectedTypes: {},
    };
  },
  mounted() {
    this.updateRulers();
  },
  methods: {
    async updateRulers() {
      this.personExplorerSelection = await PersonExplorer.getItems();

      // Query.raw(
      //   `{
      //     person (dynasty: 1){
      //       id
      //         name
      //         role {name}
      //         dynasty{name}
      //     }
      //       getPersonExplorerOrder{
      //         order
      //         person
      //       }
      //     }`
      // )
      //   .then((result) => {
      //     const order = result.data.data.getPersonExplorerOrder;
      //     const orderMap = {};
      //     order.forEach((item) => {
      //       if (item.person != null) {
      //         orderMap[item.person] = item.order;
      //       }
      //     });
      //     this.orderMap = orderMap;
      //     const persons = result.data.data.person;
      //     let selection = {};
      //     let item = localStorage.getItem(selectionLocalStorageName);
      //     if (item != null) {
      //       try {
      //         selection = JSON.parse(item);
      //       } catch (e) {
      //         console.error(e);
      //       }
      //     }
      //     this.selection = Object.assign({}, selection);
      //     let selectedTypesStorageString = localStorage.getItem(
      //       selectedTypesLocalStorageName
      //     );
      //     let selectedTypes = {};
      //     if (selectedTypesStorageString != null) {
      //       try {
      //         selectedTypes = JSON.parse(selectedTypesStorageString);
      //       } catch (e) {
      //         console.error(e);
      //       }
      //     }
      //     this.selectedTypes = Object.assign({}, selectedTypes);
      //     this.personMap = {};
      //     persons.forEach((person) => {
      //       person.loading = true;
      //       person.orderNum = orderMap[person.id] || -1000;
      //       this.personMap[person.id] = person;
      //     });
      //   })
      //   .catch(console.error);
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

    personSelected(personExplorerItem) {
      // if (!this.selection[person]) this.selection[person] = {};
    },
    personUnselected(personExplorerItem) {
      // if (this.selection[person]) delete this.selection[person];
      // if (this.selectType[person]) this.selectType[person] = null;
    },
    updateSelection(personId, options) {
      if (options == null) {
        this.$set(this.selection, personId, {});
      } else {
        this.$set(
          this.selection,
          personId,
          Object.assign({}, this.selection[personId], options)
        );
      }

      localStorage.setItem(
        selectionLocalStorageName,
        JSON.stringify(this.selection)
      );
    },
    hasSelection(personId) {
      return !!this.selection[personId];
    },
    personSelection(personId) {
      return this.hasSelection(personId) ? this.selection[personId] : {};
    },
    getActiveType(person) {
      return this.selectedTypes[person.id] || null;
    },
    selectType(person, type) {
      this.$set(this.selectedTypes, person.id, type);
      localStorage.setItem(
        selectedTypesLocalStorageName,
        JSON.stringify(this.selectedTypes)
      );
    },
  },
  computed: {
    persons() {
      console.log(this.personExplorerSelection);
      return Object.values(this.personExplorerSelection).sort((a, b) => {
        if (a.order < b.order) return 1;
        else if (a.order > b.order) return -1;
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
