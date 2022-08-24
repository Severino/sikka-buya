<template>
  <div class="ruler-list">
    <multi-select-list>
      <ul
        class="selected-but-unavailable"
        v-if="selectedUnavailable.length > 0"
      >
        <MultiSelectListItem
          v-for="item of selectedUnavailable"
          :key="'ruler-' + item.id"
          :selected="isSelected(item)"
          @checkboxSelected="checkboxSelected(item)"
          @click.native="selectionChanged([item.id])"
          :style="{ color: item.color, borderColor: item.color }"
        >
          <span
            >{{ getRulerName(item) }}
            <span v-if="getDynasty(item)" class="dynasty">{{
              getDynasty(item)
            }}</span></span
          >
        </MultiSelectListItem>
      </ul>
      <ul>
        <MultiSelectListItem
          v-for="item of items"
          :key="'ruler-' + item.id"
          :selected="isSelected(item)"
          @checkboxSelected="checkboxSelected(item)"
          @click.native="selectionChanged([item.id])"
          :style="{ color: item.color, borderColor: item.color }"
        >
          <span
            >{{ getRulerName(item) }}
            <span v-if="getDynasty(item)" class="dynasty">{{
              getDynasty(item)
            }}</span></span
          >
        </MultiSelectListItem>
      </ul>
    </multi-select-list>
  </div>
</template>

<script>
import MultiSelectList from './MultiSelectList.vue';
import MultiSelectListItem from './MultiSelectListItem.vue';
import MultiSelectListMixin from './mixins/multi-select-list.js';
import Person from '../utils/Person';
export default {
  props: {
    selectedUnavailable: Array,
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
.ruler-list li {
  border: none;
  border-radius: 0;
  padding-left: 5px;
}

.ruler-list li.select-list-item {
  border-left: 10px solid white;
  margin-bottom: 3px;
  align-items: center;
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