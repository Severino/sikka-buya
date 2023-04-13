<template>
  <div class="slide slideshow-item" @click.stop.prevent="() => $emit('select')">
    <div
      class="number-indicator"
      v-if="number"
    >
      {{ number }}
    </div>
    <div class="slide-row-container">
      <SlideRow
        v-for="row in rows"
        :key="row.text"
        :icon="row.icon"
        :text="row.text"
      />
    </div>
  </div>
</template>

<script>
import DotsVerticalIcon from 'vue-material-design-icons/DotsVertical.vue';
import PlusIcon from 'vue-material-design-icons/Plus.vue';
import PopupActivator from '../../../Popup/PopupActivator.vue';
import SlideRow from './SlideRow.vue';

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
    SlideRow
  },
  computed: {
    rows() {
      return this.options?.display?.rows?.length > 0 ? this.options.display.rows : [];
    }
  }
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

  >* {
    padding: math.div($padding, 2) $padding;
  }
}
</style>

<style lang="scss" scoped>
.slide-row-container{

}
</style>