<template>
  <div class="multi-data-select-2d">
    <template v-for="(values, idx) of active">
      <div
        v-if="idx > 0"
        :key="`mda-${input.name}-(${idx})-separator`"
        class="between-groups-area"
      >
        <div class="separator" v-text="mode" @click="changeMode" />

        <Button @click.native="() => $emit('remove-group', idx)">
          Unten Löschen
        </Button>
      </div>
      <multi-data-select
        :key="`mda-${input.name}-(${idx})`"
        :table="input.value"
        :input="(...args) => search(...args, idx)"
        :active="values"
        :attribute="input.attribute"
        :queryParams="input.queryParams"
        :queryCommand="input.queryCommand"
        :additionalParameters="input.additionalParameters"
        :text="input.text"
        :displayTextCallback="input.displayTextCallback"
        :disableRemoveButton="true"
        :mode="childModeSign"
        @select="(value) => $emit('select', value, idx)"
        @remove="(el) => $emit('remove', el, idx)"
        @change-mode="changeMode"
        @dynamic-change="() => $emit('dynamic-change')"
      />
    </template>
    <multi-data-select-add-button
      id="add-group-button"
      @click.native="() => $emit('add')"
      >Gruppe hinzufügen</multi-data-select-add-button
    >
  </div>
</template>

<script>
import Button from '../layout/buttons/Button.vue';
import MultiDataSelect from './MultiDataSelect.vue';
import MultiDataSelectAddButton from './MultiDataSelectAddButton.vue';

export default {
  components: { MultiDataSelect, MultiDataSelectAddButton, Button },
  props: {
    active: Array,
    input: Object,
    separator: String,
    mode: String,
  },
  data() {
    return {
      searchValues: [],
    };
  },
  methods: {
    search(evt, idx) {
      this.searchValues[idx] = evt.value;
    },
    changeMode() {
      this.$emit('change-mode');
    },
  },
  computed: {
    childModeSign() {
      return this.mode === 'AND' ? 'OR' : 'AND';
    },
  },
};
</script>

<style lang="scss">
.multi-data-select-2d {
  .separator {
    display: inline-flex;
    align-items: center;
    color: $white;
    background-color: $gray;
    border-radius: $border-radius;

    font-size: $xtra-small-font;
    font-weight: bold;
  }
}
</style>

<style lang="scss" scoped>
.multi-data-select-2d {
  padding: $small-padding;
  border: $border;
  border-radius: $border-radius;
}

.between-groups-area {
  display: flex;
  justify-content: space-between;
  margin: $small-padding 0;

  > * {
    font-size: $xtra-small-font;
    padding: $padding/2 2 * $padding;
  }
}

#add-group-button {
  margin-top: $small-padding;
}
</style>
