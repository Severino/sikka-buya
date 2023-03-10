<template>
  <div class="input-with-reset">
    <input
      :type="type"
      :value="value"
      @input="(event) => $emit('input', event.target.value)"
    />
    <button @click="() => $emit('reset')">
      <CloseIcon :size="20" />
    </button>
  </div>
</template>

<script>
import CloseIcon from 'vue-material-design-icons/Close';
export default {
  components: { CloseIcon },
  props: {
    value: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'text',
    },
  },
};
</script>

<style lang='scss' scoped></style>