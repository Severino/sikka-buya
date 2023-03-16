<template>
  <div class="multi-data-select-2d">
    <template v-for="(values, idx) of active">
      <div v-if="idx > 0" :key="`mda-${input.name}-(${idx})-separator`" class="between-groups-area">
        <div class="separator button" v-text="$t(`general.${mode.toLowerCase()}`)" @click="changeMode" />
        <Button @click.native="() => $emit('remove-group', idx)">
          Unten Löschen
        </Button>
      </div>
      <multi-data-select :active="values" :additionalParameters="input.additionalParameters" :allowModeChange="true"
        :attribute="input.attribute" :disableRemoveButton="true" :displayTextCallback="input.displayTextCallback"
        :input="(...args) => search(...args, idx)" :key="`mda-${input.name}-(${idx})`" :mode="childModeSign"
        :queryCommand="input.queryCommand" :queryParams="input.queryParams" :table="input.name" :text="input.text"
        @select="(value) => $emit('select', value, idx)" @remove="(el) => $emit('remove', el, idx)"
        @change-mode="changeMode" @dynamic-change="() => $emit('dynamic-change')" />
    </template>
    <multi-data-select-add-button id="add-group-button" @click.native="() => $emit('add')">Gruppe
      hinzufügen</multi-data-select-add-button>
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
      return this.mode.toLowerCase() === 'and' ? 'or' : 'and';
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
    min-height: 24px;
    background-color: $dark-green;
    border-radius: $border-radius;

    font-size: $xtra-small-font;
    font-weight: bold;

    text-transform: uppercase;
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

  >* {
    font-size: $xtra-small-font;
    padding: math.div($padding, 2) 2 * $padding;
  }
}

#add-group-button {
  margin-top: $small-padding;
}
</style>
