<template>
  <div class="selectable-list-header">
    <selection-indicator :selected="selected" :total="total" />
    <h4><slot /></h4>
    <div class="fill"></div>

    <list-selection-tools
      @select-all="$emit('select-all')"
      @unselect-all="$emit('unselect-all')"
      :allSelected="allSelected"
      :noneSelected="noneSelected"
      :hideAll="hideAll"
    />
  </div>
</template>

<script>
import ListSelectionTools from '../interactive/ListSelectionTools.vue';
import SelectionIndicator from './SelectionIndicator.vue';
export default {
  components: { ListSelectionTools, SelectionIndicator },
  props: {
    allSelected: Boolean,
    noneSelected: Boolean,
    selected: Number,
    total: Number,
    hideAll: Boolean,
  },
};
</script>

<style lang='scss' scoped>
.selectable-list-header {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
}

.fill {
  flex: 1;
}
</style>