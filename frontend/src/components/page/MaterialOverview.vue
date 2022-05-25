<template>
  <overview property="material" :parameters="['color']">
    <template #list-item-before="item">
      <pre>{{ item }}</pre>
      <list-color-indicator :item="item" />
    </template>
  </overview>
</template>

<script>
import ListColorIndicator from '../list/ListColorIndicator.vue';
import Overview from './Overview.vue';
export default {
  components: { Overview, ListColorIndicator },
};
</script>

<style>
</style>