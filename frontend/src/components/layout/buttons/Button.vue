<template>
  <div class="button" @click="clicked">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    disabled: Boolean,
  },
  methods: {
    clicked: function($) {
      if (!this.disabled) this.$emit('click');
    },
  },
};
</script>

<style lang="scss" scoped>
.button {
  text-align: center;
  color: $white;
  background-color: $primary-color;
  border-radius: 3px;

  &:hover {
    color: $white;
    background-color: darken($primary-color, 5);
  }

  &:active {
    color: $white;
    background-color: darken($primary-color, 10);
  }
}
</style>
