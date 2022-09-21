<template>
  <div class="catalog-landing">
    <header>
      <h1>{{ $t(title) }}</h1>
      <div class="nav-grid grid">
        <router-link
          v-for="link of links"
          :key="`link-to-${link.title}`"
          :to="link.to"
        >
          <card :img="link.image">
            <template v-slot:header>
              <h2>{{ $t(link.title) }}</h2>
            </template>
          </card>
        </router-link>
      </div>
    </header>
  </div>
</template>

<script>
import Card from '../navigation/Card.vue';
export default {
  components: {
    Card,
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
  grid-template-columns: 1fr 1fr;
  gap: 3 * $padding;
}
</style>
