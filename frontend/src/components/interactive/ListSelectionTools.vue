<template>
  <div class="list-selection-tools">
    <div
      v-if="!hideAll"
      @click.prevent.stop="selectAll"
      :class="{ disabled: allSelected }"
    >
      <SelectAllIcon :size="18" />
    </div>
    <div
      @click.prevent.stop="unselectAll"
      :class="{ disabled: noneSelected }"
    >
      <RemoveAllIcon :size="18" />
    </div>
  </div>
</template>

<script>
import RemoveAllIcon from 'vue-material-design-icons/CheckboxMultipleBlankOutline';
import SelectAllIcon from 'vue-material-design-icons/CheckboxMultipleBlank';
export default {
  components: {
    SelectAllIcon,
    RemoveAllIcon,
  },
  props: {
    allSelected: { type: Boolean, required: true },
    noneSelected: { type: Boolean, required: true },
    hideAll: Boolean,
  },
  methods: {
    selectAll() {
      if (!this.allSelected) this.$emit('select-all');
    },
    unselectAll() {
      if (!this.noneSelected) this.$emit('unselect-all');
    },
  },
};
</script>

<style lang='scss' scoped>
.list-selection-tools {
  display: flex;
}</style>