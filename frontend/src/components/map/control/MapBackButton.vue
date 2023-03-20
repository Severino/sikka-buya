<template>
  <nav>
    <Button
      id="back-button"
      class="ugly"
      :to="{ name: 'Map Overview' }"
    >
      <ExitToApp
        :size="IconSize.Big"
        class="flip"
      />
      <Locale path="routes.home" />
    </Button>
  </nav>
</template>

<script>
import Locale from '../../cms/Locale.vue';
import ExitToApp from 'vue-material-design-icons/ExitToApp.vue';
import Button from '../../layout/buttons/Button.vue';

export default { components: { ExitToApp, Locale, Button } };
</script>

<style></style>