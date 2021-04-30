<template>
  <div class="labeled-property">
    <div class="label">
      {{ label }}
    </div>
    <slot /> 
  </div>
</template>

<script>
export default {
  props: {
    label: String,
  },
};
</script>

<style scoped></style>
