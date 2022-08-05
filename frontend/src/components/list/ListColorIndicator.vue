<template>
  <div class="color-indicator" :style="style"></div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  computed: {
    color() {
      return this.item.color || '#ffffff';
    },
    style() {
      return `background-color: ${this.color};`;
    },
  },
};
</script>

<style lang='scss' scoped>
.color-indicator {
  $size: 14px;
  width: $size;
  height: $size;
  border: $border;
  box-sizing: border-box;
  border-radius: $size/2;
  margin-right: 20px;
}
</style>