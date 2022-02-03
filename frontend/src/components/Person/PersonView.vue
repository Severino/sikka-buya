<template>
  <div class="person-view">
    <catalog-property
      :label="dynamicHeading('Münzherr', 'Münzherren', issuers)"
    >
      <person-list :value="issuers" />
    </catalog-property>
    <catalog-property
      :label="dynamicHeading('Oberherr', 'Oberherren', overlords)"
    >
      <person-list :value="overlords" />
    </catalog-property>

    <catalog-property label="Kalif">
      <person-list :value="caliph" />
    </catalog-property>

    <catalog-property v-if="hasPerson(heir)" label="Thronfolger">
      <person-list :value="heir" />
    </catalog-property>

    <catalog-property v-if="hasPerson(cutter)" label="Stempelschneider">
      <person-list :value="cutter" />
    </catalog-property>

    <catalog-property
      v-if="hasPerson(warden)"
      :label="dynamicHeading('Münzwardein', 'Münzwardeien', warden)"
    >
      <person-list :value="warden" />
    </catalog-property>
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
    cutter: [Object, Array],
    warden: [Object, Array],
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

<style lang="scss" scoped>
</style>