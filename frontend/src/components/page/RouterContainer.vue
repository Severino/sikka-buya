<template>
  <div class="content-wrapper">
    <breadcrumbs :before="[{name: 'home'}]" />
    <router-view />
  </div>
</template>

<script>
import Breadcrumbs from '../navigation/Breadcrumbs.vue';
export default {
  components: { Breadcrumbs },
  name: 'RouterContainer',
};
</script>


<style lang="scss" scoped>
.content-wrapper {
  display: flex;
  flex: 1;
  flex-direction: column;
}
</style>