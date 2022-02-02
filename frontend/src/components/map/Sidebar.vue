<template>
  <div class="side-bar" :class="getSideClass">
    <header>
      <h3>{{ title }}</h3>
    </header>
    <div class="body">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    side: {
      type: String,
      default: 'left',
    },
  },
  computed: {
    getSideClass: function () {
      if (this.side == 'left') {
        return 'side-bar-left';
      } else {
        return 'side-bar-right';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.side-bar {
  box-sizing: border-box;
  background-color: rgba($color: $white, $alpha: 0.8);
  padding: 20px;
  top: 0px;
  height: 100%;
  overflow-y: auto;

  // min-width: 200px;
  // width: 20vw;
  // max-width: 400px;
}

header {
  border-bottom: 1px solid $black;
  margin-top: -20px;
  margin-left: -20px;
  margin-right: -20px;
  margin-bottom: 20px;
  padding: 0 20px;
  padding-top: 10px;
  h3 {
    // color: $white;
    margin-top: 10px;
  }
}
</style>