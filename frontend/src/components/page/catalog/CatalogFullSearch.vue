<template>
  <div class="catalog-full-search">
    <Column class="container" :class="{ empty: empty }">
      <div class="search">
        <Column>
          <h2>Typensuche (Volltext)</h2>
          <p class="emph">
            Beachte: Da dies vorerst als Bearbeiter-Tool gedacht ist, werden
            alle Typen angezeigt ungeachtet davon, ob 'Nicht für Typenkatalog"
            angegeben ist!
          </p>
          <row>
            <search-field
              v-model="searchText"
              mode="button"
              style="flex: 10"
              :asyncSearch="search"
            />
          </row>
        </Column>
      </div>

      <pagination :pageInfo="pageInfo" @input="pageChanged">
        <List :items="results">
          <list-item
            v-for="{ preview, type } of results"
            :key="'type-search-result-' + type.id"
            :to="{ name: 'CatalogEntry', params: { id: type.id } }"
          >
            <div class="result-id">{{ type.projectId }}</div>
            <pre class="result-preview" v-html="preview"></pre>
          </list-item>
        </List>
      </pagination>
    </Column>
  </div>
</template>

<script>
import Query from '../../../database/query';
import PageInfo from '../../../models/pageinfo';
import SearchField from '../../layout/SearchField.vue';
import List from '../../layout/List.vue';
import ListItemCell from '../../layout/list/ListItemCell.vue';
import ListItem from '../../layout/ListItem.vue';
import Row from '../../layout/Row.vue';
import Column from '../../layout/tabs/Column.vue';
import PaginationControl from '../../list/PaginationControl.vue';
import keeper from '../../mixins/keeper';
import Pagination from '../../list/Pagination.vue';
export default {
  components: {
    Column,
    Row,
    List,
    ListItem,
    ListItemCell,
    SearchField,
    PaginationControl,
    Pagination,
  },
  name: 'CatalogFullSearch',
  mixins: [keeper(['searchText'])],
  data: function () {
    return {
      error: '',
      results: [],
      searchText: '',
      columns: ['projectId'],
      pageInfo: {
        count: 20,
        page: 0,
        last: 0,
        total: 0,
      },
    };
  },
  methods: {
    applyKeep(options) {
      if (options.searchText) {
        this.search(options.searchText);
      }
    },
    search: function () {
      this.keep(this.$data);
      return Query.raw(
        `
            query FullSearch($text: String, $pagination: Pagination){
              fullSearchOnTypes(text: $text, pagination:$pagination) {
                pagination {
                  count
                  page
                  total
                  last
                }
                results{
                  type {
                    id
                    projectId
                  }
                  preview
                }
                
              }
            }
          `,
        {
          text: this.searchText,
          pagination: { count: this.pageInfo.count, page: this.pageInfo.page },
        }
      )
        .then((response) => {
          const result = response.data.data.fullSearchOnTypes;
          this.pageInfo = result.pagination;
          this.results = result.results;
        })
        .catch((err) => (this.error = err));
    },
    pageChanged(pageInfo) {
      this.pageInfo = pageInfo;
      this.search();
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
// .container {
//   width: 100%;
//   align-items: stretch;
//   top: 0;
//   position: absolute;
//   transition: all 0.3s;

//   &.empty {
//     top: 30%;
//   }
// }

// .catalog-landing {
//   flex: 1;
//   position: relative;
// }
pre {
  white-space: pre-wrap;
}

.result-id {
  padding: $padding;
}

.result-preview {
  padding: $padding;
  color: black;
  background-color: whitesmoke;
  margin: 0;

  // box-shadow: inset $strong-shadow;
}
</style>

<style lang="scss">
.catalog-full-search .list-item-row {
  padding: 0;
}

.catalog-full-search .list-item-row {
  display: block;
}
</style>
