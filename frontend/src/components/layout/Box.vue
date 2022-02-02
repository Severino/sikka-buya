<template>
  <div class="box">
    <header>{{ title }}</header>
    <div class="body">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Box',
  props: {
    title: String,
  },
};
</script>

<style lang="scss" scoped>
$side-pad: $padding * 4;

header {
  padding: $side-pad/2 $side-pad $side-pad/2;
  //   border-bottom: 1px solid $header-color;
  font-weight: bold;
  //   text-transform: uppercase;
  font-kerning: auto;
  font-size: $small-font;
  color: $light-gray;
}

.body {
  padding: 0 $side-pad $side-pad $side-pad;

  width: 512px;
  > *:not(:last-child) {
    margin-bottom: $padding * 2;
  }
}

.box {
  align-items: stretch;
  max-width: 100%;
  background-color: $white;
  border-radius: 15px;
  box-shadow: $shadow;
  overflow: hidden;
}
</style>