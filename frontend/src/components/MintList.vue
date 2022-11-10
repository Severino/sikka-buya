<template>
  <div class="mint-list">
    <multi-select-list>
      <Collapsible
        class="group"
        v-for="(group, idx) of groupedItems"
        :key="`mint-list-group-${idx}`"
      >
        <template #header>
          <div
            :class="{ active: selectionCountInGroup(group) }"
            class="selection-indicator"
          >
            <span class="count" v-if="selectionCountInGroup(group)">
              {{ selectionCountInGroup(group) }}
            </span>
            <div
              class="selection-visualizer"
              :style="{ height: selectionPercentageOfGroup(group) }"
            ></div>
          </div>
          <h4 v-if="group.name != '_'">{{ group.name }}</h4>
          <!-- <checkbox
            :id="`province-select-all-${idx}`"
            :value="allSelected(group)"
            @click.native.stop.prevent="toggleAllProvince(group)"
          /> -->
          <div class="fill"></div>

          <list-selection-tools
            @select-all="selectAllInGroup(group)"
            @unselect-all="removeAllFromGroup(group)"
            :allSelected="allSelected(group)"
            :noneSelected="noneSelected(group)"
          />
        </template>
        <ul>
          <MultiSelectListItem
            v-for="item of group.items"
            :key="'ruler-' + item.id"
            :selected="isSelected(item)"
            @checkbox-selected="checkboxSelected(item)"
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
import Checkbox from './forms/Checkbox.vue';

import ListSelectionTools from './interactive/ListSelectionTools.vue';

export default {
  components: {
    MultiSelectList,
    MultiSelectListItem,
    Collapsible,
    Checkbox,

    ListSelectionTools,
  },
  mixins: [MultiSelectListMixin],
  methods: {
    allSelected(group) {
      return group.items.every((item) => this.isSelected(item));
    },
    noneSelected(group) {
      return group.items.some((item) => this.isSelected(item));
    },
    selectAllInGroup(group) {
      let selection = this.selectedIds;
      let set = new Set([...selection, ...group.items.map((item) => item.id)]);
      selection = Array.from(set);
      this.selectionChanged(selection);
    },
    removeAllFromGroup(group) {
      let selection = this.selectedIds;
      selection = selection.filter(
        (id) => group.items.find((item) => item.id === id) === undefined
      );
      this.selectionChanged(selection);
    },
    toggleAllProvince(group) {
      if (this.allSelected(group)) {
        this.selectAllInGroup(group);
      } else {
        this.removeAllFromGroup(group);
      }
    },
    selectionPercentageOfGroup(group) {
      if (!group?.items?.length) return '0%';
      const cur = this.selectionCountInGroup(group);
      const max = group.items.length;
      return `${((cur / max) * 100).toFixed(2)}%`;
    },
  },
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
  position: relative;
  background-color: $light-gray;
  align-self: stretch;
  border-right: $border;
  padding: $tiny-padding;
  font-size: $xtra-small-font;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 14px;

  .selection-visualizer {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    background-color: $primary-color;
    z-index: 0;
  }

  .count {
    z-index: 1;
  }

  &.active {
    color: $white;
    font-weight: bold;
  }
  // color: $white;
  // background-color: $primary-color;
  // transform: scale(0.55);
  // padding: $small-padding;
  // box-shadow: inset $shadow;
  // border-radius: 3px;
}

.fill {
  flex: 1;
}
</style>