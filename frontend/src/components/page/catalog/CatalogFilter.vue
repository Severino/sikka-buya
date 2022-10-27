<template>
  <div class="catalog-filters">
    <template v-for="input of filteredInput">
      <labeled-input-container
        v-if="input.type === 'text'"
        :key="input.value"
        :label="input.label"
        :class="[input.value]"
        class="three-way-wrapper"
      >
        <input type="text" v-model="filters[input.value]" />
      </labeled-input-container>

      <labeled-input-container
        v-else-if="input.type === 'number'"
        :key="input.value"
        :label="input.label"
        :class="[input.value]"
        class="three-way-wrapper"
      >
        <input type="number" v-model="filters[input.value]" />
      </labeled-input-container>

      <labeled-input-container
        v-else-if="input.type === 'button-group'"
        :key="input.value"
        :label="input.label"
        :class="[input.value]"
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
        :class="[input.value]"
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
        :class="[input.value]"
        :key="input.value"
        class="multi-select-wrapper"
      >
        <multi-data-select
          :active="filters[input.value]"
          :additionalParameters="input.additionalParameters"
          :allowModeChange="input.allowModeChange"
          :attribute="input.attribute"
          :disableRemoveButton="true"
          :displayTextCallback="input.displayTextCallback"
          :mode="getMode(input.value)"
          :queryCommand="input.queryCommand"
          :queryParams="input.queryParams"
          :table="input.value"
          :text="input.text"
          v-model="filters[searchVariableName(input.value)]"
          @select="(el) => selectFilter(input.value, el)"
          @remove="(el) => removeFilter(input.value, el)"
          @change-mode="() => changeFilterMode(input.value)"
          @dynamic-change="() => $emit('dynamic-change')"
        />
      </labeled-input-container>
      <labeled-input-container
        v-else-if="input.type === 'multi-select-2d'"
        :label="input.label"
        :class="[input.value]"
        :key="input.value"
        class="multi-select-wrapper"
      >
        <multi-data-select-2-d
          :active="filters[input.value]"
          :input="input"
          :mode="getMode(input.value)"
          @add="() => addToFilterList(input.value)"
          @select="(value, idx) => selectFilter(input.value, value, idx)"
          @remove="(el, idx) => removeFilter(input.value, el, idx)"
          @dynamic-change="() => $emit('dynamic-change')"
          @remove-group="(idx) => removeFilterGroup(input.value, idx)"
          @change-mode="() => changeFilterMode(input.value)"
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
import Filter, { FilterList } from '../../../models/Filter';
import LabeledInputContainer from '../../LabeledInputContainer.vue';
import Sorter from '../../../utils/Sorter';
import ThreeWayToggle from '../../forms/ThreeWayToggle.vue';
import ButtonGroup from '../../forms/ButtonGroup.vue';
import { RequestGuard } from '../../../utils/Async';
import Type from '../../../utils/Type';
import PageInfo, { Pagination } from '../../../models/pageinfo';
import ErrorBox from '../system/ErrorBox.vue';
import MultiDataSelect2D from '../../forms/MultiDataSelect2D.vue';

const searchRequestGuard = new RequestGuard();

function addType(arr, typeName) {
  arr.forEach((obj) => (obj.type = typeName));
}

const mode = {
  and: 'and',
  or: 'or',
};

const textFilters = [
  {
    label: 'sikka:būya-ID',
    value: 'projectId',
    order: -10,
  },
  {
    label: 'Treadwell-ID',
    value: 'treadwellId',
    order: -9,
  },
];
addType(textFilters, 'text');

const unfilteredNumberFilters = [
  {
    label: 'Prägejahr',
    value: 'yearOfMint',
    order: -3,
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
    mode: mode.or,
  },
  {
    label: 'Prägeort',
    value: 'mint',
    order: -5,
    mode: mode.or,
  },
  {
    label: 'Nominal',
    value: 'nominal',
    order: 3,
    mode: mode.or,
  },
  {
    label: 'Kalif',
    value: 'caliph',
    mode: mode.or,
    attribute: 'shortName',
    queryParams: ['id', 'shortName'],
    order: 5.8,
  },
  {
    label: 'sonstige Personen',
    value: 'otherPerson',
    queryCommand: 'searchPersonsWithRole',

    queryParams: ['id', 'name', 'shortName', { role: ['id', 'name'] }],
    additionalParameters: {
      exclude: ['caliph', 'heir'],
    },
    displayTextCallback: function (search) {
      return `${search.shortName || search.name} (${this.$tc(
        `role.${search.role.name}`
      )})`;
    },
    order: 6,
    allowModeChange: true,
  },
  {
    label: 'Herrschertitel',
    value: 'title',
    order: 7,
    mode: mode.and,
    allowModeChange: true,
  },
  {
    label: 'Ehrennamen',
    value: 'honorific',
    order: 8,
    mode: mode.and,
    allowModeChange: true,
  },
  {
    label: 'Herrscher',
    value: 'ruler',
    queryCommand: 'searchPersonsWithoutRole',
    queryParams: ['id', 'name', 'shortName', { dynasty: ['id', 'name'] }],
    displayTextCallback: function (search) {
      let txt = search.shortName || search.name;
      if (search?.dynasty?.name) txt = `${txt} (${search.dynasty.name})`;
      return txt;
    },
    order: 5.5,
    allowModeChange: true,
  },
];
addType(unfilteredMultiSelectFilters, 'multi-select');

const unfilteredMultiDataSelect2D = [
  {
    label: 'Münzzeichen/Einzelworte',
    value: 'coinMark',
    order: 5,
  },
];
addType(unfilteredMultiDataSelect2D, 'multi-select-2d');

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

let filterMode = {};

unfilteredMultiSelectFilters.forEach((item) => {
  const filter = new Filter(item.value);
  filterData = Object.assign(filterData, filter.mapData(item.defaultValue));
  filterMethods = Object.assign(filterMethods, filter.mapMethods());
  filterMode[item.value] = item.mode ? item.mode : mode.and;
  item.filter = filter;
});

unfilteredMultiDataSelect2D.forEach((item) => {
  const filter = new FilterList(item.value);
  filterData = Object.assign(filterData, filter.mapData([[]]));
  filterMethods = Object.assign(filterMethods, filter.mapMethods());
  filterMode[item.value] = item.mode ? item.mode : mode.and;
  item.filter = filter;
});

const inputs = [
  ...unfilteredNumberFilters,
  ...unfilteredButtonGroupFilters,
  ...unfilteredMultiSelectFilters,
  ...unfilteredMultiDataSelect2D,
  ...unfilteredThreeWayFilters,
  ...textFilters,
].sort((a, b) => {
  if (a.order == null) return 1;
  else if (b.order == null) return -1;
  else return a.order - b.order;
});

export default {
  components: {
    MultiDataSelect,
    LabeledInputContainer,
    ThreeWayToggle,
    ButtonGroup,
    ErrorBox,
    MultiDataSelect2D,
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
      filterMode: {
        ...filterMode,
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
    setFilter(key, val) {
      this.filters[key] = val;
    },
    async search() {
      const filters = Object.assign(
        {},
        this.activeFilters,
        this.constantFilters,
        this.overwriteFilters
      );

      searchRequestGuard.exec(
        async ({ filters, multiSelectFilters, multiSelectFilters2D } = {}) => {
          multiSelectFilters.forEach(({ value: name }) => {
            if (filters[name]) {
              filters[name] = filters[name].map((item) => item.id);

              if (this.filterMode?.[name] === 'AND') {
                filters[name + '_and'] = filters[name];
                delete filters[name];
              }
            }
          });

          multiSelectFilters2D.forEach(({ value: name }) => {
            if (filters[name]) {
              if (this.filterMode?.[name] === 'AND') {
                filters[name + '_or_and'] = filters[name].map((arr) =>
                  arr.map((el) => el.id)
                );
              } else {
                filters[name + '_and_or'] = filters[name].map((arr) =>
                  arr.map((el) => el.id)
                );
              }

              delete filters[name];
            }
          });

          let { types, pageInfo } = await Type.filteredQuery({
            pagination: Pagination.fromPageInfo(this.pageInfo),
            filters,
            typeBody: this.typeBody,
          });

          this.$emit('update', { types, pageInfo });
        },
        {
          filters,
          multiSelectFilters: this.multiSelectFilters,
          multiSelectFilters2D: this.multiSelectFilters2D,
        }
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
        const emptyObj = Filter.mapData(filter.value, filter.defaultValue);
        for (let [key, val] of Object.entries(emptyObj)) {
          this.$set(this.filters, key, val);
        }
      });

      [...unfilteredMultiDataSelect2D].forEach((filter) => {
        const emptyObj = FilterList.mapData(filter.value, filter.defaultValue);
        for (let [key, val] of Object.entries(emptyObj)) {
          this.$set(this.filters, key, val);
        }
      });
    },
    _getMethodFromFilter(methodName, inputName, idx = null) {
      const filterClass = idx == null ? Filter : FilterList;
      return filterClass[methodName](inputName);
    },
    selectFilter(name, target, idx = null) {
      const methodName = this._getMethodFromFilter(
        'selectMethodName',
        name,
        idx
      );
      return this[methodName](target, idx);
    },
    removeFilter(name, target, idx = null) {
      const methodName = this._getMethodFromFilter(
        'removeMethodName',
        name,
        idx
      );
      return this[methodName](target, idx);
    },
    removeFilterGroup(name, idx) {
      this.filters[name].splice(idx, 1);
    },
    changeFilterMode(name) {
      let newMode = this.filterMode[name] === 'AND' ? 'OR' : 'AND';
      this.filterMode[name] = newMode;
      this.search();
    },
    addToFilterList(name) {
      const methodName = FilterList.pushMethodName(name);
      return this[methodName]();
    },
    searchVariableName(value) {
      return Filter.searchVariableName(value);
    },
    stopWatching() {
      if (this.watching === false)
        console.warn("You try to stop, but it's already stopped");
      this.watching = false;
    },
    resumeWatching() {
      if (this.watching === true)
        console.warn('You try to resume, but its not stopped');

      this.watching = true;
    },
    excludeItem(group) {
      return group.filter((item) => this.exclude.indexOf(item.value) === -1);
    },
    getMode(name) {
      return this.filterMode[name];
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
              if (val.length == 0) return false;
              else if (
                val.every((el) => Array.isArray(el) && el.length === 0)
              ) {
                return false;
              }
            } else {
              return val.id && val.id !== null;
            }
          } else {
            switch (typeof val) {
              case 'string':
                return val != '';
            }
          }

          return true;
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
    multiSelectFilters2D() {
      return this.excludeItem(unfilteredMultiDataSelect2D);
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