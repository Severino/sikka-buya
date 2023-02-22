<template>
  <button class="button" :class="{ colored, multiline, 'content-button': contentButton }" @click="clicked">
    <!-- 
      @slot Default slot to render the button contents.
     -->
    <slot v-if="!to" />
    <router-link v-else :to="to">
      <slot />
    </router-link>
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
    /**
     * You can just put the to in the button to get a navigation going.
     */
    to: Object,
    /**
     * Prevent the default stopPropagation
     */
    noStop: Boolean,
  },
  methods: {
    /**
     * Called when the button is clicked.
     */
    clicked: function (event) {

      if (!this.noStop)
        event.stopPropagation()

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
  box-sizing: border-box;

  &.row-button {
    border-radius: 0;
    border-left: 0;
    border-right: 0;
    border-top: $border;
    border-bottom: $border;
  }

  a {
    @include resetLinkStyle();
    color: currentColor;
  }

  &.big-button {
    padding: $padding $padding * 2;
  }

  &.huge-button {
    padding: $large-padding $large-padding * 2;
    font-size: $large-font;

    .material-design-icon {
      margin-right: $large-padding;
    }
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

  a {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    text-align: center;
    box-sizing: border-box;
    flex: 1;
  }

  &.multiline {
    flex-direction: column;
  }

  .material-design-icon:not(:last-child) {
    margin-right: $padding;
  }

  &.colored {
    border-radius: 3px;

    @include buttonColor($white, $primary-color);
  }

  &.content-button {
    background-color: transparent;
    border: none;
  }

  &.borderless {
    background-color: transparent;
    border: none;
    border-radius: 0;
  }

  a {
    display: block;
  }
}
</style>
