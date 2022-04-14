<template>
  <div class="box">
    <header v-if="title">{{ title }}</header>
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

$top-bottom-spacing: $side-pad/2;

header {
  // padding: $side-pad/3 $side-pad $side-pad/3;

  padding-left: $side-pad;
  padding-right: $side-pad;

  margin-bottom: $side-pad/2;
  //   border-bottom: 1px solid $header-color;
  font-weight: bold;
  text-transform: uppercase;
  font-kerning: auto;
  letter-spacing: 0.1em;
  font-size: $small-font;

  color: $gray;
}

.body {
  // padding: 0 $side-pad $side-pad/2 $side-pad;

  :first-child {
    margin-top: 0;
  }

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
  margin: 0 $side-pad;

  width: 512px;
  max-width: 100%;

  // > *:first-child {
  //   padding-top: $top-bottom-spacing;
  // }
}
</style>