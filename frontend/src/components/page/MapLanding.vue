<template>
  <div class="map-landing">
    <header>
      <h1>{{ $t('routes.Map') }}</h1>
      <div class="nav-grid grid">
        <router-link :to="{ name: 'Political Map' }">
          <card
            id="political-map-card"
            img="/img/button-images/political-map-preview.jpg"
          >
            <template v-slot:header>
              <h2>{{ $t('routes.Political Map') }}</h2>
            </template>
            <p>
              <!-- Nulla amet sint nisi excepteur minim voluptate commodo do nulla ea
              duis fugiat. Pariatur esse esse enim aliqua incididunt do ut. Quis
              dolor Lorem do duis sunt sunt adipisicing cillum laborum ad. -->
            </p>
          </card>
        </router-link>

        <router-link :to="{ name: 'Additional Maps' }">
          <card
            id="additional-map-card"
            img="/img/button-images/material-map-preview.jpg"
          >
            <template v-slot:header>
              <h2>{{ $t('routes.Additional Maps') }}</h2>
            </template>

            <p>
              <!-- Nulla amet sint nisi excepteur minim voluptate commodo do nulla ea
              duis fugiat. Pariatur esse esse enim aliqua incididunt do ut. Quis
              dolor Lorem do duis sunt sunt adipisicing cillum laborum ad. -->
            </p>
          </card>
        </router-link>
      </div>
    </header>
  </div>
</template>

<script>
import Card from '../navigation/Card.vue';
export default {
  components: { Card },
  name: 'CatalogLanding',
};
</script>

<style lang="scss">
.map-landing {
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
