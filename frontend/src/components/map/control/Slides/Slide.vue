<template>
  <div class="slide slideshow-item">
    <div class="button" @click.stop.prevent="() => $emit('select')">
      {{ name }}
    </div>
    <div
      class="button delete-button"
      @click.stop.prevent="() => $emit('delete')"
    >
      <DeleteIcon :size="14" />
    </div>
  </div>
</template>

<script>
import PlusIcon from 'vue-material-design-icons/Plus.vue';
import DeleteIcon from 'vue-material-design-icons/Delete.vue';

export default {
  props: {
    name: String,
    options: Object,
  },
  components: {
    PlusIcon,
    DeleteIcon,
  },
};
</script>

<style lang="scss">
.slide {
  display: flex;
  min-width: 32px;
  padding: 0;
  > * {
    padding: $padding/2 $padding;
  }

  .button:not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .button:not(:first-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left-width: 0;
  }
}
</style>