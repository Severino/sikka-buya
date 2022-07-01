<template>
  <div class="catalog-filter-search">
    <h1>Filtersuche</h1>
    <p>
      Mit der Filtersuche können Sie alle im Typenkatalog verfügbaren Typen mit
      sehr detailiert durchsuchen, indem Sie verschiedenste Filter verwenden und
      kombinieren können.
    </p>
    <catalog-filter />
  </div>
</template>

<script>
import LabeledInputContainer from '../../LabeledInputContainer.vue';
import CatalogFilter from './CatalogFilter.vue';

export default {
  components: { CatalogFilter, LabeledInputContainer },
};
</script>

<style lang="scss" scoped>
p {
  max-width: 512px;
}
</style>