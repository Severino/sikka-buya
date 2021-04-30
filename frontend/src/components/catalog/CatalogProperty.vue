<template>
  <div class="catalog-property">
    <div class="property-label">
      {{ label }}
    </div>
    <div class="property-value">
      {{ value }}
    </div>
  </div>
</template>

<script>
export default {
  name: "CatalogProperty",
  props: {
    label: String,
    value: String,
  },
};
</script>

<style lang="scss" >
.property-label {
  font-weight: bold;
  color: $primary-color;
}
</style>
