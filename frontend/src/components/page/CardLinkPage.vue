<template>
  <div class="catalog-landing">
    <header>
      <h1>{{ $t(title) }}</h1>
      <div class="nav-grid grid">
        <card-link
          v-for="link of links"
          :key="`link-to-${link.title}`"
          :to="link.to"
          :img="link.image"
        >
          {{ $tc(link.title) }}
        </card-link>
      </div>
    </header>
  </div>
</template>

<script>
import CardLink from '../navigation/CardLink.vue';
export default {
  components: {
    CardLink,
  },
  props: {
    title: String,
    links: Array,
  },
};
</script>

<style lang="scss">
.catalog-landing {
  h2 {
    margin-top: 0;
  }
}
</style>

<style lang="scss" scoped>
.nav-grid {
  height: 420px;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 3 * $padding;
}
</style>
