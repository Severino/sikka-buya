<template>
  <div class="button" :class="{ colored }" @click.stop="clicked">
    <!-- 
      @slot Default slot to render the button contents.
     -->
    <slot />
  </div>
</template>

<script>
/**
 * Renders a more pleasant looking and more customizable Button.
 * __This button should be used as default!__
 *
 * An Exception would be if you want to submit a form.
 */
export default {
  props: {
    /**
     * Disables the button and the ability to push it.
     */
    disabled: Boolean,
    /**
     * Displays the button in the accent color.
     */
    colored: Boolean,
  },
  methods: {
    /**
     * Called when the button is clicked.
     */
    clicked: function () {
      if (!this.disabled)
        /**
         * Click event.
         */
        this.$emit('click');
    },
  },
};
</script>

<style lang="scss" scoped>
.button {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  box-sizing: border-box;

  .material-design-icon:not(:last-child) {
    margin-right: $padding;
  }
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
