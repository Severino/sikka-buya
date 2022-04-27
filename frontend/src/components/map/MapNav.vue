<template>
  <div class="map-nav">
    <div></div>
    <div class="links">
      <!-- <div class="title">Maps</div> -->
      <router-link
        v-for="route of mapRoutes"
        :key="route.name"
        :to="{ name: route.name }"
        :class="{ active: isRouteActive(route) }"
        >{{ route.name }}</router-link
      >
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    isRouteActive(route) {
      return this.$route.matched.some(({ name }) => name === route.name);
    },
  },
  computed: {
    mapRoutes() {
      return this.$router.options.routes[1].children[5].children;
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  text-transform: uppercase;
  color: gray;

  font-weight: bold;

  align-items: center;
  padding: $padding $padding * 2;
  //   justify-content: center;
}

.map-nav {
  display: grid;
  grid-template-columns: 1fr 5fr 1fr;
  > * {
    display: flex;
  }
  .links > * {
    $bottom-border-width: 3px;
    display: block;
    padding: $padding 2 * $padding;
    padding-bottom: calc(#{$padding} - #{$bottom-border-width});
    margin-right: $padding;
    box-sizing: border-box;
    border-bottom: $bottom-border-width solid transparent;

    &.active {
      color: $primary-color;
      font-size: bold;
      border-color: $primary-color;
    }
  }
}
</style>