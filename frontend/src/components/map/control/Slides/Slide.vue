<template>
  <div class="slide button">
    {{ name }}
  </div>
</template>

<script>
import PlusIcon from 'vue-material-design-icons/Plus.vue';

export default {
  props: {
    name: String,
    options: Object,
  },
  components: {
    PlusIcon,
  },
};
</script>

<style>
.slide {
  display: flex;
  align-items: center;
}
</style>