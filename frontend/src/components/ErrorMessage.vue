<template>
  <div class="error-message">
    <AlertCircle class="icon" />
    <slot />
  </div>
</template>

<script>
import AlertCircle from 'vue-material-design-icons/AlertCircle';
export default {
  components: { AlertCircle },
};
</script>

<style lang="scss" scoped>
.error-message {
  display: flex;
  align-items: center;
  padding: $padding;
  background-color: $red;
  border: 1px solid $red-dark;
  color: $white;
  border-radius: 5px;
}

.icon {
  margin-right: $padding;
}
</style>
