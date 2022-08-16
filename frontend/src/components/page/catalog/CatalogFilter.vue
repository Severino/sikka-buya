<template>
  <div class="catalog-filters">
    <labeled-input-container
      v-for="num of numberFilters"
      :key="num.value"
      :label="num.label"
      class="three-way-wrapper"
    >
      <input type="number" v-model="filters[num.value]" />
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
      <three-way-toggle v-model="filters[tw.value]" :invert="tw.invert" />
    </labeled-input-container>

    <labeled-input-container
      v-for="ms of multiSelectFilters"
      :label="ms.label"
      :key="ms.value"
      class="multi-select-wrapper"
    >
      <multi-data-select
        :table="ms.value"
        v-model="filters[searchVariableName(ms.value)]"
        :active="filters[ms.value]"
        :attribute="ms.attribute"
        :queryParams="ms.queryParams"
        :queryCommand="ms.queryCommand"
        :additionalParameters="ms.additionalParameters"
        :text="ms.text"
        :displayTextCallback="ms.displayTextCallback"
        :disableRemoveButton="true"
        @select="(el) => selectFilter(ms.value, el)"
        @remove="(el) => removeFilter(ms.value, el)"
      />
    </labeled-input-container>
  </div>
</template>

<script>
import MultiDataSelect from '../../forms/MultiDataSelect.vue';
import Filter from '../../../models/Filter';
import LabeledInputContainer from '../../LabeledInputContainer.vue';
import Sorter from '../../../utils/Sorter';
import ThreeWayToggle from '../../forms/ThreeWayToggle.vue';
import ButtonGroup from '../../forms/ButtonGroup.vue';
import { RequestGuard } from '../../../utils/Async';
import Type from '../../../utils/Type';
import PageInfo, { Pagination } from '../../../models/pageinfo';

const searchRequestGuard = new RequestGuard();

const unfilteredNumberFilters = [
  {
    label: 'Herstellungsjahr',
    value: 'yearOfMint',
  },
];

const unfilteredButtonGroupFilters = [
  {
    label: 'Herstellungsart',
    value: 'procedure',
    options: ['pressed', 'cast'],
    labels: ['geprägt', 'gegossen'],
  },
];

const unfilteredThreeWayFilters = [
  {
    label: 'Kursive Schrift',
    value: 'cursiveScript',
  },
  {
    label: 'Geschenkmünze',
    value: 'donativ',
  },
  {
    label: 'Jahr sicher',
    value: 'yearUncertain',
    invert: true,
  },
  {
    label: 'Prägeort sicher',
    value: 'mintUncertain',
    invert: true,
  },
];

let unfilteredMultiSelectFilters = [
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
    additionalParameters: {
      exclude: ['caliph', 'heir'],
    },
    displayTextCallback: function (search) {
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
    value: 'ruler',
    queryCommand: 'searchPersonsWithoutRole',
    queryParams: ['id', 'name', { dynasty: ['id', 'name'] }],
    displayTextCallback: function (search) {
      let txt = search.name;
      if (search?.dynasty?.name) txt = `${txt} (${search.dynasty.name})`;
      return txt;
    },
  },
];

unfilteredMultiSelectFilters = unfilteredMultiSelectFilters.sort(
  Sorter.stringPropAlphabetically('label')
);

let filterData = {};
let filterMethods = {};

[
  ...unfilteredThreeWayFilters,
  ...unfilteredButtonGroupFilters,
  ...unfilteredNumberFilters,
].forEach((item) => {
  filterData = Object.assign(filterData, {
    [item.value]: item.defaultValue || null,
  });
});

unfilteredMultiSelectFilters.forEach((item) => {
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
  props: {
    pageInfo: Object,
    typeBody: {
      type: String,
      defaultValue: 'id projectId',
    },
    constantFilters: Object,
    overwriteFilters: Object,
    exclude: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      i: 0,
      max: 10,
      unfilteredNumberFilters,
      unfilteredButtonGroupFilters,
      unfilteredMultiSelectFilters,
      unfilteredThreeWayFilters,
      types: [],
      filters: {
        ...filterData,
      },
    };
  },
  watch: {
    filters: {
      handler() {
        this.search();
      },
      deep: true,
    },
    overwriteFilters: {
      handler() {
        this.search();
      },
      deep: true,
    },
    pageInfo: {
      async handler(oldPageInfo, pageInfo) {
        if (!PageInfo.equals(oldPageInfo, pageInfo)) {
          await this.search(pageInfo);
        }
      },
      deep: true,
    },
  },
  methods: {
    ...filterMethods,
    async search() {
      const filters = Object.assign(
        {},
        this.activeFilters,
        this.constantFilters,
        this.overwriteFilters
      );

      const multiSelectFilters = this.multiSelectFilters;

      searchRequestGuard.exec(
        async ({ filters, multiSelectFilters } = {}) => {
          multiSelectFilters.forEach((item) => {
            if (filters[item.value])
              filters[item.value] = filters[item.value].map((item) => item.id);
          });

          let { types, pageInfo } = await Type.filteredQuery({
            pagination: Pagination.fromPageInfo(this.pageInfo),
            filters,
            typeBody: this.typeBody,
          });

          this.$emit('update', { types, pageInfo });
        },
        { filters, multiSelectFilters }
      );
    },
    resetFilters() {
      [
        ...unfilteredThreeWayFilters,
        ...unfilteredButtonGroupFilters,
        ...unfilteredNumberFilters,
      ].forEach((item) => {
        this.$set(this.filters, item.value, item.defaultValue || null);
      });

      [...unfilteredMultiSelectFilters].forEach((filter) => {
        const emptyObj = Filter.unsetFilter(filter);
        for (let [key, val] of Object.entries(emptyObj)) {
          this.$set(this.filters, key, val || null);
        }
      });
    },
    selectFilter(name, target) {
      const methodName = Filter.selectMethodName(name);
      return this[methodName](target);
    },
    removeFilter(name, target) {
      const methodName = Filter.removeMethodName(name);
      return this[methodName](target);
    },
    excludeItem(group) {
      return group.filter((item) => this.exclude.indexOf(item.value) === -1);
    },
    searchVariableName(value) {
      return Filter.searchVariableName(value);
    },
  },
  computed: {
    activeFilters() {
      return Object.entries(this.filters)
        .filter(([name, val]) => {
          if (name.startsWith(Filter.searchPrefix)) return false;

          if (val === null) return false;
          if (typeof val === 'object') {
            if (Array.isArray(val)) {
              return val.length !== 0;
            } else {
              return val.id && val.id !== null;
            }
          } else {
            switch (typeof val) {
              case 'string':
                return val != '';
            }
            return true;
          }
        })
        .reduce((obj, [name, val]) => {
          obj[name] = val;
          return obj;
        }, {});
    },
    numberFilters() {
      return this.excludeItem(this.unfilteredNumberFilters);
    },
    buttonGroupFilters() {
      return this.excludeItem(this.unfilteredButtonGroupFilters);
    },
    multiSelectFilters() {
      return this.excludeItem(this.unfilteredMultiSelectFilters);
    },
    threeWayFilters() {
      return this.excludeItem(this.unfilteredThreeWayFilters);
    },
  },
};
</script>

<style lang="scss">
.catalog-filters {
  .three-way-toggle {
    min-height: 22px;
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