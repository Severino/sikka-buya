<template>
  <toggle :value="value" @input="$emit('input', $event)">
    <template v-slot:active><Check /></template>
    <template v-slot:inactive><TextBoxSearch /></template>
  </toggle>
</template>


<script>
import Toggle from "./Toggle.vue";
import TextBoxSearch from "vue-material-design-icons/TextBoxSearch";
import Check from "vue-material-design-icons/Check";

export default {
  name: "CompletedButton",
  components: {
    Toggle,
    TextBoxSearch,
    Check,
  },
  props: {
      value: Boolean
  }
};
</script>