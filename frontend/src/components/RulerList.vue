<template>
  <div class="ruler-list">
    <multi-select-list>
      <ruler-list-section
        v-if="
          Array.isArray(selectedUnavailable) && selectedUnavailable.length > 0
        "
        :items="selectedUnavailable"
        :selectedIds="selectedIds"
        :styler="unavailableSelectedStyler"
        @selection-changed="(item) => this.checkboxSelected(item)"
      />
      <ruler-list-section
        :items="items"
        :selectedIds="selectedIds"
        :styler="availableStyler"
        @selection-changed="(item) => this.checkboxSelected(item)"
      />
      <ruler-list-section
        :items="unavailable"
        :selectedIds="selectedIds"
        :styler="unavailableSelectedStyler"
        @selection-changed="(item) => this.checkboxSelected(item)"
      />
    </multi-select-list>
  </div>
</template>

<script>
import MultiSelectList from './MultiSelectList.vue';
import MultiSelectListItem from './MultiSelectListItem.vue';
import MultiSelectListMixin from './mixins/multi-select-list.js';
import Person from '../utils/Person';
import RulerListSection from './RulerListSection.vue';
export default {
  props: {
    selectedUnavailable: {
      type: Array,
      validator: (items) => {
        return items.every((item) => item && item.hasOwnProperty('id'));
      },
    },
    unavailable: {
      type: Array,
      validator: (items) => {
        return items.every((item) => item && item.hasOwnProperty('id'));
      },
    },
  },
  mixins: [MultiSelectListMixin],
  components: {
    MultiSelectList,
    MultiSelectListItem,
    RulerListSection,
  },
  methods: {
    getDynasty(item) {
      if (item?.dynasty?.name && item?.dynasty?.id != 1) {
        return item?.dynasty?.name;
      } else return null;
    },
    getRulerName(ruler) {
      return Person.getName(ruler);
    },
    availableStyler(item) {
      return { color: item.color, borderColor: item.color };
    },
    unavailableSelectedStyler(item) {
      const baseStyle = this.availableStyler(item);
      baseStyle.opacity = 0.5;
      return baseStyle;
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

  span {
    color: $black;
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