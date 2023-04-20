<template>
  <div class="new-slide slideshow-item button">
    <PlusIcon :size="14" />
  </div>
</template>

<script>
import PlusIcon from 'vue-material-design-icons/Plus.vue';

export default {
  components: {
    PlusIcon,
  },
};
</script>

<style>
.new-slide {
  width: 16px;
  border-style: dashed;
  background-color: transparent;
}
</style>