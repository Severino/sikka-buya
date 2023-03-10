<template>
  <div class="catalog-filters">
    <template v-for="input of filteredInput">
      <labeled-input-container
        v-if="input.type === 'text'"
        :key="`${input.name}-text`"
        :label="input.label"
        :class="[input.name]"
        class="input-wrapper"
      >
        <input type="text" v-model="filters[input.name]" />
      </labeled-input-container>

      <labeled-input-container
        v-else-if="input.type === 'number'"
        :key="`${input.name}-number`"
        :label="input.label"
        :class="[input.name]"
        class="input-wrapper"
      >
        <input type="number" v-model="filters[input.name]" />
      </labeled-input-container>

      <labeled-input-container
        v-else-if="input.type === 'button-group'"
        :key="`${input.name}-button-group`"
        :label="input.label"
        :class="[input.name]"
        class="input-wrapper"
      >
        <radio-button-group
          :id="input.name"
          :labels="input.labels"
          :options="input.options"
          :unselectable="true"
          v-model="filters[input.name]"
        />
      </labeled-input-container>

      <labeled-input-container
        v-else-if="input.type === 'three-way'"
        :key="`${input.name}-three-way`"
        :label="input.label"
        :class="[input.name]"
        class="input-wrapper"
      >
        <three-way-toggle
          v-model="filters[input.name]"
          :invert="input.invert"
        />
      </labeled-input-container>

      <labeled-input-container
        v-else-if="input.type === 'multi-select'"
        :label="input.label"
        :class="[input.name]"
        :key="`${input.name}-multi-select`"
        class="multi-select-wrapper"
      >
        <multi-data-select
          :active="filters[input.name]"
          :additionalParameters="input.additionalParameters"
          :allowModeChange="input.allowModeChange"
          :attribute="input.attribute"
          :disableRemoveButton="true"
          :displayTextCallback="input.displayTextCallback"
          :mode="input.mode"
          :queryCommand="input.queryCommand"
          :queryParams="input.queryParams"
          :table="input.name"
          :text="input.text"
          v-model="filters[searchVariableName(input.name)]"
          @select="(el) => selectFilter(input.name, el)"
          @remove="(el) => removeFilter(input.name, el)"
          @change-mode="() => dataSelectToggled(input)"
          @dynamic-change="() => $emit('dynamic-change')"
        />
      </labeled-input-container>
      <labeled-input-container
        v-else-if="input.type === 'multi-select-2d'"
        :label="input.label"
        :class="[input.name]"
        :key="`${input.name}-multi-select-2d`"
        class="multi-select-wrapper"
      >
        <multi-data-select-2-d
          :active="filters[input.name]"
          :input="input"
          :mode="input.mode"
          @add="() => addToFilterList(input.name)"
          @select="(value, idx) => selectFilter(input.name, value, idx)"
          @remove="(el, idx) => removeFilter(input.name, el, idx)"
          @dynamic-change="() => $emit('dynamic-change')"
          @remove-group="(idx) => removeFilterGroup(input.name, idx)"
          @change-mode="() => dataSelectToggled(input)"
        />
      </labeled-input-container>
      <error-box
        v-else
        :key="input.name"
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
import RadioButtonGroup from '../../forms/RadioButtonGroup.vue';
import { RequestGuard } from '../../../utils/Async.mjs';
import Type from '../../../utils/Type';
import PageInfo, { Pagination } from '../../../models/pageinfo';
import ErrorBox from '../system/ErrorBox.vue';
import MultiDataSelect2D from '../../forms/MultiDataSelect2D.vue';
import Mode from '../../../models/Mode';

function addType(arr, typeName) {
  arr.forEach((obj) => (obj.type = typeName));
}

const textFilters = [
  {
    label: 'sikka:būya-ID',
    name: 'projectId',
    order: -10,
  },
  {
    label: 'Treadwell-ID',
    name: 'treadwellId',
    order: -9,
  },
  {
    label: 'Prägejahr',
    name: 'yearOfMint',
    order: -3,
  },
];
addType(textFilters, 'text');

const unfilteredNumberFilters = [];
addType(unfilteredNumberFilters, 'number');

const unfilteredButtonGroupFilters = [
  {
    label: 'Herstellungsart',
    name: 'procedure',
    options: ['pressed', 'cast'],
    labels: ['geprägt', 'gegossen'],
    order: 3,
  },
];
addType(unfilteredButtonGroupFilters, 'button-group');

const unfilteredThreeWayFilters = [
  {
    label: 'kursive Schrift',
    name: 'cursiveScript',
    order: 8,
  },
  {
    label: 'Geschenkmünze',
    name: 'donativ',
    order: 4,
  },
  {
    label: 'kleine Münze',
    name: 'small',
    order: 8.5,
  },
  {
    label: 'Jahr sicher',
    name: 'yearUncertain',
    invert: true,
    order: 10,
  },
  {
    label: 'Ort sicher',
    name: 'mintUncertain',
    invert: true,
    order: 9,
  },
];
addType(unfilteredThreeWayFilters, 'three-way');

let unfilteredMultiSelectFilters = [
  {
    label: 'Material',
    name: 'material',
    order: 0,
    mode: Mode.Or,
  },
  {
    label: 'Prägeort',
    name: 'mint',
    order: -5,
    mode: Mode.Or,
  },
  {
    label: 'Nominal',
    name: 'nominal',
    order: 3,
    mode: Mode.Or,
  },
  {
    label: 'Kalif',
    name: 'caliph',
    mode: Mode.Or,
    attribute: 'shortName',
    queryParams: ['id', 'shortName'],
    order: 5.8,
  },
  {
    label: 'Thronfolger d. Kalifen',
    name: 'heir',
    mode: Mode.Or,
    attribute: 'shortName',
    queryCommand: 'searchPersonsWithRole',
    queryParams: ['id', 'name', 'shortName', { role: ['id', 'name'] }],
    additionalParameters: {
      include: ['heir'],
    },
    order: 5.8,
  },
  {
    label: 'sonstige Personen',
    name: 'otherPerson',
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
    mode: Mode.And,
  },
  {
    label: 'Herrschertitel',
    name: 'title',
    order: 7,
    mode: Mode.And,
    allowModeChange: true,
  },
  {
    label: 'Ehrennamen',
    name: 'honorific',
    order: 8,
    mode: Mode.And,
    allowModeChange: true,
  },
  {
    label: 'Herrscher',
    name: 'ruler',
    queryCommand: 'searchPersonsWithoutRole',
    queryParams: ['id', 'name', 'shortName', { dynasty: ['id', 'name'] }],
    displayTextCallback: function (search) {
      let txt = search.shortName || search.name;
      if (search?.dynasty?.name) txt = `${txt} (${search.dynasty.name})`;
      return txt;
    },
    order: 5.5,
    allowModeChange: true,
    mode: Mode.And,
  },
];
addType(unfilteredMultiSelectFilters, 'multi-select');

const unfilteredMultiDataSelect2D = [
  {
    label: 'Münz- und Beizeichen',
    name: 'coinMark',
    order: 5,
    mode: Mode.And,
  },
  {
    label: 'besondere Einzelworte, Formeln, Koranverse',
    name: 'coinVerse',
    order: 5,
    mode: Mode.And,
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
    [item.name]: item.defaultValue == null ? null : item.defaultValue,
  });
});

let filterMode = {};

unfilteredMultiSelectFilters.forEach((item) => {
  const filter = new Filter(item.name);
  filterData = Object.assign(filterData, filter.mapData(item.defaultValue));
  filterMethods = Object.assign(filterMethods, filter.mapMethods());
  filterMode[item.name] = item.mode ? item.mode : Mode.And;
  item.filter = filter;
});

unfilteredMultiDataSelect2D.forEach((item) => {
  const filter = new FilterList(item.name);
  console.log(filterData);

  filterData = Object.assign(filterData, filter.mapData([[]]));
  filterMethods = Object.assign(filterMethods, filter.mapMethods());
  filterMode[item.name] = item.mode ? item.mode : Mode.And;
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
    RadioButtonGroup,
    ErrorBox,
    MultiDataSelect2D,
  },
  mixins: [Mode.mixin()],
  props: {
    initData: Object,
    forceAll: Boolean,
    pageInfo: Object,
    additionalQuery: {
      type: String,
    },
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
  mounted() {
    this.searchRequestGuard = new RequestGuard(this.searchCallback.bind(this));
    if (this.initData) {
      unfilteredMultiSelectFilters.forEach((input) => {
        if (this.initData[input.name]) {
          input.mode = this.initData[input.name].mode || input.mode;
          this.initData[input.name] = this.initData[input.name].value || [];
        }
      });

      unfilteredMultiDataSelect2D.forEach((input) => {
        if (this.initData[input.name]) {
          input.mode = this.initData[input.name].mode || input.mode;
          this.initData[input.name] = this.initData[input.name].value || [[]];
        }
      });

      console.log(this.initData.donativ);
      this.filters = Object.assign({}, this.filters, this.initData);
    }
  },
  methods: {
    ...filterMethods,
    setFilter(key, val) {
      this.filters[key] = val;
    },
    dataSelectToggled(input) {
      this.toggleMode(input);
      this.$emit('toggled');
    },
    async searchCallback({
      filters,
      multiSelectFilters,
      multiSelectFilters2D,
    } = {}) {
      this.$emit('loading', true);

      multiSelectFilters.forEach(({ name: name }) => {
        if (filters[name]) {
          filters[name] = filters[name].map((item) => item.id);

          if (this.filterMode?.[name] === 'AND') {
            filters[name + '_and'] = filters[name];
            delete filters[name];
          }
        }
      });

      multiSelectFilters2D.forEach(({ name: name }) => {
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

      let types = [],
        pageInfo = this.pageInfo;

      if (this.forceAll) {
        while (
          pageInfo.total === undefined ||
          pageInfo.page * (pageInfo.count + 1) < pageInfo.total
        ) {
          let { types: nextTypes, pageInfo: nextPageInfo } =
            await Type.filteredQuery(
              {
                pagination: Pagination.fromPageInfo(pageInfo),
                filters,
                typeBody: this.typeBody,
              },
              true
            );

          pageInfo = nextPageInfo;
          pageInfo.page++;
          types.push(...nextTypes);
        }
      } else {
        ({ types, pageInfo } = await Type.filteredQuery(
          {
            pagination: Pagination.fromPageInfo(this.pageInfo),
            filters,
            typeBody: this.typeBody,
          },
          true
        ));
      }

      this.$emit('update', { types, pageInfo });
      this.$emit('loading', false);
    },
    async search() {
      const filters = Object.assign(
        {},
        this.activeFilters,
        this.constantFilters,
        this.overwriteFilters
      );

      await this.searchRequestGuard.exec({
        filters,
        multiSelectFilters: this.multiSelectFilters,
        multiSelectFilters2D: this.multiSelectFilters2D,
      });
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
        this.$set(this.filters, item.name, item.defaultValue || null);
      });

      [...unfilteredMultiSelectFilters].forEach((filter) => {
        const emptyObj = Filter.mapData(filter.name, filter.defaultValue);
        for (let [key, val] of Object.entries(emptyObj)) {
          this.$set(this.filters, key, val);
        }
      });

      [...unfilteredMultiDataSelect2D].forEach((filter) => {
        const emptyObj = FilterList.mapData(filter.name, filter.defaultValue);
        for (let [key, val] of Object.entries(emptyObj)) {
          this.$set(this.filters, key, val);
        }
      });

      this.search();
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
      let newMode =
        this.filterMode[name].toLowerCase() === 'and' ? 'or' : 'and';
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
      return group.filter((item) => this.exclude.indexOf(item.name) === -1);
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
    filtersActive() {
      return Object.keys(this.activeFilters).length > 0;
    },
    filteredInput() {
      return this.inputs.filter(
        (item) => this.exclude.indexOf(item.name) === -1
      );
    },
    multiSelectFilters() {
      return this.excludeItem(unfilteredMultiSelectFilters);
    },
    multiSelectFilters2D() {
      return this.excludeItem(unfilteredMultiDataSelect2D);
    },
    storageString() {
      let storage = {};
      let activeFilters = this.activeFilters;

      [
        ...textFilters,
        ...unfilteredThreeWayFilters,
        ...unfilteredButtonGroupFilters,
        ...unfilteredNumberFilters,
      ].forEach((item) => {
        if (activeFilters[item.name] != null) {
          storage[item.name] = activeFilters[item.name];
        }
      });

      [...unfilteredMultiSelectFilters, ...unfilteredMultiDataSelect2D].forEach(
        (filter) => {
          storage[filter.name] = {
            mode: filter.mode || Mode.And,
            value: activeFilters[filter.name] || [],
          };
        }
      );

      return JSON.stringify(storage);
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

.input-wrapper {
  grid-column: span 3;
}

.multi-select-wrapper {
  grid-column: span 6;
}
</style>