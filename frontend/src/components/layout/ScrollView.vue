<template>
  <simplebar class="scroll-view" data-simplebar-auto-hide="false">
    <slot />
  </simplebar>
</template>

<script>
import simplebar from 'simplebar-vue';
import 'simplebar/dist/simplebar.min.css';
export default {
  components: { simplebar },
};
</script>

