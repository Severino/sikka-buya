<template>
  <div class="mint-list">
    <multi-select-list>
      <Collapsible
        class="group"
        v-for="(group, idx) of groupedItems"
        :key="`mint-list-group-${idx}`"
      >
        <template #header>
          <h4 v-if="group.name != '_'">{{ group.name }}</h4>
          <div
            v-if="selectionCountInGroup(group) != 0"
            class="selection-indicator div-icon circle-div-icon"
          >
            {{ selectionCountInGroup(group) }}
          </div>
        </template>
        <ul>
          <MultiSelectListItem
            v-for="item of group.items"
            :key="'ruler-' + item.id"
            :selected="isSelected(item)"
            @checkboxSelected="checkboxSelected(item)"
            @click.native="selectionChanged([item.id])"
            :class="{ available: item.available }"
            :style="{ color: item.color, borderColor: item.color }"
          >
            <span>{{ item.name }}</span>
          </MultiSelectListItem>
        </ul>
      </Collapsible>
    </multi-select-list>
  </div>
</template>

<script>
import MultiSelectList from './MultiSelectList.vue';
import MultiSelectListItem from './MultiSelectListItem.vue';
import MultiSelectListMixin from './mixins/multi-select-list.js';
import Collapsible from './layout/Collapsible.vue';
import Sort from '../utils/Sorter';

export default {
  components: { MultiSelectList, MultiSelectListItem, Collapsible },
  mixins: [MultiSelectListMixin],
  computed: {
    groupedItems() {
      let groups = {};

      this.items.forEach((mint) => {
        const province = mint.province?.name ? mint.province.name : '_';
        if (!groups[province]) {
          groups[province] = {
            id: mint.province?.id,
            name: province,
            items: [],
          };
        }
        groups[province].items.push(mint);
      });

      const groupArray = Object.values(groups);

      groupArray.sort(Sort.stringPropAlphabetically('name'));

      return groupArray;
    },
  },
};
</script>

<style lang="scss">
.mint-list {
  .collapsible {
    border-bottom: $border;
    header {
      h4 {
        margin: $small-padding 0;
        padding: $padding/2 $padding;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
h4 {
  color: #333;
}

.select-list-item {
  opacity: 0.5;
}
.available {
  opacity: 1;
}

.selection-indicator {
  color: $white;
  background-color: $primary-color;
  transform: scale(0.75);
}
</style>