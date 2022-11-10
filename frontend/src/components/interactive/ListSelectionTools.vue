<template>
  <div class="list-selection-tools">
    <div
      @click.prevent.stop="() => $emit('select-all')"
      :class="{ disabled: allSelected }"
    >
      <select-all-icon :size="18" />
    </div>
    <div
      @click.prevent.stop="() => $emit('unselect-all')"
      :class="{ disabled: !noneSelected }"
    >
      <select-remove-icon :size="18" />
    </div>
  </div>
</template>

<script>
import SelectAllIcon from 'vue-material-design-icons/SelectAll.vue';
import SelectRemoveIcon from 'vue-material-design-icons/SelectOff.vue';
export default {
  components: {
    SelectAllIcon,
    SelectRemoveIcon,
  },
  props: {
    allSelected: { type: Boolean, required: true },
    noneSelected: { type: Boolean, required: true },
  },
};
</script>

<style lang='scss' scoped>
.list-selection-tools {
  display: flex;
}
</style>