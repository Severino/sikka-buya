<template>
  <div class="list">
    <LoadingSpinner class="loading-spinner" v-if="loading" />

    <header v-if="properties">
      <div
        v-for="(label, idx) of [...properties]"
        :key="`label-of-${label}-${idx}`"
      >
        {{ label }}
      </div>
    </header>
    <div v-if="error" class="info error">
      <AlertCircleIcon />
      <p>
        {{ error }}
      </p>
    </div>

    <div
      v-if="!items || (items && items.length == 0 && !loading && error == '')"
      class="info"
    >
      <InformationIcon />
      <p>
        {{ $t('warning.list_is_empty') }}
      </p>
    </div>
    <div
      v-else-if="
        filteredItems && filteredItems.length == 0 && !loading && error == ''
      "
      class="info"
    >
      <InformationIcon />
      <p>
        {{ $t('warning.filtered_list_is_empty') }}
      </p>
    </div>

    <slot></slot>
  </div>
</template>

<script>
import AlertCircleIcon from 'vue-material-design-icons/AlertCircle';
import InformationIcon from 'vue-material-design-icons/Information';

import ListItem from './ListItem.vue';
import LoadingSpinner from '../misc/LoadingSpinner.vue';

export default {
  components: { ListItem, InformationIcon, AlertCircleIcon, LoadingSpinner },
  props: {
    properties: {
      type: Array,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    items: {
      id: String,
      name: String,
      required: true,
    },
    error: {
      type: String,
      default: '',
    },
    filteredItems: {
      type: Array,
      default: null,
    },
    noRemove: Boolean,
  },
  methods: {
    listItemClicked: function (id) {
      this.$emit('select', id);
    },
    listItemRemoved: function (id) {
      this.$emit('remove', id);
    },
  },
};
</script>

<style lang="scss" scoped>
.list {
  margin: $padding 0;
}

.info {
  color: gray;
  background-color: whitesmoke;
  // border-radius: $border-radius;
  display: flex;
  align-items: center;

  .material-design-icon {
    margin-right: $padding * 2;
  }
}

.error {
  color: black;
  font-weight: normal;
  background-color: rgb(255, 81, 81);
  border: 1px solid rgb(138, 39, 39);
}

.loading-spinner {
  align-self: center;
}

header {
  display: flex;
  align-items: center;
  padding: 0 $padding;
  border-bottom-width: 0;
  background-color: rgb(224, 224, 224);
  color: gray;
  border: 1px solid #cccccc;
  border-bottom: none;
  font-weight: bold;

  > * {
    flex: 1;
  }

  > * {
    text-transform: uppercase;
  }
}

.search {
  display: flex;
  > input {
    flex: 1;
  }
}
</style>
