<template>
  <div class="catalog-filters">
    <template v-for="input of filteredInput">
      <labeled-input-container
        v-if="input.type === 'text'"
        :key="input.value"
        :label="input.label"
        class="three-way-wrapper"
      >
        <input type="text" v-model="filters[input.value]" />
      </labeled-input-container>

      <labeled-input-container
        v-else-if="input.type === 'number'"
        :key="input.value"
        :label="input.label"
        class="three-way-wrapper"
      >
        <input type="number" v-model="filters[input.value]" />
      </labeled-input-container>

      <labeled-input-container
        v-else-if="input.type === 'button-group'"
        :key="input.value"
        :label="input.label"
        class="three-way-wrapper"
      >
        <button-group
          :id="input.value"
          :labels="input.labels"
          :options="input.options"
          :unselectable="true"
          v-model="filters[input.value]"
        />
      </labeled-input-container>

      <labeled-input-container
        v-else-if="input.type === 'three-way'"
        :key="input.value"
        :label="input.label"
        class="three-way-wrapper"
      >
        <three-way-toggle
          v-model="filters[input.value]"
          :invert="input.invert"
        />
      </labeled-input-container>

      <labeled-input-container
        v-else-if="input.type === 'multi-select'"
        :label="input.label"
        :key="input.value"
        class="multi-select-wrapper"
      >
        <multi-data-select
          :table="input.value"
          v-model="filters[searchVariableName(input.value)]"
          :active="filters[input.value]"
          :attribute="input.attribute"
          :queryParams="input.queryParams"
          :queryCommand="input.queryCommand"
          :additionalParameters="input.additionalParameters"
          :text="input.text"
          :displayTextCallback="input.displayTextCallback"
          :disableRemoveButton="true"
          @select="(el) => selectFilter(input.value, el)"
          @remove="(el) => removeFilter(input.value, el)"
        />
      </labeled-input-container>
      <error-box
        v-else
        :key="input.value"
        :message="`Unbekannter Eingabetyp '${input.type}': EingabeFeld kann nicht angezeigt werden!`"
      />
    </template>
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
import ErrorBox from '../system/ErrorBox.vue';

const searchRequestGuard = new RequestGuard();

function addType(arr, typeName) {
  arr.forEach((obj) => (obj.type = typeName));
}

const textFilters = [
  {
    label: 'Typen-ID',
    value: 'projectId',
    order: -2,
  },
  {
    label: 'Treadwell-ID',
    value: 'treadwellId',
    order: -1,
  },
];
addType(textFilters, 'text');

const unfilteredNumberFilters = [
  {
    label: 'Herstellungsjahr',
    value: 'yearOfMint',
  },
];
addType(unfilteredNumberFilters, 'number');

const unfilteredButtonGroupFilters = [
  {
    label: 'Herstellungsart',
    value: 'procedure',
    options: ['pressed', 'cast'],
    labels: ['geprägt', 'gegossen'],
    order: 3,
  },
];
addType(unfilteredButtonGroupFilters, 'button-group');

const unfilteredThreeWayFilters = [
  {
    label: 'kursive Schrift',
    value: 'cursiveScript',
    order: 8,
  },
  {
    label: 'Geschenkmünze',
    value: 'donativ',
    order: 4,
  },
  {
    label: 'Jahr sicher',
    value: 'yearUncertain',
    invert: true,
    order: 10,
  },
  {
    label: 'Ort sicher',
    value: 'mintUncertain',
    invert: true,
    order: 9,
  },
];
addType(unfilteredThreeWayFilters, 'three-way');

let unfilteredMultiSelectFilters = [
  {
    label: 'Material',
    value: 'material',
    order: 0,
  },
  {
    label: 'Prägeort',
    value: 'mint',
  },
  {
    label: 'Nominal',
    value: 'nominal',
    order: 3,
  },
  {
    label: 'Münzzeichen/Einzelworte',
    value: 'coinMark',
    order: 5,
  },
  {
    label: 'Kalif',
    value: 'caliph',
    attribute: 'shortName',
    queryParams: ['id', 'shortName'],
  },
  {
    label: 'sonstige Personen',
    value: 'otherPerson',
    queryCommand: 'searchPersonsWithRole',
    queryParams: ['id', 'name', { role: ['id', 'name'] }],
    additionalParameters: {
      exclude: ['caliph', 'heir'],
    },
    displayTextCallback: function (search) {
      return `${search.name} (${this.$tc(`role.${search.role.name}`)})`;
    },
    order: 6,
  },
  {
    label: 'Herrschertitel',
    value: 'title',
    order: 7,
  },
  {
    label: 'Ehrennamen',
    value: 'honorific',
    order: 8,
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
addType(unfilteredMultiSelectFilters, 'multi-select');

unfilteredMultiSelectFilters = unfilteredMultiSelectFilters.sort(
  Sorter.stringPropAlphabetically('label')
);

let filterData = {};
let filterMethods = {};

[
  ...textFilters,
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

const inputs = [
  ...unfilteredNumberFilters,
  ...unfilteredButtonGroupFilters,
  ...unfilteredMultiSelectFilters,
  ...unfilteredThreeWayFilters,
  ...textFilters,
].sort((a, b) => {
  if (a.order == null) return 1;
  else if (b.order == null) return -1;
  else return a.order - b.order;
});

console.log(inputs);

export default {
  components: {
    MultiDataSelect,
    LabeledInputContainer,
    ThreeWayToggle,
    ButtonGroup,
    ErrorBox,
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
      inputs,
      types: [],
      filters: {
        ...filterData,
      },
      watching: true,
    };
  },
  watch: {
    filters: {
      handler() {
        this.watch();
      },
      deep: true,
    },
    overwriteFilters: {
      handler() {
        this.watch();
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
        { filters, multiSelectFilters: this.multiSelectFilters }
      );
    },
    watch() {
      if (this.watching) this.search();
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
    searchVariableName(value) {
      return Filter.searchVariableName(value);
    },
    stopWatching() {
      if (this.watching === false)
        console.warn("You try to stop, but it's already stopped");

      console.log('STOP');
      this.watching = false;
    },
    resumeWatching() {
      if (this.watching === true)
        console.warn('You try to resume, but its not stopped');
      console.log('RESUME');

      this.watching = true;
    },
    excludeItem(group) {
      return group.filter((item) => this.exclude.indexOf(item.value) === -1);
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
    filteredInput() {
      return this.inputs.filter(
        (item) => this.exclude.indexOf(item.value) === -1
      );
    },
    multiSelectFilters() {
      return this.excludeItem(unfilteredMultiSelectFilters);
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