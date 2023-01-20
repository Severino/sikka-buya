<template>
  <div class="center-box">
    <Column>
      <h1>404</h1>
      <h2>The requested page was not found ...</h2>
    </Column>
  </div>
</template>

<script>
import Column from '../../layout/tabs/Column.vue';
export default {
  components: { Column },
};
</script>

<style lang="scss" scoped>
h1 {
  font-size: 10rem;
  text-align: center;
  color: $light-gray;
  margin-bottom: 2rem;
}

h2 {
  text-align: center;
}
</style>