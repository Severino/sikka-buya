<template>
  <div v-if="Array.isArray(value)" class="catalog-item">
    <catalog-list :label="label" :items="value" />
  </div>
  <div class="catalog-item" v-else>
    <catalog-property :label="label" :value="value" />
  </div>
</template>

<script>
import CatalogList from "./CatalogList.vue";
import CatalogProperty from "./CatalogProperty.vue";
export default {
  components: { CatalogList, CatalogProperty },
  name: "CatalogItem",
  props: {
    label: String,
    value: {
      validator: function(el) {
        return Array.isArray(el) || typeof el === "string";
      },
    },
  },
};
</script>

