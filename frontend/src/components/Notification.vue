<template>
  <div class="notice">
    <slot />
  </div>
</template>

<style lang='scss' scoped>
.notice {
  padding: $padding;
  background-color: $white;
  border-radius: math.div($padding, 2) $padding;
}
</style>