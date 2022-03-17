<template>
  <div class="person-view">
    <catalog-property
      :label="dynamicHeading('Münzherr', 'Münzherren', issuers)"
    >
      <div class="issuer-grid">
        <div v-for="issuer in issuers" :key="`issuer-${issuer.id}`">
          {{ issuer.name }}
        </div>
      </div>
    </catalog-property>
    <catalog-property
      :label="dynamicHeading('Oberherr', 'Oberherren', overlords)"
    >
      <person-list :value="overlords" />
    </catalog-property>

    <div class="caliph-group" :class="{ 'col-2': hasPerson(heir) }">
      <catalog-property label="Kalif">
        <person-list :value="caliph" />
      </catalog-property>

      <catalog-property
        v-if="hasPerson(heir)"
        label="Thronfolger"
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
};
</script>

<style lang="scss">
.caliph-group .catalog-property {
  background-color: transparent;
}
</style>

<style lang="scss" scoped>
.heir-grid {
  border: 1px dotted $primary-color;
  padding: $small-padding $padding;
  margin: $padding/2 $padding;
}

.issuer-grid {
  display: grid;
  gap: $padding;
  grid-template-columns: 1fr 1fr;
}

.caliph-group {
  display: grid;
  gap: $padding;
  background-color: $white;
}
</style>