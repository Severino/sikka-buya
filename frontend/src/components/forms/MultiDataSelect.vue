<template>
  <div class="multi-data-select">
    <div class="content">
      <div class="active-list">
        <template v-for="el of active">
          <!-- <span
            v-if="idx > 0"
            class="item-connection-indicator"
            :key="'ici-' + idx"
            v-text="mode"
          ></span> -->

          <button :key="`active-${el.id}`" @click="() => $emit('remove', el)">
            {{ el[attribute] }}
            <CloseThickIcon class="closeButton" :size="10" />
          </button>
        </template>
        <multi-data-select-add-button
          id="add-element-button"
          @click.native="showDataSelect()"
        />
      </div>
    </div>

    <div class="mode-indicator" v-if="mode" @click="() => $emit('change-mode')">
      {{ mode }}
    </div>

    <data-select-field
      :value="value"
      @blur="hideDataSelect"
      @input="(val) => $emit('input', val)"
      @select="select"
      @dynamic-change="() => $emit('dynamic-change')"
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
      :style="dataSelectStyles"
      ref="dataSelect"
    />
  </div>
</template>

<script>
import DataSelectField from './DataSelectField.vue';
import CloseThickIcon from 'vue-material-design-icons/CloseThick.vue';

import MultiDataSelectAddButton from './MultiDataSelectAddButton.vue';

export default {
  components: {
    CloseThickIcon,
    DataSelectField,
    MultiDataSelectAddButton,
  },
  props: {
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
    mode: String,
  },
  data() {
    return {
      value: null,
      dataSelectVisible: false,
    };
  },
  created() {
    this.resetValue();
  },
  methods: {
    resetValue() {
      this.value = { id: null, [this.attribute]: '' };
    },
    select(val) {
      this.resetValue();
      this.$emit('select', val);
    },
    showDataSelect() {
      this.dataSelectVisible = true;
      this.$nextTick(() => this.$refs.dataSelect.focus());
    },
    hideDataSelect() {
      this.dataSelectVisible = false;
    },
  },
  computed: {
    dataSelectStyles() {
      let style = {
        display: 'none',
      };

      if (this.dataSelectVisible) {
        delete style.display;
      }

      return style;
    },
  },
};
</script>

<style lang="scss">
$min-height: 20px;
.multi-data-select {
  display: flex;
  position: relative;
  border: $border;
  border-radius: $border-radius;
  min-height: $min-height;

  button:not(.add-button) {
    margin: $small-padding/2;
    font-size: $small-font;
    border-radius: $border-radius;
    // border: none;
    padding: 2px;
    // padding: $small-padding $padding;
    // background-color: $primary-color;
    // color: white;
    font-weight: bold;
    position: relative;
    padding-right: 12px;

    .closeButton {
      position: absolute;
      top: 50%;
      right: 2px;
      opacity: 0.5;
      transform: translateY(-50%);
    }
  }

  .active-list {
    align-items: center;
    .closeButton {
      margin-left: $padding;
    }
  }

  .data-select {
    position: absolute;
    top: 0;
    width: 100%;

    .name-field {
      border-radius: $border-radius;
      background-color: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(4px);
    }
  }

  input {
    max-width: 100%;
  }
}
</style>



<style lang="scss" scoped>
.content {
  flex: 1;
}

.active-list {
  display: flex;
  flex-wrap: wrap;
  // background-color: white;
  // border: 1px solid $light-gray;
  border-top: none;
  padding: $small-padding;

  border-bottom-left-radius: $border-radius;
  border-bottom-right-radius: $border-radius;
}

.item-connection-indicator,
.mode-indicator {
  font-size: $xtra-small-font;
  font-weight: bold;
  user-select: none;
}

.mode-indicator {
  background-color: $gray;
  padding: $small-padding;
  margin-left: $small-padding;
  min-width: 32px;
  justify-content: center;

  display: flex;
  align-items: center;
  color: $white;
  cursor: pointer;

  border-top-right-radius: $border-radius;
  border-bottom-right-radius: $border-radius;
}
</style>