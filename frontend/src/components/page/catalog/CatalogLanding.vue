<template>
  <div class="catalog-landing">
    <Column class="container" :class="{ empty: empty }">
      <div class="search">
        <Column>
          <h2>Typensuche</h2>
          <search-field :value="searchText" @input="input" :asyncSearch="search" />
        </Column>
      </div>

      <List
        v-if="searchText"
        :properties="['id', 'projectId', 'mint', 'material', 'nominal']"
        :items="types"
      >
        <list-item
          v-for="type of types"
          :key="'type-search-result-' + type.id"
          @click="
            $router.push({ name: 'CatalogEntry', params: { id: type.id } })
          "
        >
          <list-item-cell
            v-for="prop of Object.values(type)"
            :key="'type-search-result-' + type.id + '-' + prop"
          >
            {{ prop }}
          </list-item-cell>
        </list-item>
      </List>

      <!-- <div class="list">
        <ul>
          <li v-for="type of types" :key="'type-' + type.id">
            <router-link
              :to="{ name: 'CatalogEntry', params: { id: type.id } }"
            >
              <row>
                <span>{{ type.projectId }}</span>
                <span>{{ type.mint.name }}</span>
                <span>{{ type.material.name }}</span>
                <span>{{ type.nominal.name }}</span>
              </row>
            </router-link>
          </li>
        </ul>
      </div> -->
    </Column>
  </div>
</template>

<script>
import Query from "../../../database/query";
import SearchField from "../../layout/SearchField.vue";
import List from "../../layout/List.vue";
import ListItemCell from "../../layout/list/ListItemCell.vue";
import ListItem from "../../layout/ListItem.vue";
import Row from "../../layout/Row.vue";
import Column from "../../layout/tabs/Column.vue";
export default {
  components: { Column, Row, List, ListItem, ListItemCell, SearchField },
  name: "CatalogLanding",
  data: function () {
    return {
      types: [],
      searchText: "",
    };
  },
  methods: {
    input: function (value) {
      console.log("value")
      if(value == ""){
        console.log("CLEAR")
        this.types = []
      }
      this.searchText = value;
    },
    search: function (value) {
      console.log("SEARCH", value)
      return Query.raw(
        `
            {
                searchTypes(text: "${value}") {
                  
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
          const data = result.data.data.searchTypes;

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
        .catch((err) => (this.error = err))
    },
  },
  computed: {
    blocked: function () {
      return Date.now() - this.lastBlockTime < this.blockTime;
    },
    empty: function () {
      return this.searchText == "";
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