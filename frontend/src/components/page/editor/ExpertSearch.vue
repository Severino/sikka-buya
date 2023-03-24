<template>
  <div class="catalog-filter-search">
    <h1>{{ $t('editor.expert_search') }}</h1>

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
          :initData="catalog_filter_mixin_initData"
          :pageInfo="pageInfo"
          @update="updateTypes"
          :overwriteFilters="overwriteFilters"
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
              name: 'EditType',
              params: { id: item.id },
              target: '_blank',
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
import CatalogFilter from '../catalog/CatalogFilter.vue';
import SearchField from '../../layout/SearchField.vue';

// mixins
import CatalogFilterMixin from '../../mixins/catalog-filter';

export default {
  mixins: [CatalogFilterMixin('sikka-buya-expert-search-catalog-filters')],
  components: {
    CatalogFilter,
    LabeledInputContainer,
    Pagination,
    List,
    ListItem,
    SearchField,
  },
  data() {
    return {
      text: '',
      error: null,
      types: [],
      pageInfo: { count: 50, page: 0, total: 0, last: 0 },
    };
  },
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


<style lang="scss" scoped>
#text-search {
  margin-bottom: 3 * $padding;
}

p {
  max-width: 512px;
}

button {
  width: 100%;
  margin-bottom: 2 * $padding;
}
</style>