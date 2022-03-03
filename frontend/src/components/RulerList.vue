<template>
  <div class="ruler-list">
    <h3>Ruler List</h3>
    <multi-select-list>
      <div
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
          <span>{{ item.shortName }}</span>
          <span v-if="getDynasty(item)" class="subtitle">{{
            getDynasty(item)
          }}</span>
        </MultiSelectListItem>
      </div>
      <MultiSelectListItem
        v-for="item of items"
        :key="'ruler-' + item.id"
        :selected="isSelected(item)"
        @checkboxSelected="checkboxSelected(item)"
        @click.native="selectionChanged([item.id])"
        :style="{ color: item.color, borderColor: item.color }"
      >
        <span>{{ item.shortName || item.name }}</span>
        <span v-if="getDynasty(item)" class="subtitle">{{
          getDynasty(item)
        }}</span>
      </MultiSelectListItem>
    </multi-select-list>
  </div>
</template>

<script>
import MultiSelectList from './MultiSelectList.vue';
import MultiSelectListItem from './MultiSelectListItem.vue';
import MultiSelectListMixin from './mixins/multi-select-list.js';
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
  },
};
</script>

<style lang="scss">
.ruler-list li.select-list-item {
  background-color: red;
  border: 2px solid white;
  border-left: 15px solid white;
  margin-bottom: 3px;
}
</style>

<style lang="scss" scoped>
.subtitle {
  grid-column-start: 2;
  font-size: 0.7rem;
  color: $gray;
  opacity: 0.5;
}

.selected-but-unavailable {
  opacity: 0.5;
  margin-bottom: $padding;
}
</style>