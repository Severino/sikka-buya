<template>
  <div class="slide slideshow-item">
    <div
      class="number-indicator"
      v-if="number"
      @click.stop.prevent="() => $emit('select')"
    >
      {{ number }}
    </div>
    <div
      v-if="name"
      class="text-content"
      @click.stop.prevent="() => $emit('select')"
    >
      {{ name }}
    </div>
  </div>
</template>

<script>
import DotsVerticalIcon from 'vue-material-design-icons/DotsVertical.vue';
import PlusIcon from 'vue-material-design-icons/Plus.vue';
import PopupActivator from '../../../Popup/PopupActivator.vue';

export default {
  props: {
    name: [String, Number],
    number: Number,
    options: Object,
  },
  components: {
    DotsVerticalIcon,
    PlusIcon,
    PopupActivator,
  },
};
</script>

<style lang="scss">
.slide {
  display: grid;
  grid-template-columns: auto auto;
  border: $border;
  border-radius: $border-radius;
  background-color: $white;
  @include interactive();

  &.active {
    outline: 1px solid $primary-color;

    .number-indicator {
      background-color: $primary-color;
    }
  }

  .number-indicator {
    color: $white;
    font-size: $xtra-small-font;
    font-weight: bold;
    padding: 0;
    grid-column: span 2;
    text-align: center;

    border-top-right-radius: $border-radius;
    border-top-left-radius: $border-radius;

    background-color: $gray;

    @include interactive();
  }

  min-width: 32px;
  padding: 0;
  > * {
    padding: math.div($padding, 2) $padding;
  }
}
</style>