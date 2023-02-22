<template>
  <div class="card-link-page">
    <header>
      <h1>{{ $t(title) }}</h1>
      <div class="nav-grid grid">
        <card-link
          v-for="link of links"
          :key="`link-to-${link.title}`"
          :to="link.to"
          :identity="link.identity"
          :contain="Boolean(link.contain)"
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
.card-link-page {
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
