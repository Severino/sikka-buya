<template>
  <div :class="`overview type-page`">
    <BackHeader :to="{ name: 'Editor' }" />
    <h1>{{ $t('attribute.test') }}</h1>

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

    <SearchField
      ref="search"
      v-model="filter.text"
      @input="textFilterChanged"
    />
    <ListFilterContainer
      :filtered="isListFiltered"
      @clearFilters="clearFilters"
    >
      <checkbox
        label="Erledigt"
        id="completed_checkbox"
        :value="filter.completed"
        @input="completedChanged"
      />
      <checkbox
        label="Geprüft"
        id="reviewed_checkbox"
        :value="filter.reviewed"
        @input="reviewedChanged"
      />
      <!-- <data-select-field :value="" /> -->
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
        <reviewed-toggle
          :value="item.reviewed"
          @input="changeReviewedState($event, item)"
        />
        <!-- <DynamicDeleteButton @click="remove(item.id)" /> -->
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
  watch: {
    filter: {
      handler(val) {
        this.updateTypeList();
      },
      deep: true,
    },
  },
  computed: {
    isListFiltered: function () {
      let defaults = {
        completed: false,
        reviewed: false,
        text: '',
      };

      let filtered = false;
      for (let [key, val] of Object.entries(this.filter)) {
        if (defaults[key] === undefined)
          console.error('Filter is not implemented in defaults!', key);
        else {
          if (defaults[key] != val) {
            filtered = true;
            break;
          }
        }
      }

      return filtered;
    },
    // filteredList: function() {
    //   let list = this.$data.items;

    //   list = SearchUtils.filter(this.textFilter, list, 'projectId');

    //   if (this.completeFilter == 'work' || this.completeFilter == 'completed') {
    //     const state = this.completeFilter == 'completed';
    //     list = list.filter(item => item.completed == state);
    //   }

    //   return list;
    // },
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
        completed: false,
        reviewed: false,
      },
    };
  },
  methods: {
    clearFilters() {
      console.log('CLEAR');
      this.filter.completed = false;
      this.filter.reviewed = false;
      this.filter.text = '';
      this.updateTypeList();
    },
    updateTypeList: async function () {
      if (this.loading) return;

      this.loading = true;
      Query.raw(
        `
    {
      getReducedCoinTypeList(pagination: {
        count:${this.pageInfo.count}, page:${this.pageInfo.page}
        },
        filter: {
          text: "${this.filter.text}"
          ${this.filter.reviewed ? 'reviewed: true' : ''}
          ${this.filter.completed ? 'completed: true' : ''}
        }) {
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
            let getReducedCoinTypeList =
              result.data.data.getReducedCoinTypeList;
            this.$data.items = getReducedCoinTypeList.types;
            this.pageInfo = getReducedCoinTypeList.pageInfo;
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
          this.loading = false;
        });
    },
    handleKeys(event) {
      console.log(event.key);
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
            item.reviewed = state;
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
            item.completed = state;
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
          console.log('HALLO');
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
    textFilterChanged() {
      this.filtersChanged();
    },
    filtersChanged() {
      localStorage.setItem('type-list-filter', JSON.stringify(this.filter));
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
</style>
