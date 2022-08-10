<template>
  <div class="catalog-filter-search">
    <h1>Filtersuche</h1>
    <p>
      Mit der Filtersuche können Sie alle im Typenkatalog verfügbaren Typen mit
      sehr detailiert durchsuchen, indem Sie verschiedenste Filter verwenden und
      kombinieren können.
    </p>

    <div class="grid col-2">
      <aside>
        <catalog-filter
          :pageInfo="pageInfo"
          @update="updateTypes"
          :constantFilters="{ excludeFromTypeCatalogue: false }"
          ref="catalogFilter"
        />
      </aside>
      <pagination :pageInfo="pageInfo" @input="updatePagination">
        <List :error="error" :items="types">
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
          </ListItem></List
        ></pagination
      >
    </div>
  </div>
</template>

<script>
import List from '../../layout/List.vue';
import ListItem from '../../layout/ListItem.vue';
import LabeledInputContainer from '../../LabeledInputContainer.vue';
import Pagination from '../../list/Pagination.vue';
import CatalogFilter from './CatalogFilter.vue';

export default {
  components: {
    CatalogFilter,
    LabeledInputContainer,
    Pagination,
    List,
    ListItem,
  },
  data() {
    return {
      error: null,
      types: [],
      pageInfo: { count: 15, page: 0, total: 0, last: 0 },
    };
  },
  methods: {
    updatePagination(pageInfo) {
      this.pageInfo = pageInfo;
    },
    updateTypes(args) {
      const { types, pageInfo } = args;
      this.types = types;
      this.pageInfo = pageInfo;
    },
  },
};
</script>


<style lang="scss">
.catalog-filter-search {
  .pagination {
    align-self: flex-start;
  }
}
</style>

<style lang="scss" scoped>
p {
  max-width: 512px;
}
</style>