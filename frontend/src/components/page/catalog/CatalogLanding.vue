<template>
  <div class="catalog-landing">
    <h1>Typenkatalog</h1>
    <person-explorer />
  </div>
</template>

<script>
import Query from '../../../database/query';
import SearchField from '../../layout/SearchField.vue';
import List from '../../layout/List.vue';
import ListItemCell from '../../layout/list/ListItemCell.vue';
import ListItem from '../../layout/ListItem.vue';
import Row from '../../layout/Row.vue';
import Column from '../../layout/tabs/Column.vue';
import TypeOverview from '../TypeOverview.vue';
import PersonExplorer from './PersonExplorer.vue';
export default {
  components: {
    Column,
    Row,
    List,
    ListItem,
    ListItemCell,
    SearchField,
    TypeOverview,
    PersonExplorer,
  },
  name: 'CatalogLanding',
  data: function () {
    return {
      types: [],
      searchText: '',
      columns: ['projectId', 'material', 'nominal', 'mint'],
    };
  },
  methods: {
    input: function (value) {
      if (value == '') {
        this.types = [];
      }
      this.searchText = value;
    },
    search: function (value) {
      return Query.raw(
        `
            {
                searchType(text: "${value}", excludeFromTypeCatalogue: false) {
                    id
                    projectId
                    mint{name}
                    material {name}
                    nominal{name}
                }
            }
          `
      )
        .then((result) => {
          const data = result.data.data.searchType;

          this.types = data.map((item) => {
            return {
              id: item.id,
              projectId: item.projectId,
              material: item.material.name,
              nominal: item.nominal.name,
              mint: item.mint.name,
            };
          });
        })
        .catch((err) => (this.error = err));
    },
  },
  computed: {
    blocked: function () {
      return Date.now() - this.lastBlockTime < this.blockTime;
    },
    empty: function () {
      return this.searchText == '';
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  align-items: stretch;
  top: 0;
  position: absolute;
  transition: all 0.3s;

  &.empty {
    top: 30%;
  }
}

.catalog-landing {
  flex: 1;
  position: relative;
}
</style>

<style lang="scss">
.catalog-landing .list-item-row {
  padding: $padding;
}

.link {
  color: $primary-color !important;
  font-weight: bold;
  text-decoration: underline;
  padding: $padding 0;
}
</style>
