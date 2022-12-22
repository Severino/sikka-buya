<template>
  <span class="toggle-button-list">
    <slot name="before" />
    <Button
      v-for="toggleButton of list"
      :key="toggleButton"
      class="year-grid"
      :class="{ active: isActive(toggleButton[idProperty]) }"
      @click="activeChanged(toggleButton[idProperty])"
    >
      {{ toggleButton }}
    </Button>
    <slot name="after" />
  </span>
</template>

<script>
export default {
  props: {
    textProperty: {
      type: String,
      default: 'name',
    },
    idProperty: {
      type: String,
      default: 'id',
    },
    list: { type: Array, required: true },
    active: { type: Object, required: false },
  },
  methods: {
    isActive(id) {
      return Boolean(this.active?.[id]);
    },
    activeChanged(id) {
      this.$emit('change', id);
    },
    text(item) {
      if (this.textProperty) {
        return item[this.textProperty];
      } else {
        return item;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
button {
  display: inline-block;
}
</style>