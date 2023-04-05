<template>
  <div class="catalog-filter-search">
    <h1>
      <Locale :path="'routes.' + $route.name" />
    </h1>
    <div class="grid col-2">
      <aside>
        <Button
          class="error"
          @click="resetFilters"
          v-if="hasFilters"
        >{{
          $t('catalog.reset_filters')
        }}</Button>
        <search-field
          id="text-search"
          v-model="text"
        />
        <catalog-filter
          :pageInfo="pageInfo"
          :initData="catalog_filter_mixin_initData"
          @update="updateTypes"
          :overwriteFilters="overwriteFilters"
          :constantFilters="{ excludeFromTypeCatalogue: false }"
          ref="catalogFilter"
        />
      </aside>
      <pagination
        :pageInfo="pageInfo"
        @input="updatePagination"
      >
        <List
          :error="error"
          :items="types"
        >
          <ListItem
            v-for="item of types"
            v-bind:key="item.key"
            :id="`list-item-type-${item.id}`"
            :to="{
              name: 'Catalog Entry',
              params: { id: item.id },
            }"
            :class="item.completed ? 'completed' : 'incomplete'"
          >
            {{ item.projectId }}
          </ListItem>
        </List>
      </pagination>
    </div>
  </div>
</template>

<script>
import List from '../../layout/List.vue';
import ListItem from '../../layout/ListItem.vue';
import LabeledInputContainer from '../../LabeledInputContainer.vue';
import Pagination from '../../list/Pagination.vue';
import CatalogFilter from './CatalogFilter.vue';
import SearchField from '../../layout/SearchField.vue';
import catalogFilterMixin from '../../mixins/catalog-filter';
import Locale from '../../cms/Locale.vue';

export default {
  components: {
    CatalogFilter,
    LabeledInputContainer,
    Pagination,
    List,
    ListItem,
    SearchField,
    Locale
  },
  data() {
    return {
      text: '',
      error: null,
      types: [],
      pageInfo: { count: 50, page: 0, total: 0, last: 0 },
    };
  },
  mixins: [catalogFilterMixin('sikka-buya-catalog-filter-search')],
  methods: {
    catalog_filter_mixin_loaded(data, filterMode) {
      if (data.text) {
        this.text = data.text;
        delete data.text;
      }
    },
    updatePagination(pageInfo) {
      this.pageInfo = pageInfo;
    },
    updateTypes(args) {
      const { types, pageInfo } = args;
      this.types = types;
      this.pageInfo = pageInfo;
      this.catalog_filter_mixin_updateActive(this.$refs.catalogFilter);
      this.catalog_filter_mixin_save(this.$refs.catalogFilter, {
        text: this.text,
      });
    },
    resetFilters() {
      this.text = '';
      this.catalog_filter_mixin_reset(this.$refs.catalogFilter);
    },
  },
  computed: {
    hasFilters() {
      return this.catalog_filter_mixin_filterActive || this.text != '';
    },
    overwriteFilters() {
      return this.text == "" ? {} : { plain_text: this.text };
    },
  },
};
</script>


<style lang="scss">
.catalog-filter-search {

  margin-bottom: $page-bottom-spacing;

  .pagination {
    align-self: flex-start;
  }

  .yearOfMint,
  .mint,
  .cursiveScript,
  .procedure,
  .donativ,
  .small {
    grid-column: span 6;
  }
}
</style>

<style lang="scss" scoped>
#text-search {
  margin-bottom: 3 * $padding;
}

p {
  max-width: 512px;
}

.col-2 {
  grid-template-columns: 1fr 2fr;
  gap: $big-padding * 5;
}

aside {
  display: flex;
  flex-direction: column;
}

button {
  margin-bottom: 3 * $padding;
}
</style>