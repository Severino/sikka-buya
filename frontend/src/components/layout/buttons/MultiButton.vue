
<template>
  <div class="multi-button">
    <slot />
  </div>
</template>

<script>
/**
 * The multibutton is used to combine multiple button in one element with multiple
 * buttons.
 *
 * E.g. when having a link, you can add a open external link button next to it.
 *
 */
export default {};
</script>

<style lang="scss">
.multi-button {
  display: flex;
  button,
  .button {
    margin: 0;
  }

  > *:not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  > *:not(:first-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: none;
  }
}
</style>