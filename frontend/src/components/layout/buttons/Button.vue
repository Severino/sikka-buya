<template>
  <div class="button" :class="{ colored }" @click.stop="clicked">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    disabled: Boolean,
    colored: Boolean,
  },
  methods: {
    clicked: function () {
      if (!this.disabled) this.$emit('click');
    },
  },
};
</script>

<style lang="scss" scoped>
.button {
  display: flex;
  align-items: center;
  text-align: center;
  box-sizing: border-box;
}

.button.colored {
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
