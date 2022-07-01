<template>
  <div class="catalog-filters">
    <labeled-input-container
      v-for="ms of multiSelectFilters"
      :label="ms.label"
      :key="ms.value"
    >
      <multi-data-select
        :table="ms.value"
        v-model="filters[ms.value]"
        :active="getActiveFilters(ms.value)"
        @select="(el) => selectFilter(ms.value, el)"
        @remove="(el) => removeFilter(ms.value, el)"
      />
    </labeled-input-container>
    <button>Search</button>
    <p>{{ types.length }} types found.</p>
  </div>
</template>

<script>
import MultiDataSelect from '../../forms/MultiDataSelect.vue';
import Filter from '../../../models/Filter';
import LabeledInputContainer from '../../LabeledInputContainer.vue';
import Sorter from '../../../utils/Sorter';

let multiSelectFilters = [
  {
    label: 'Material',
    value: 'material',
  },
  {
    label: 'Prägeort',
    value: 'mint',
  },
  {
    label: 'Nominal',
    value: 'nominal',
  },
];

multiSelectFilters = multiSelectFilters.sort(
  Sorter.stringPropAlphabetically('label')
);

let filterData = {};
let filterMethods = {};

multiSelectFilters.forEach((item) => {
  const filter = new Filter(item.value);
  filterData = Object.assign(filterData, filter.mapData());
  filterMethods = Object.assign(filterMethods, filter.mapMethods());
  item.filter = filter;
});

export default {
  components: { MultiDataSelect, LabeledInputContainer },
  data() {
    return {
      multiSelectFilters,
      types: [],
      filters: {
        ...filterData,
      },
    };
  },
  methods: {
    filterChanged() {
      console.log(this.filters.activeMaterials);
    },
    ...filterMethods,
    getActiveFilters(name) {
      const activeFiltersName = Filter.activeSelector(name);
      return this.filters[activeFiltersName];
    },
    selectFilter(name, target) {
      const methodName = Filter.selectMethodName(name);
      return this[methodName](target);
    },
    removeFilter(name, target) {
      const methodName = Filter.removeMethodName(name);
      return this[methodName](target);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>