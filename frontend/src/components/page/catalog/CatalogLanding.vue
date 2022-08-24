<template>
  <div class="catalog-landing">
    <header>
      <h1>{{ $t('routes.Catalog') }}</h1>
      <div class="nav-grid grid">
        <router-link :to="{ name: 'Catalog Ruler Explorer' }">
          <card id="person-explorer-card">
            <template v-slot:header>
              <h2>{{ $t('routes.Catalog Ruler Explorer') }}</h2>
            </template>
            <p>
              <!-- Nulla amet sint nisi excepteur minim voluptate commodo do nulla ea
              duis fugiat. Pariatur esse esse enim aliqua incididunt do ut. Quis
              dolor Lorem do duis sunt sunt adipisicing cillum laborum ad. -->
            </p>
          </card>
        </router-link>

        <router-link :to="{ name: 'Catalog Search' }">
          <card>
            <template v-slot:header>
              <h2>{{ $t('routes.Catalog Search') }}</h2>
            </template>

            <p>
              <!-- Nulla amet sint nisi excepteur minim voluptate commodo do nulla ea
              duis fugiat. Pariatur esse esse enim aliqua incididunt do ut. Quis
              dolor Lorem do duis sunt sunt adipisicing cillum laborum ad. -->
            </p>
          </card>
        </router-link>

        <!-- <big-navigation-button :to="{ name: 'Catalog Text Search' }">
          Volltextsuche
        </big-navigation-button>
        <big-navigation-button :to="{ name: 'Catalog Filter Search' }">
          Filtersuche
        </big-navigation-button> -->
      </div>
    </header>
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
import BigNavigationButton from '../../navigation/BigNavigationButton.vue';
import Card from '../../navigation/Card.vue';
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
    BigNavigationButton,
    Card,
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

<style lang="scss">
.catalog-landing {
  h2 {
    margin-top: 0;
  }

  .card {
    color: $white;
  }
}
</style>

<style lang="scss" scoped>
.nav-grid {
  height: 420px;
  grid-template-columns: 1fr 1fr;
  gap: 3 * $padding;
}

.card {
  // background-color: $white;
  border: $border;
  padding: $big-box-padding;
}
</style>
