<template>
  <div :class="`overview type-overview`">
    <BackHeader :to="{ name: 'Editor' }" />
    <header>
      <h1>{{ $t('attribute.test') }}</h1>
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
    <SearchField
      ref="search"
      v-model="filter.text"
      :asyncSearch="textFilterChanged"
    />
    <ListFilterContainer
      :filtered="isListFiltered"
      @clearFilters="clearFilters"
    >
      <div id="toggle-group">
        <labeled-property
          v-for="name of evalFilter"
          :key="'toggle-filter-' + name"
          :label="$tc('property.' + name)"
        >
          <three-way-toggle
            :value="filter[name]"
            @input="filterChanged(name, $event)"
          />
        </labeled-property>
      </div>
      <div id="toggle-group">
        <labeled-property
          v-for="name of toggleFilter"
          :key="'toggle-filter-' + name"
          :label="$tc('property.' + name)"
        >
          <three-way-toggle
            :value="filter[name]"
            @input="filterChanged(name, $event)"
          />
        </labeled-property>
      </div>

      <labeled-property
        v-for="name of objectFilter"
        :key="'obj-filter-' + name"
        :label="$tc('property.' + name)"
      >
        <DataSelectField
          v-if="name == 'caliph'"
          :value="filter[name]"
          attribute="name"
          table="person"
          queryCommand="searchPersonsWithRole"
          :queryParams="['id', { role: ['id', 'name'] }, 'name']"
          :additionalParameters="{ include: ['caliph'] }"
          @input="filterChanged(name, $event)"
        />
        <div v-else-if="name == 'coin_mark'">
          <data-select-field
            :value="filter[name]"
            attribute="name"
            table="coinMark"
            @input="filterChanged(name, $event)"
          />
        </div>
        <DataSelectField
          v-else
          :value="filter[name]"
          attribute="name"
          :table="name"
          @input="filterChanged(name, $event)"
        />
      </labeled-property>
    </ListFilterContainer>

    <pagination-control :value="pageInfo" @input="updatePagination" />

    <List :error="error" :items="list" :loading="loading">
      <ListItem
        v-for="item of items"
        v-bind:key="item.key"
        :to="{
          name: 'EditType',
          params: { id: item.id },
        }"
        :class="item.completed ? 'completed' : 'incomplete'"
      >
        <ListItemCell>
          {{ item.projectId }}
        </ListItemCell>
        <CompletedToggle
          :value="item.completed"
          @input="changeCompleteState($event, item)"
        />
        <CompletedToggle
          :value="item.reviewed"
          @input="changeReviewedState($event, item)"
        />
        <!-- <DynamicDeleteButton @click="remove(item.id)" />-->
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
import ListItem from '../layout/ListItem.vue';
import CompletedToggle from '../layout/buttons/CompletedToggle.vue';
import DynamicDeleteButton from '../layout/DynamicDeleteButton.vue';
import ListItemIdField from '../layout/list/ListItemIdField.vue';
import ListItemCell from '../layout/list/ListItemCell.vue';
import ListFilterContainer from '../layout/list/ListFilterContainer.vue';
import ButtonGroup from '../forms/ButtonGroup.vue';
import AxiosHelper from '@/utils/AxiosHelper.js';
import ReviewedToggle from '../layout/buttons/ReviewedToggle.vue';
import Button from '../layout/buttons/Button.vue';
import Row from '../layout/Row.vue';
import PaginationControl from '../list/PaginationControl.vue';
import Checkbox from '../forms/Checkbox.vue';
import DataSelectField from '../forms/DataSelectField.vue';
import LabeledProperty from '../display/LabeledProperty.vue';
import ThreeWayToggle from '../forms/ThreeWayToggle.vue';
import { camelCase } from 'change-case';

const defaultFilters = {
  text: '',
  completed: null,
  reviewed: null,
  exclude_from_type_catalogue: null,
  exclude_from_map_app: null,
  mint_uncertain: null,
  year_uncertain: null,
  cursive_script: null,
  donativ: null,
  nominal: { id: null },
  material: { id: null },
  caliph: { id: null },
  mint: { id: null },
  coin_mark: { id: null },
};

export default {
  name: 'TypeOverviewPage',
  components: {
    PlusCircleOutline,
    List,
    BackHeader,
    SearchField,
    ListItem,
    CompletedToggle,
    DynamicDeleteButton,
    ListItemIdField,
    ListItemCell,
    ListFilterContainer,
    ButtonGroup,
    ReviewedToggle,
    Button,
    Row,
    PaginationControl,
    Checkbox,
    DataSelectField,
    LabeledProperty,
    ThreeWayToggle,
  },
  mounted: function () {
    let filters = localStorage.getItem('type-list-filter');
    if (filters) {
      try {
        let filterObj = JSON.parse(filters);
        Object.assign(this.$data.filter, filterObj);
      } catch (e) {
        console.error('Could not parse filters.');
      }
    }

    this.pageInfo.count = localStorage.getItem('pagination-count') || 15;
    this.updateTypeList();
    this.$refs.search.$el.querySelector('input').focus();
  },
  computed: {
    isListFiltered: function () {
      let filtered = false;
      for (let [key, val] of Object.entries(this.filter)) {
        if (defaultFilters[key] === undefined) {
          console.warn('Filter is not implemented in defaults!', key);
          continue;
        }

        if (val != null && typeof val === 'object') {
          if (val.id && val.id >= 0) {
            filtered = true;
            break;
          }
        } else {
          if (defaultFilters[key] != val) {
            filtered = true;
            break;
          }
        }
      }

      return filtered;
    },
    list: function () {
      return this.$data.items;
    },
  },
  data: function () {
    return {
      loading: false,
      items: [],
      countList: [10, 25, 50],
      pageInfo: {
        count: 20,
        page: 0,
        last: 0,
        total: 0,
      },
      error: '',
      filter: {
        text: '',
        completed: null,
        reviewed: null,
        exclude_from_type_catalogue: null,
        exclude_from_map_app: null,
        mint_uncertain: null,
        year_uncertain: null,
        cursive_script: null,
        donativ: null,
        nominal: { id: null },
        material: { id: null },
        caliph: { id: null },
        mint: { id: null },
        coin_mark: { id: null },
      },
      objectFilter: ['mint', 'material', 'nominal', 'caliph', 'coin_mark'],
      toggleFilter: [
        'exclude_from_type_catalogue',
        'exclude_from_map_app',
        'mint_uncertain',
        'year_uncertain',
        'cursive_script',
        'donativ',
      ],
      evalFilter: ['completed', 'reviewed'],
    };
  },
  methods: {
    clearFilters() {
      this.filter.text = '';

      this.toggleFilter.forEach((name) => {
        if (!this.filter[name]) console.warn('No such filter found', name);
        else this.filter[name] = null;
      });

      this.objectFilter.forEach((name) => {
        if (!this.filter[name]) console.warn('No such filter found', name);
        else this.filter[name] = { id: null };
      });

      this.updateTypeList();
      this.filtersChanged();
    },
    getEvalFilters() {
      let activeFilter = [];
      this.evalFilter.forEach((name) => {
        if (this.filter[name] != null) {
          activeFilter.push(`${camelCase(name)}: ${this.filter[name]}`);
        }
      });
      return activeFilter.join('\n');
    },
    getToggleFilters() {
      let activeFilter = [];
      this.toggleFilter.forEach((name) => {
        if (this.filter[name] != null) {
          activeFilter.push(`${camelCase(name)}: ${this.filter[name]}`);
        }
      });
      return activeFilter.join('\n');
    },
    getObjectFilters() {
      let activeFilter = [];
      this.objectFilter.forEach((name) => {
        if (this.filter[name] != null && this.filter[name]?.id != null) {
          activeFilter.push(`${camelCase(name)}: ${this.filter[name].id}`);
        }
      });
      return activeFilter.join('\n');
    },
    updateTypeList: async function () {
      if (this.loading) return;

      this.loading = true;
      Query.raw(
        `
    {
      modGetTypes(
          pagination: {
          count:${this.pageInfo.count}, page:${this.pageInfo.page}
          },
          filters: {
            text: "${this.filter.text}"
            ${this.getObjectFilters()}
            ${this.getToggleFilters()}
             ${this.getEvalFilters()}
            
          }
        ) {
        types {
            id
            projectId
            completed
            reviewed
        }
        pageInfo {
          page
          count
          total
          last
        }
      }
    }`
      )
        .then((result) => {
          if (AxiosHelper.ok(result)) {
            this.loading = false;
            let data = result.data.data.modGetTypes;

            if (data) {
              const lastPage = Math.floor(
                data.pageInfo.total / (data.pageInfo.count || 1)
              );

              if (this.pageInfo.page > lastPage) {
                let pageInfo = data.pageInfo;
                pageInfo.page = lastPage;
                this.pageInfo = pageInfo;
              } else {
                this.$data.items = data.types;
                if (
                  !(
                    this.pageInfo.page === data.pageInfo.page &&
                    this.pageInfo.total === data.pageInfo.total &&
                    this.pageInfo.current === data.pageInfo.current &&
                    this.pageInfo.last === data.pageInfo.last
                  )
                )
                  this.pageInfo = data.pageInfo;
                this.error = '';
              }
            } else {
              this.error = 'Keine Daten wurden zurückgegeben.';
            }
          } else {
            this.error = AxiosHelper.getErrors(result).join('\n');
          }
        })
        .catch((e) => {
          console.error(e);
          this.error = this.$t('error.loading_list');
        })
        .finally(() => {
          this.$data.loading = false;
          // this.loading = false;
        });
    },
    create() {
      this.$router.push({
        name: `TypeCreationPage`,
      });
    },
    changeReviewedState(state, item) {
      Query.raw(
        `
        mutation{
          setTypeReviewed(id: ${item.id}, reviewed: ${state})
        }
      `
      )
        .then((result) => {
          if (result.status >= 200 && result.status <= 200) {
            item.reviewed = result.data.data.setTypeReviewed;
          }
        })
        .catch((err) => {
          this.error = err;
        });
    },
    changeCompleteState(state, item) {
      Query.raw(
        `
        mutation{
          setTypeComplete(id: ${item.id}, completed: ${state})
        }
      `
      )
        .then((result) => {
          if (result.status >= 200 && result.status <= 200) {
            item.completed = result.data.data.setTypeComplete;
          }
        })
        .catch((err) => {
          this.error = err;
        });
    },
    remove(id) {
      Query.raw(
        `mutation{
  removeCoinType(id: ${id})
}`
      )
        .then(() => {
          const idx = this.$data.items.findIndex((item) => item.id == id);
          if (idx != -1) this.$data.items.splice(idx, 1);
        })
        .catch((answer) => {
          console.dir(
            answer.response.data.errors.map((item) => item.message).join('\n')
          );
          // this.error =
          // console.error(err);
        });
    },
    filterChanged(name, val) {
      this.filter[name] = val;
      this.filtersChanged();
    },
    updatePagination(val) {
      this.pageInfo = val;
      this.updateTypeList();
      localStorage.setItem('pagination-count', this.pageInfo.count);
    },
    completedChanged(val) {
      this.filter.completed = val;
      this.filtersChanged();
    },
    reviewedChanged(val) {
      this.filter.reviewed = val;
      this.filtersChanged();
    },
    mintChanged(val) {
      this.filter.mint = val;
      this.filtersChanged();
    },
    async textFilterChanged() {
      await this.filtersChanged();
    },
    async filtersChanged() {
      localStorage.setItem('type-list-filter', JSON.stringify(this.filter));
      await this.updateTypeList();
    },
  },
};
</script>

<style lang="scss">
.type-overview .labeled-property .label {
  margin-bottom: $padding/2;
}

.type-overview .list-item-row {
  height: 44px;
}
</style>

<style lang="scss" scoped>
@import '@/scss/_import.scss';
.list {
  display: flex;
  flex-direction: column;
  margin: $padding 0;
  // padding: $padding;
  overflow: hidden;
  background-color: rgb(78, 78, 78);

  background-color: whitesmoke;
  border-radius: 3px;

  box-shadow: inset 1px 2px 5px rgba(0, 0, 0, 0.1);
}

.list-item {
  align-items: center;
  display: flex;

  transition: background-color 0.15s;

  &.completed {
    background-color: rgb(243, 242, 242);
  }

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

.overview > * {
  margin-bottom: $padding;
}

#toggle-group {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  justify-items: center;
  text-align: center;
  align-items: flex-end;
  margin: 40px 0;

  @include media-phone {
    grid-template-columns: 1fr 1fr 1fr;
  }
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
