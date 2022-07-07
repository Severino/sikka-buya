<template>
  <div class="catalog-filters">
    <labeled-input-container
      v-for="num of numberFilters"
      :key="num.value"
      :label="num.label"
      class="three-way-wrapper"
    >
      <input
        type="number"
        v-model="filters[num.value]"
        @input="filterChanged"
      />
    </labeled-input-container>

    <labeled-input-container
      v-for="bg of buttonGroupFilters"
      :key="bg.value"
      :label="bg.label"
      class="three-way-wrapper"
    >
      <button-group
        :id="bg.value"
        :labels="bg.labels"
        :options="bg.options"
        :unselectable="true"
        v-model="filters[bg.value]"
      />
    </labeled-input-container>

    <labeled-input-container
      v-for="tw of threeWayFilters"
      :key="tw.value"
      :label="tw.label"
      class="three-way-wrapper"
    >
      <three-way-toggle v-model="filters[tw.value]" />
    </labeled-input-container>

    <labeled-input-container
      v-for="ms of multiSelectFilters"
      :label="ms.label"
      :key="ms.value"
      class="multi-select-wrapper"
    >
      <multi-data-select
        :table="ms.value"
        v-model="filters[ms.value]"
        :active="getActiveFilters(ms.value)"
        :attribute="ms.attribute"
        :queryParams="ms.queryParams"
        :queryCommand="ms.queryCommand"
        :text="ms.text"
        :textFunction="ms.textFunction"
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
import ThreeWayToggle from '../../forms/ThreeWayToggle.vue';
import ButtonGroup from '../../forms/ButtonGroup.vue';

const numberFilters = [
  {
    label: 'Herstellungsjahr',
    value: 'yearOfMint',
  },
];

const buttonGroupFilters = [
  {
    label: 'Herstellungsart',
    value: 'procedure',
    options: ['pressed', 'cast'],
    labels: ['geprägt', 'gegossen'],
  },
];

const threeWayFilters = [
  {
    label: 'Kursive Schrift',
    value: 'cursive',
  },
  {
    label: 'Geschenkmünze (?)',
    value: 'dontaiv',
  },
  {
    label: 'Jahr nicht sicher',
    value: 'yearUncertain',
  },
  {
    label: 'Prägeort nicht sicher',
    value: 'mintUncertain',
  },
];

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
  {
    label: 'Münzzeichen',
    value: 'coinMark',
  },
  {
    label: 'Kalif',
    value: 'caliph',
    attribute: 'shortName',
    queryParams: ['id', 'shortName'],
  },
  {
    label: 'Sonstige Personen',
    value: 'otherPerson',
    queryCommand: 'searchPersonsWithRole',
    queryParams: ['id', 'name', { role: ['id', 'name'] }],
    textFunction: function (search) {
      return `${search.name} (${this.$tc(`role.${search.role.name}`)})`;
    },
  },
  {
    label: 'Title',
    value: 'title',
  },
  {
    label: 'Ehrenname',
    value: 'honorific',
  },
  {
    label: 'Herrscher',
    value: 'rulers',
    queryCommand: 'searchPersonsWithoutRole',
    queryParams: ['id', 'name', { dynasty: ['id', 'name'] }],
    textFunction: function (search) {
      let txt = search.name;
      if (search?.dynasty?.name) txt = `${txt} (${search.dynasty.name})`;
      return txt;
    },
  },
];

multiSelectFilters = multiSelectFilters.sort(
  Sorter.stringPropAlphabetically('label')
);

let filterData = {};
let filterMethods = {};

[...threeWayFilters, ...buttonGroupFilters, ...numberFilters].forEach(
  (item) => {
    filterData = Object.assign(filterData, {
      [item.value]: item.defaultValue || null,
    });
  }
);

multiSelectFilters.forEach((item) => {
  const filter = new Filter(item.value);
  filterData = Object.assign(filterData, filter.mapData());
  filterMethods = Object.assign(filterMethods, filter.mapMethods());
  item.filter = filter;
});

export default {
  components: {
    MultiDataSelect,
    LabeledInputContainer,
    ThreeWayToggle,
    ButtonGroup,
  },
  data() {
    return {
      numberFilters,
      buttonGroupFilters,
      multiSelectFilters,
      threeWayFilters,
      types: [],
      filters: {
        ...filterData,
      },
    };
  },
  methods: {
    filterChanged() {
      const filtered = Object.entries(this.filters).filter(([name, val]) => {
        if (Array.isArray(val)) return val.length !== 0;
        else if (val == null) return false;
        else if (typeof val === 'object') return val.id !== null;

        return true;
      });
      console.log(filtered);
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

<style lang="scss">
.catalog-filters {
  .three-way-toggle {
    min-height: 36px;
  }
}
</style>

<style lang="scss" scoped>
.catalog-filters {
  display: grid;
  gap: $padding;
  grid-template-columns: repeat(6, 1fr);
}

.three-way-wrapper {
  grid-column: span 3;
}

.multi-select-wrapper {
  grid-column: span 6;
}
</style>