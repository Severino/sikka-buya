<template>
  <button
    class="multi-data-select-add-icon button add-button"
    style="height: 20px; min-width: 20px"
  >
    <Plus :size="14" />
    <slot />
  </button>
</template>

<script>
import Plus from 'vue-material-design-icons/Plus';
export default {
  components: {
    Plus,
  },
};
</script>

<style lang='scss' >
.multi-data-select-add-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $small-font;

  .plus-icon {
    margin-top: 3px;
  }

  span {
    display: block;
  }
}
</style>