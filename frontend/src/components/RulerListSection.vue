<template>
  <ul
    class="ruler-list-section"
    v-if="Array.isArray(items) && items.length > 0"
  >
    <MultiSelectListItem
      v-for="item of items"
      :key="'ruler-' + item.id"
      :selected="isSelected(item)"
      @checkbox-selected="() => $emit('selection-changed', item)"
      @click.native="() => $emit('selection-changed', item)"
      :style="styler(item)"
    >
      <template v-slot:before>
        <div
          class="color-indicator"
          :class="{ 'color-indicator-selected': isSelected(item) }"
        ></div>
      </template>
      <span
        >{{ getRulerName(item) }}
        <span v-if="$store.state.debug" class="debug">({{ item.id }})</span>
        <span v-if="getDynasty(item)" class="dynasty">{{
          getDynasty(item)
        }}</span></span
      >
    </MultiSelectListItem>
  </ul>
</template>

<script>
import MultiSelectList from './MultiSelectList.vue';
import MultiSelectListItem from './MultiSelectListItem.vue';
import MultiSelectListMixin from './mixins/multi-select-list.js';
import Person from '../utils/Person';
export default {
  props: {
    items: {
      type: Array,
      validator: (items) => {
        return items.every((item) => item && item.hasOwnProperty('id'));
      },
    },
    selectedIds: Array,
    styler: {
      type: Function,
      default: () => {},
    },
  },
  components: {
    MultiSelectList,
    MultiSelectListItem,
  },
  mixins: [MultiSelectListMixin],
  methods: {
    getDynasty(item) {
      if (item?.dynasty?.name && item?.dynasty?.id != 1) {
        return item?.dynasty?.name;
      } else return null;
    },
    getRulerName(ruler) {
      return Person.getName(ruler);
    },
  },
};
</script>

<style lang="scss">
.ruler-list {
  li {
    border: none;
    border-radius: 0;
    padding-left: 5px;
  }

  .multi-select-list .select-list-item {
    grid-template-columns: auto 30px 1fr;
  }

  .color-indicator {
    $size: 1em;
    width: math.div($size, 3);
    height: $size;
    border-radius: $border-radius;
    border: 3px solid currentColor;
    background-color: currentColor;
    margin-right: 5px;
  }
}
</style>

<style lang="scss" scoped>
.dynasty {
  font-size: 0.7rem;
  color: $gray;
}

.selected-but-unavailable {
  opacity: 0.5;
  margin-bottom: $padding;
}
</style>