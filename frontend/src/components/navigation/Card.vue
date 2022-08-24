<template>
  <div class="card">
    <header>
      <slot name="header" />
    </header>
    <div class="body">
      <slot />
    </div>
    <footer>
      <ArrowRight />
    </footer>
  </div>
</template>

<script>
import ArrowRight from 'vue-material-design-icons/ArrowRight.vue';
export default {
  components: {
    ArrowRight,
  },
};
</script>

<style lang='scss' scoped>
.card {
  display: flex;
  flex-direction: column;
  min-height: 360px;
  color: $white;
  background-color: $primary-color;
}

.body {
  flex: 1;
  display: flex;
  align-items: flex-end;
}

footer {
  display: flex;
  justify-content: flex-end;
}
</style>