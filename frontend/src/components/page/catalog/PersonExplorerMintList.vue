<template>
  <div class="person-explorer-mint-list">
    <h6>Prägeort(e)</h6>
    <div
      class="mint-row"
      v-for="year of sortedSelectedYears"
      :key="`mint-of-year-${year}`"
    >
      <person-explorer-mint-row
        :year="year"
        :tree="tree"
        :selectedIssuerMints="[]"
      />
    </div>
    <span v-if="!hasActive" class="hint">Wählen Sie einen Prägeort!</span>
  </div>
</template>

<script>
import Sort from '../../../utils/Sorter';
import OverlordSeparator from './OverlordSeparator.vue';
import PersonExplorerMintRow from './PersonExplorerMintRow.vue';
import ToggleButtonList from './ToggleButtonList.vue';

export default {
  components: { ToggleButtonList, OverlordSeparator, PersonExplorerMintRow },
  props: {
    tree: Object,
    selectedYears: Array,
  },
  methods: {
    changed(year, mint, rulerType) {
      this.$emit('change', year, mint, rulerType);
    },

    activeIssuers(year) {
      return this.activeYears[year].activeIssuerMints;
    },
    activeOverlords(year) {
      return this.activeYears[year].activeOverlordsMints;
    },
    getSortedMintList() {
      return [];
    },
  },
  computed: {
    sortedSelectedYears() {
      let selectedYears = this.selectedYears;
      return selectedYears.sort(Sort.classicStringAlphabetically());
    },
    yearObjectArray() {
      return [];
    },
    hasActive() {
      return this.selectedYears.length > 0;
    },
  },
};
</script>

<style lang="scss" >
.person-explorer-mint-list {
  button {
    margin: 3px;
  }
}
</style>


<style lang="scss" scoped>
.year-title {
  margin-right: $padding;
  font-weight: bold;
  font-size: 1.1rem;
}
</style>