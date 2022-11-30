<template>
  <div class="box">
    <header v-if="title">
      <h2>{{ title }}</h2>
    </header>
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

$top-bottom-spacing: math.div($side-pad, 2);

header {
  > * {
    margin-top: 0;
  }
}

.body {
  // padding: 0 $side-pad math.div($side-pad, 2) $side-pad;

  :first-child {
    margin-top: 0;
  }

  > *:not(:last-child) {
    margin-bottom: $padding * 2;
  }
}

.box {
  max-width: 100%;
  @include box;
  margin: 0 $side-pad;

  width: 512px;
  max-width: 100%;
}
</style>