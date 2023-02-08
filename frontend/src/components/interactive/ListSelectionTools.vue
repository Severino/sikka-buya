<template>
  <div class="list-selection-tools">
    <div
      v-if="!hideAll"
      @click.prevent.stop="selectAll"
      :class="{ disabled: allSelected }"
    >
      <select-all-icon :size="18" />
    </div>
    <div @click.prevent.stop="unselectAll" :class="{ disabled: noneSelected }">
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
}
</style>