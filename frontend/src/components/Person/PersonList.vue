<template>
  <div class="person-list">
    <span v-if="value == null || (Array.isArray(value) && value.length == 0)">{{
      missingText
    }}</span>
    <ul v-else-if="Array.isArray(value)">
      <li v-for="(item, index) of value" :key="`person-${index}-${item.id}`">
        {{ item.name }}
      </li>
    </ul>
    <ul v-else>
      <li>{{ value.name }}</li>
    </ul>
  </div>
</template>

<script>
import StringUtils from '../../utils/StringUtils';
export default {
  props: {
    value: [Array, Object, null],
  },
  computed: {
    missingText() {
      return StringUtils.missingText;
    },
  },
};
</script>
