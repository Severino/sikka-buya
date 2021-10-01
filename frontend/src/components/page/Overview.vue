<template>
  <div :class="`overview ${this.property}-page`">
    <BackHeader :to="{ name: 'Editor' }" />
    <h1>{{ $tc(`property.${propertyName}`) }}</h1>
    <section>
      <div
        class="button"
        @click="create"
        tabindex="1"
        autofocus
        @keydown.enter="create"
      >
        <PlusCircleOutline />
        <span>{{ $t('form.create') }}</span>
      </div>

      <SearchField :value="textFilter" @input="searchChanged" />

      <List
        @remove="remove"
        :error="error"
        :loading="loading"
        :items="items"
        :filteredItems="items"
      >
        <ListItem
          v-for="item of items"
          v-bind:key="item.key"
          :id="item.id"
          :to="{
            path: `${item.id}`,
            append: true,
          }"
        >
          <ListItemCell>{{ item.name }}</ListItemCell>
          <DynamicDeleteButton @click="remove(item.id)" />
        </ListItem>
      </List>
    </section>
  </div>
</template>

<script>
import PlusCircleOutline from 'vue-material-design-icons/PlusCircleOutline';

import List from '../layout/List.vue';
import Query from '../../database/query.js';
import BackHeader from '../layout/BackHeader.vue';
import SearchField from '../layout/SearchField.vue';
import ListItemIdField from '../layout/list/ListItemIdField.vue';

import ListItemCell from '../layout/list/ListItemCell.vue';
import ListItem from '../layout/ListItem.vue';
import DynamicDeleteButton from '../layout/DynamicDeleteButton.vue';
import { camelCase } from 'change-case';

export default {
  name: 'OverviewPage',
  components: {
    PlusCircleOutline,
    List,
    BackHeader,
    SearchField,
    ListItemIdField,
    ListItem,
    ListItemCell,
    DynamicDeleteButton,
  },
  created: function () {
    this.list();
  },
  props: {
    query: String,
    overridePropertyName: String,
    overrideProperty: String,
    createPage: String,
  },
  computed: {
    propertyName: function () {
      return this.overridePropertyName
        ? this.overridePropertyName
        : this.property;
    },
    queryName: function () {
      return this.query ? this.query : camelCase(this.property);
    },
    property: function () {
      return this.overrideProperty
        ? this.overrideProperty
        : this.$route.params.property.toLowerCase();
    },
  },
  data: function () {
    return {
      loading: true,
      items: [],
      error_id: 0,
      error: '',
      textFilter: '',
      searchId: 0,
    };
  },

  methods: {
    list() {
      new Query(this.queryName)
        .list(['id', 'name'])
        .then((obj) => {
          this.$data.items = obj.data.data[this.queryName];
        })
        .catch(() => {
          this.error = this.$t('error.loading_list');
        })
        .finally(() => {
          this.$data.loading = false;
        });
    },
    search() {
      let queryCommand = `search${
        this.queryName[0].toUpperCase() + this.queryName.substr(1)
      }`;
      Query.raw(
        `{
            ${queryCommand}
            (text: "${this.textFilter}"){
              id, name
            }
          }`
      )
        .then((obj) => {
          this.$data.items = obj.data.data[queryCommand];
        })
        .catch((e) => {
          console.err('Could not search', e);
          this.error = this.$t('error.loading_list');
        })
        .finally(() => {
          this.$data.loading = false;
        });
    },
    searchChanged(val) {
      this.textFilter = val;
      let searchId = ++this.searchId;
      setTimeout(() => {
        if (this.searchId == searchId) {
          if (this.textFilter === '') this.list();
          else {
            this.search();
          }
        }
      }, 500);
    },
    create() {
      if (this.createPage) {
        this.$router.push({ name: this.createPage });
      } else {
        this.$router.push({
          path: `${camelCase(this.property)}/create`,
        });
      }
    },
    remove(id) {
      new Query(this.queryName)
        .delete(id)
        .then((answer) => {
          const idx = this.$data.items.findIndex((item) => item.id == id);
          if (idx != -1) this.$data.items.splice(idx, 1);
        })
        .catch((err) => {
          this.displayError(this.$t('error.delete_list_item_prevented'));
          console.error(err);
        });
    },
    displayError(err) {
      this.error_id++;
      let current_id = this.error_id;
      this.error = err;

      // Delete the error message if its the same message after X seconds.
      setTimeout(() => {
        if ((this.error_id = current_id)) {
          this.error = '';
        }
      }, 3000);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/_import.scss';
.list {
  display: flex;
  flex-direction: column;
  margin: $padding 0;
  // padding: $padding;
  overflow: hidden;
  background-color: whitesmoke;
  border-radius: 3px;

  box-shadow: inset 1px 2px 5px rgba(0, 0, 0, 0.1);
}

.list-item {
  align-items: center;
  display: flex;

  transition: background-color 0.15s;

  > :first-child {
    flex: 1;
  }
}

.edit {
  display: flex;
  height: 100%;
  flex: 1;

  background-color: whitesmoke;
  @include interactive();
  margin-right: $padding;
  padding: $padding $padding;

  &:hover {
    background-color: gray;
  }
}

.button {
  @include interactive();
  display: flex;
  align-items: center;
  padding: $padding;

  border-radius: $border-radius;

  > * {
    margin-right: $padding;
  }
}

section > * {
  margin-bottom: $padding;
}
</style>
