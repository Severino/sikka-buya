<template>
  <div class="data-select" :class="{ invalid }">
    <input
      class="name-field"
      @input="input"
      @focus="focus"
      @blur="hideList"
      :placeholder="placeholder"
      v-model="value[attribute]"
      :required="required"
    />

    <Button id="clear-btn" @click.stop.prevent="clear()"><Close /></Button>

    <div class="indicator">
      <Alert v-if="invalid" class="alert" />
      <Check v-else class="check" />
    </div>

    <ul :class="'search-box ' + (listVisible ? 'visible' : 'hidden')">
      <li v-if="internal_error" class="error non-selectable">
        {{ internal_error }}
      </li>

      <li
        v-if="
          (!internal_error && !loading && !searchResults) ||
          searchResults.length == 0
        "
        class="non-selectable"
      >
        {{ $t('message.list_empty') }}
      </li>
      <li
        v-for="search of searchResults"
        :key="search.id"
        :data-id="search.id"
        @click.stop="setValue"
      >
        <!-- These comments are necessary, that no whitespace is added!
        -->{{ transformTextContent(search)
        }}<!--
      --></li>
    </ul>

    <div v-if="error" class="error non-selectable">{{ error }}</div>
  </div>
</template>

<script>
import GraphQLUtils from '../../utils/GraphQLUtils';
import Query from '../../../src/database/query';

import Alert from 'vue-material-design-icons/Alert';
import Check from 'vue-material-design-icons/Check';
import Close from 'vue-material-design-icons/Close';

export default {
  name: 'DataSelectField',
  components: { Alert, Check, Close },
  data: function () {
    return {
      id: null,
      listVisible: false,
      hideTimeout: null,
      searchResults: [],
      loading: false,
      internal_error: '',
    };
  },
  props: {
    value: {
      type: Object,
      validator: function (obj) {
        return obj.id == null || !isNaN(parseInt(obj.id));
      },
    },
    error: String,
    queryParams: {
      type: Array,
      default: function () {
        return ['id', 'name'];
      },
    },
    additionalParameters: Object,
    table: {
      type: String,
      required: true,
    },
    attribute: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    // Text allows us to format the text as we want to.
    // This is an alternative to attribute.
    // Use JavaScript template literals placeholders ('${your_variable}')
    text: {
      type: String,
      default: null,
    },
    query: String,
    queryCommand: String,
    msg: String,
    tooltip: String,
    placeholder: String,
  },
  computed: {
    invalid: function () {
      return this.value.id == null;
    },
  },
  methods: {
    setValue: function (event) {
      const target = event.target;
      const value = this.value;
      this.listVisible = false;
      value.id = target.getAttribute('data-id', this.id);
      value[this.attribute] = target.textContent;
      this.$emit('input', value);
      this.$emit('select', value);
    },
    input: async function (event, preventSimiliarityCheck = false) {
      let value = this.value;
      value[this.attribute] = event.target.value;
      value.id = null;
      this.checkMatch(value);
      this.$emit('input', value);
    },
    checkMatch: async function (value) {
      await this.searchEntry(value[this.attribute]);
      for (let entry of this.searchResults.values()) {
        let regex = new RegExp('^' + value.name + '$', 'i');

        if (regex.test(entry.name)) {
          value = entry;
          break;
        }
      }
    },
    focus: async function () {
      await this.checkMatch(this.value);
      this.showList();
    },
    showList: function () {
      if (this.hideTimeout) clearTimeout(this.hideTimeout);
      this.listVisible = true;
    },
    hideList: function () {
      this.hideTimeout = setTimeout(() => {
        this.listVisible = false;

        // if (!this.value.id) {
        //   const obj = { id: null };
        //   obj[this.attribute] = "";
        //   this.$emit("input", obj);
        // }
      }, 200);
    },
    initId: function () {
      this.getData().forEach((el) => {
        if (el.id > this.$data.id) this.$data.id = el.id + 1;
      });
    },
    getData: function () {
      let loaded;
      try {
        loaded = JSON.parse(window.localStorage.getItem(this.$props.table));
      } catch (e) {
        console.error("Couldn't load data-select", e);
      }

      return loaded || [];
    },
    searchEntry: async function (str = null) {
      let searchString = str !== null ? str : this.value[this.attribute] || '';

      const queryCommand = this.queryCommand
        ? this.queryCommand
        : `search${this.table[0].toUpperCase() + this.table.slice(1)}`;

      const query = `{
      ${queryCommand}(text: "${searchString}" ${
        this.additionalParameters
          ? Object.entries(this.additionalParameters).map(
              ([key, value]) => `,${key}:${JSON.stringify(value)}`
            )
          : ''
      } ){
        ${GraphQLUtils.buildQueryBody(this.queryParams)}
      }
      }`;

      Query.raw(query)
        .then((result) => {
          if (result?.data?.data[queryCommand]) {
            this.searchResults = result.data.data[queryCommand];
            this.internal_error = '';
          } else {
            console.error('Could not get value');
            this.internal_error = 'Unknown Search Error';
          }
        })
        .catch((error) => {
          this.internal_error = error;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    transformTextContent: function (search) {
      if (this.text) {
        return this.text.replace(/\${(.+?)}/g, function (match, name) {
          const path = name.split('.');
          let target = search;
          for (let i = 0; i < path.length && target != null; i++) {
            target = target[path[i]];
          }

          return target ? target : '';
        });
      } else {
        return search[this.attribute] || '';
      }
    },
    clear() {
      let obj = { id: null };
      obj[this.attribute] = '';
      this.$emit('input', obj);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../scss/_import.scss';

.error {
  position: static;
}

.visible {
  display: block;
}

.hidden {
  display: none;
}

.data-select {
  display: flex;
  position: relative;
  color: #000000;

  &.invalid {
    .id-field {
      background-color: rgba($yellow, 0.5);
    }
  }
}

.check {
  color: $primary-color;
}

.alert {
  color: $red;
}

#clear-btn {
  right: 0;
  top: 1px;
  padding: 0;
  padding-left: 5px;
  right: 1px;
  width: 35px;
  background-color: none;
  height: calc(100% - 2px);
  position: absolute;
  border: none;
  z-index: 1;

  &:hover {
    background-color: rgba($color: $gray, $alpha: 0.2);
  }
}

.indicator {
  position: absolute;
  right: 40px;
  border-left: none;
  padding: 0 5px;
  box-sizing: border-box;
  display: flex;
  height: 100%;

  > * {
    display: flex;
    align-items: center;
  }
}

.error {
  position: absolute;
  top: 0;
  left: 0;
  transform: translateY(-100%);

  // display: flex;
  // align-items: center;
  padding: 5px 20px;
}

.name-field {
  flex: 1;

  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  //   border: 1px solid gray;
}

.id-field {
  max-width: 37px;
  border: none;
  text-align: center;
  @include disabled_input;
}

button {
  width: 64px;
}

.search-box {
  position: absolute;
  top: 100%;
  left: 0;
  margin: 0;
  padding-left: 0;
  list-style-type: none;
  background-color: white;
  border: 1px solid whitesmoke;
  width: 100%;
  // padding: 10px;
  box-sizing: border-box;
  z-index: 2000;
  max-height: 50vh;
  overflow-y: auto;

  box-shadow: 1px 2px 3px rgba($color: #000000, $alpha: 0.2);

  li {
    border-bottom: 1px solid whitesmoke;
    padding: 10px;

    &.non-selectable {
      background-color: whitesmoke;
    }

    &:not(.non-selectable):hover {
      color: whitesmoke;
      background-color: $primary-color;
      cursor: pointer;
    }
  }
}
</style>
