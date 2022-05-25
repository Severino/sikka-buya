<template>
  <div :class="`overview ${this.property}-page`">
    <BackHeader :to="{ name: 'Editor' }" />
    <header>
      <h1>{{ $tc(`property.${propertyName}`) }}</h1>
      <div
        id="create-button"
        class="button"
        @click="create"
        tabindex="1"
        autofocus
        @keydown.enter="create"
      >
        <PlusCircleOutline />
        <span>{{ $t('form.create') }}</span>
      </div>
    </header>

    <SearchField v-model="textFilter" :asyncSearch="search" />

    <List
      @remove="remove"
      :error="listError"
      :loading="loading"
      :items="items"
      :filteredItems="items"
    >
      <ListItem
        v-for="item of items"
        v-bind:key="item.key"
        :id="item.id"
        :disable="deleteButtonActive"
        :to="{
          path: `${item.id}`,
          append: true,
        }"
      >
        <list-color-indicator :item="item" />
        <ListItemCell>{{ item.name }}</ListItemCell>
        <DynamicDeleteButton
          @delete="deleteButtonRemove(item.id)"
          @open="deleteButtonEnable()"
          @cancel="deleteButtonDisable()"
        />
      </ListItem>
    </List>
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
import { camelCase } from 'change-case';
import DeleteButtonMixin from '../mixins/deletebutton';
import ListColorIndicator from '../list/ListColorIndicator.vue';

export default {
  name: 'PersonOverviewPage',
  components: {
    PlusCircleOutline,
    List,
    BackHeader,
    SearchField,
    ListItemIdField,
    ListItem,
    ListItemCell,
    ListColorIndicator,
  },
  mixins: [DeleteButtonMixin],
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
      return 'person';
    },
  },
  data: function () {
    return {
      loading: true,
      items: [],
      listError: '',
      textFilter: '',
      searchId: 0,
      clickable: true,
    };
  },

  methods: {
    async list() {
      Query.raw(
        `{
          person {
            name,
            id,
            color
          }
          }`
      )
        .then((obj) => {
          this.$data.items = obj.data.data.person;
        })
        .catch(() => {
          this.listError = this.$t('error.loading_list');
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
          this.listError = this.$t('error.loading_list');
        })
        .finally(() => {
          this.$data.loading = false;
        });
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
      this.$store.commit('printError', err);
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

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#create-button {
  background-color: $primary-color;
  color: $white;
  // position: absolute;
  right: 0;
  top: 0;
}
</style>
