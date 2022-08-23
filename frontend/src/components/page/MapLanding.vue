<template>
  <div class="map-landing">
    <header>
      <h1>{{ $t('routes.Map') }}</h1>
      <div class="nav-grid grid">
        <router-link :to="{ name: 'Political Map' }">
          <card id="person-explorer-card">
            <template v-slot:header>
              <h2>{{ $t('routes.Political Map') }}</h2>
            </template>
            <p>
              Nulla amet sint nisi excepteur minim voluptate commodo do nulla ea
              duis fugiat. Pariatur esse esse enim aliqua incididunt do ut. Quis
              dolor Lorem do duis sunt sunt adipisicing cillum laborum ad.
            </p>
          </card>
        </router-link>

        <router-link :to="{ name: 'Material Map' }">
          <card>
            <template v-slot:header>
              <h2>{{ $t('routes.Material Map') }}</h2>
            </template>

            <p>
              Nulla amet sint nisi excepteur minim voluptate commodo do nulla ea
              duis fugiat. Pariatur esse esse enim aliqua incididunt do ut. Quis
              dolor Lorem do duis sunt sunt adipisicing cillum laborum ad.
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

  .card {
    color: $black;
  }
}
</style>

<style lang="scss" scoped>
.nav-grid {
  height: 420px;
  grid-template-columns: 1fr 1fr;
  gap: 3 * $padding;
}

.card {
  // background-color: $white;
  border: $border;
  padding: $big-box-padding;
}
</style>
