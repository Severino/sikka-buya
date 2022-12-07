<template>
  <button
    class="button"
    :class="{ colored, multiline, 'content-button': contentButton }"
    @click.stop="clicked"
  >
    <!-- 
      @slot Default slot to render the button contents.
     -->
    <slot />
  </button>
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
     * Contentbutton doesn't use a filling, it just uses the
     * buttons content. Most likely a single icon.
     */
    contentButton: Boolean,
    /**
     * Disables the button and the ability to push it.
     */
    disabled: Boolean,
    /**
     * Displays the button in the accent color.
     */
    colored: Boolean,
    /**
     * Displays multiple elements below each other.
     */
    multiline: Boolean,
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

<style lang="scss">
.button {
  a {
    @include resetLinkStyle();
    color: currentColor;
  }

  &.big-button {
    padding: $padding $padding * 2;
  }
}
</style>

<style lang="scss" scoped>
.button {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  box-sizing: border-box;

  &.multiline {
    flex-direction: column;
  }

  .material-design-icon:not(:last-child) {
    margin-right: $padding;
  }
}

.button.colored {
  border-radius: 3px;

  @include buttonColor($white, $primary-color);
}

.button.content-button {
  background-color: transparent;
  border: none;
}
</style>
