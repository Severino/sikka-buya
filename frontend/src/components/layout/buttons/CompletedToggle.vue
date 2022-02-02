<template>
  <toggle :value="toggleValue" @input="$emit('input', $event)">
    <template v-slot:active><Check class="active" /></template>
    <template v-slot:inactive><Check /></template>
  </toggle>
</template>


<script>
import Toggle from './Toggle.vue';
import Briefcase from 'vue-material-design-icons/Briefcase';
import Check from 'vue-material-design-icons/Check';

export default {
  name: 'CompletedButton',
  components: {
    Toggle,
    Briefcase,
    Check,
  },
  props: {
    value: Boolean,
  },
  computed: {
    toggleValue() {
      if (!this.value) return false;
      else return this.value;
    },
  },
};
</script>

<style lang="scss" scoped>
.toggle .active {
  color: $primary-color;
}
</style>