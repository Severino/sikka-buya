<template>
  <collapsible
    class="person-explorer-person-view"
    :class="{
      highlight: person.id == 8,
      ['generation-gap']: spacingByHardCodedGenerations(orderMap[person.id]),
    }"
    :key="person.id"
    :collapsed="!open"
    @toggled="toggleCollapse"
  >
    <template slot="header">
      <div class="edit-toolbar" v-if="editmode">
        <input
          type="number"
          class="editor-order-input"
          @click.stop
          :value="orderMap[person.id]"
          @change="$emit('order-changed', $event, person.id)"
        />
      </div>
      <span v-html="formatName(person.name)" />
    </template>
    <loading-spinner v-if="loading" />
    <!-- Year List -->
    <section v-else>
      <person-explorer-year-list
        class="year-area area"
        :list="sortedTypeTree"
        :person="person"
        :active="selection"
        @change="yearChanged"
      />
    </section>

    <!-- Mint List -->
    <section class="mint-section area" v-if="hasActiveYears">
      <person-explorer-mint-list
        :yearObjectArray="yearObjectArray"
        :activeYears="selection"
        @change="mintChanged"
      />
    </section>
    <!-- Type List -->
    <section class="type-section area" v-if="hasActiveYears && hasActiveMints">
      <person-explorer-type-list
        :issuerTypes="getActiveTypes(false)"
        :overlordTypes="getActiveTypes(true)"
        :selected="activeType"
        @change="selectType"
      />
    </section>

    <!-- Type View -->
    <type-view v-if="selectedType" :type="selectedType" />
  </collapsible>
</template>

<script>
import Collapsible from '../../layout/Collapsible.vue';
import LoadingSpinner from '../../misc/LoadingSpinner.vue';
import PersonExplorerMintList from './PersonExplorerMintList.vue';
import PersonExplorerYearList from './PersonExplorerYearList.vue';
import Sort from '../../../utils/Sorter';
import ToggleButtonList from './ToggleButtonList.vue';
import Type from '../../../utils/Type';
import OverlordSeparator from './OverlordSeparator.vue';
import PersonExplorerTypeList from './PersonExplorerTypeList.vue';
import TypeView from '../TypeView.vue';

export default {
  components: {
    Collapsible,
    LoadingSpinner,
    PersonExplorerMintList,
    PersonExplorerYearList,
    ToggleButtonList,
    OverlordSeparator,
    PersonExplorerTypeList,
    TypeView,
  },
  data() {
    return {
      loading: false,
      open: false,
      types: {},
      typeTree: {},
    };
  },
  props: {
    activeType: String,
    initOpen: Boolean,
    person: {
      required: true,
      type: Object,
    },
    orderMap: {
      required: true,
      type: Object,
    },
    selection: {
      required: true,
      type: Object,
    },
    editmode: Boolean,
  },
  mounted() {
    if (this.initOpen) this.open = true;
    this.initialFetch();
  },
  methods: {
    async initialFetch() {
      if (Object.keys(this.selection).length > 0 || this.initOpen) {
        this.open = true;
        await this.getTypes();
      }
    },
    selectType(id) {
      this.$emit('type-selected', id);
    },
    isTypeActive(id) {
      return this.activeType === id;
    },
    spacingByHardCodedGenerations(num) {
      let generationalSpacings = [27, 23, 20, 14, 11, 9, 5, 3];
      return generationalSpacings.indexOf(num) != -1;
    },
    formatName(name) {
      return name.replace(/^(.*)(b\..*?|banū.*?)(?=\(|$)/g, '$1 <i>$2</i>');
    },
    yearChanged(year) {
      let selection = this.selection;

      if (selection[year]) {
        if (this.types?.[this.activeType]?.yearOfMint === year) {
          this.$emit('type-selected', null);
          delete selection[year];
        }
      } else {
        selection[year] = {
          activeIssuerMints: {},
          activeOverlordsMints: {},
        };
      }
      this.updateSelection(selection);
    },
    mintChanged(year, mintId, isOverlord = false) {
      let selection = this.selection;

      const toggleMintObject = (obj) => {
        if (obj[mintId]) {
          const typeLeaves = this.getTypesFromTree(year, mintId, isOverlord);
          if (
            typeLeaves.findIndex((type) => type.id === this.activeType) !== -1
          )
            this.$emit('type-selected', null);
          delete obj[mintId];
        } else obj[mintId] = true;
      };

      if (isOverlord) {
        toggleMintObject(selection[year].activeOverlordsMints);
      } else {
        toggleMintObject(selection[year].activeIssuerMints);
      }
      this.updateSelection(selection);
    },
    updateSelection(selection) {
      this.$emit('selection-changed', selection);
    },
    async personSelected(collapsed) {
      if (!collapsed) this.$emit('person-selected', this.person.id);
      else this.$emit('person-unselected', this.person.id);
    },
    getTypes: async function () {
      if (!this.loading) {
        this.loading = true;
        try {
          const result = await Type.filteredQuery({
            pagination: {
              page: 0,
              count: 100000,
            },
            filters: {
              ruler: [this.person.id],
              excludeFromTypeCatalogue: false,
            },
            typeBody: `id projectId treadwellId mint {name id location} mintAsOnCoin material {name id} nominal {name id}
yearOfMint donativ procedure issuers {id name shortName} overlords {id name shortName} otherPersons {id role {name id} name shortName}
caliph {id name shortName}
avers {fieldText innerInscript intermediateInscript outerInscript misc}
reverse {fieldText innerInscript intermediateInscript outerInscript misc} 
cursiveScript coinMarks {name id}
literature pieces  specials yearUncertain mintUncertain excludeFromMapApp
`,
          });

          const types = result.types;
          let typeTree = {};
          types.forEach((type) => {
            this.types[type.id] = type;

            const year =
              type.yearOfMint === '' ? ' ohne Jahresangabe' : type.yearOfMint;

            if (!typeTree[year]) {
              typeTree[year] = {
                value: year,
                active: false,
                // children: {},
                asIssuer: {},
                asOverlord: {},
              };
            }

            const isIssuer = Boolean(
              type.issuers.find((issuer) => issuer.id === this.person.id)
            );

            let mint = type?.mint?.id
              ? type.mint
              : { id: 0, name: 'ohne Ortsangabe' };
            const mintId = mint.id;

            try {
              type.mint.location = JSON.parse(type.mint.location);
            } catch (e) {
              type.mint.location = null;
            }

            if (isIssuer) {
              if (!typeTree[year].asIssuer[mintId]) {
                typeTree[year].asIssuer[mintId] = {
                  value: mint,
                  active: false,
                  children: [],
                };
              }
              typeTree[year].asIssuer[mintId].children.push(type);
            } else {
              if (!typeTree[year].asOverlord[mintId]) {
                typeTree[year].asOverlord[mintId] = {
                  value: mint,
                  active: false,
                  children: [],
                };
              }
              typeTree[year].asOverlord[mintId].children.push(type);
            }
          });

          this.typeTree = typeTree;
        } catch (e) {
          console.error(e);
          this.person.error = e;
        } finally {
          this.loading = false;
        }
      }
    },
    toggleCollapse(collapsed) {
      this.open = !collapsed;

      if (this.open) {
        this.getTypes();
        this.updateSelection({});
      } else {
        this.updateSelection(null);
      }
    },
    getTypesFromTree(year, mintId, isOverlord = false) {
      const rulerType = isOverlord ? 'asOverlord' : 'asIssuer';
      const types = this.typeTree[year]?.[rulerType]?.[mintId]?.children;
      return types ? types : [];
    },
    getActiveTypes(isOverlord = 'false') {
      const types = {};
      Object.entries(this.selection).forEach(([year, yearObj]) => {
        if (this.typeTree[year]) {
          const mintProperty = isOverlord
            ? 'activeOverlordsMints'
            : 'activeIssuerMints';
          const obj = yearObj?.[mintProperty];

          Object.keys(obj).forEach((mintId) => {
            const rulerProperty = isOverlord ? 'asOverlord' : 'asIssuer';
            this.typeTree[year][rulerProperty][mintId].children.forEach(
              (type) => {
                types[type.id] = type;
              }
            );
          });
        }
      });
      return Object.values(types);
    },
  },
  computed: {
    selectedType() {
      return this.types[this.activeType];
    },
    availableMints() {
      return [];
    },
    yearObjectArray() {
      const yearObjects = [];
      Object.keys(this.selection).forEach((year) => {
        if (this.typeTree[year]) yearObjects.push(this.typeTree[year]);
      });
      return yearObjects.sort(Sort.stringPropAlphabetically('value'));
    },
    sortedTypeTree() {
      let typeTree = Object.values(this.typeTree);
      return typeTree.sort(Sort.stringPropAlphabetically('value'));
    },
    hasActiveMints() {
      for (let activeYearObj of Object.values(this.selection)) {
        if (
          Object.keys(activeYearObj.activeOverlordsMints).length > 0 ||
          Object.keys(activeYearObj.activeIssuerMints).length > 0
        )
          return true;
      }
      return false;
    },
    hasActiveYears() {
      return Object.keys(this.selection).length > 0;
    },
  },
};
</script>

<style lang="scss">
.person-explorer-person-view {
  button,
  .button {
    padding: math.div($padding, 2) $padding;
  }

  .active {
    color: $white;
    background-color: $primary-color;

    &:hover {
      color: $white;
      background-color: darken($primary-color, 10%);
    }
  }

  &.collapsible.generation-gap {
    margin-bottom: 2 * $padding;
  }
}
</style>

<style lang="scss" scoped>
.person-explorer-person-view section {
  margin-bottom: $padding * 2;
}
.editor-order-input {
  width: 65px;
  font-size: $small-font;
  padding: $small-padding $small-padding * 2;
  margin-right: $padding;
  text-align: right;
}
</style>