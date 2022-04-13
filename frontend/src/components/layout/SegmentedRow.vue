<template>
  <div class="segmented-row">
    <div class="segment left" v-if="this.$slots.left">
      <slot name="left" />
    </div>
    <div class="segment center" v-if="this.$slots.center">
      <slot name="center" />
    </div>
    <div class="segment right" v-if="this.$slots.right">
      <slot name="right" />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.segmented-row {
  display: flex;
  justify-content: space-between;
  > * {
    display: flex;
    flex: 1;
    text-align: center;
  }
}

.segment.center {
  justify-content: center;
}

.segment.right {
  justify-content: flex-end;
}
</style>