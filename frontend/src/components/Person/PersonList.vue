<template>
  <div class="person-list">
    <span v-if="value == null || (Array.isArray(value) && value.length == 0)"
      >-</span
    >
    <ul v-else-if="Array.isArray(value) && value.length > 1">
      <li v-for="(item, index) of value" :key="`person-${index}-${item.id}`">
        {{ item.name }}
      </li>
    </ul>
    <span v-else>{{ Array.isArray(value) ? value[0].name : value.name }}</span>
  </div>
</template>

<script>
export default {
  props: {
    value: [Array, Object, null],
  },
  mounted() {
    console.log(this.value);
  },
};
</script>

<style>
</style>