<template>
  <div class="multi-data-select">
    <data-select-field
      :value="value"
      @input="(val) => $emit('input', val)"
      @select="(val) => $emit('select', val)"
      :error="error"
      :queryParams="queryParams"
      :additionalParameters="additionalParameters"
      :table="table"
      :attribute="attribute"
      :required="required"
      :text="text"
      :displayTextCallback="displayTextCallback"
      :query="query"
      :queryCommand="queryCommand"
      :msg="msg"
      :tooltip="tooltip"
      :placeholder="placeholder"
      :unselectable="true"
      :disableRemoveButton="disableRemoveButton"
    />
    <div class="active-list" v-if="active.length > 0">
      <button
        v-for="el of active"
        :key="`active-${el.id}`"
        @click="() => $emit('remove', el)"
      >
        {{ el[attribute] }} <CloseThickIcon :size="14" />
      </button>
    </div>
  </div>
</template>

<script>
import DataSelectField from './DataSelectField.vue';
import CloseThickIcon from 'vue-material-design-icons/CloseThick.vue';
export default {
  components: {
    DataSelectField,
    CloseThickIcon,
  },
  props: {
    value: {
      type: Object,
      validator: function (obj) {
        return obj.id == null || !isNaN(parseInt(obj.id));
      },
    },
    active: {
      type: Array,
      required: true,
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
    },
    attribute: {
      type: String,
      default: 'name',
    },
    required: Boolean,
    // Text allows us to format the text as we want to.
    // This is an alternative to attribute.
    // Use JavaScript template literals placeholders ('${your_variable}')
    text: String,
    displayTextCallback: Function,
    /**
     * Unselectable is used, when you e.g. have multiple selection options and the
     * field is cleared afterwards and only the selection is tracked.
     */
    query: String,
    queryCommand: String,
    msg: String,
    tooltip: String,
    placeholder: String,
    disableRemoveButton: {
      type: Boolean,
      default: false,
    },
  },

  active: [],
};
</script>

<style lang="scss">
.multi-data-select {
  .active-list {
    .material-design-icon {
      margin-left: $padding;
    }
  }
}
</style>

<style lang="scss" scoped>
.active-list {
  display: flex;
  flex-wrap: wrap;
  background-color: white;
  border: 1px solid $light-gray;
  border-top: none;
  padding: $padding;

  border-bottom-left-radius: $border-radius;
  border-bottom-right-radius: $border-radius;

  button {
    margin: $small-padding/2;
    font-size: $small-font;
    border-radius: $border-radius;
    border: none;
    padding: $small-padding $padding;
    background-color: $primary-color;
    color: white;
    font-weight: bold;
  }
}
</style>