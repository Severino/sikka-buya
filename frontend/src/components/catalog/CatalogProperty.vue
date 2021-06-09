<template>
  <div class="catalog-property">
    <div class="property-label">
      {{ label }}
    </div>

    <div v-if="html" class="property-value" v-html="html" />
    <div v-else class="property-value">{{ value }}</div>
      
  </div>
</template>

<script>
export default {
  name: "CatalogProperty",
  props: {
    label: String,
    value: String,
    html: String
  },
};
</script>

<style lang="scss" >
.catalog-property {
 // margin: 2em 0 ;

  background-color: $white;
  border-radius: 3px;
  padding: 2*$padding;
}

.property-label {
  font-size: $small-font;
  margin-bottom: 1.5em;
  font-weight: bold;
  color: $primary-color;
  text-transform: uppercase;
}
</style>
