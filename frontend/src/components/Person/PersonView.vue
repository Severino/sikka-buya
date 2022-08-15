<template>
  <div class="person-view">
    <catalog-property label="Münzherr(en)">
      <div>
        <person-list :value="issuers" :class="multipleIssuersClass" />
      </div>
    </catalog-property>
    <catalog-property label="Oberherr(en)">
      <person-list :value="overlords" />
    </catalog-property>

    <div class="caliph-group" :class="{ 'col-2': hasPerson(heir) }">
      <catalog-property label="Kalif">
        <person-list :value="caliph" />
      </catalog-property>

      <catalog-property
        v-if="hasPerson(heir)"
        label="Thronfolger des Kalifen"
        class="heir-grid"
      >
        <person-list :value="heir" />
      </catalog-property>
    </div>
  </div>
</template>

<script>
import CatalogProperty from '../catalog/CatalogProperty.vue';
import PersonList from './PersonList.vue';
export default {
  components: { PersonList, CatalogProperty },
  props: {
    overlords: Array,
    issuers: Array,
    caliph: Object,
    heir: Object,
  },
  methods: {
    dynamicHeading(singular, plural, array) {
      return array?.length == 1 ? singular : plural;
    },
    hasPerson(persons) {
      return !(
        persons == null ||
        (persons.length != null && persons.length === 0)
      );
    },
  },
  computed: {
    multipleIssuersClass() {
      return this.issuers.length > 1 ? 'issuer-grid' : null;
    },
  },
};
</script>

<style lang="scss">
.caliph-group .catalog-property {
  background-color: transparent;
}

.person-view {
  .issuer-grid ul {
    display: grid;
    gap: $padding;
    grid-template-columns: 1fr 1fr;
  }
}
</style>

<style lang="scss" scoped>
.heir-grid {
  border: 1px dotted $primary-color;
  padding: $small-padding $padding;
  margin: $padding/2 $padding;
}

.caliph-group {
  display: grid;
  gap: $padding;
  background-color: $white;
}
</style>