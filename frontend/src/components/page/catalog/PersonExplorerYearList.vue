<template>
  <div class="person-explorer-year-list">
    <h6>Prägejahr(e)</h6>
    <p v-if="list.length == 0" class="error">
      Keine Typen mit dieser Person vorhanden
    </p>
    <div class="flex">
      <Button
        v-for="year of list"
        :key="'year-' + person.id + '-' + year"
        class="year-grid"
        :class="{ active: isActive(year) }"
        @click="activeChanged(year)"
      >
        {{ year }}
      </Button>
    </div>

    <span v-if="!hasActive" class="hint">Wählen Sie ein Prägejahr!</span>
  </div>
</template>

<script>
export default {
  props: {
    loading: Boolean,
    person: { type: Object, required: true },
    list: { type: Array, required: true },
    active: { type: Array, required: true },
  },
  methods: {
    isActive(year) {
      return this.active.indexOf(year) != -1;
    },
    activeChanged(year) {
      this.$emit('change', year);
    },
  },
  computed: {
    hasActive() {
      return Object.keys(this.active).length > 0;
    },
  },
};
</script>
