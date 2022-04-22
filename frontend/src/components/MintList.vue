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
      groupArray.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });

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
</style>