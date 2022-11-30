<template>
  <span class="toggle-button-list">
    <slot name="before" />
    <Button
      v-for="toggleButton of list"
      :key="toggleButton[textProperty]"
      class="year-grid"
      :class="{ active: isActive(toggleButton[idProperty]) }"
      @click="activeChanged(toggleButton[idProperty])"
    >
      {{ toggleButton[textProperty] }}
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
  },
};
</script>

<style lang="scss" scoped>
button {
  display: inline-block;
}
</style>