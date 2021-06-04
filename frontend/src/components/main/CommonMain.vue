<template>
  <main>
    <navigation />
    <router-view></router-view>
  </main>
</template>

<script>
import Navigation from '../Navigation.vue'
export default {
  components: { Navigation },
    name:"CommonMain"
}
</script>

<style lang="scss" scoped>
main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>

