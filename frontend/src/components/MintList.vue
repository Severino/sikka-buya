<template>
  <div class="mint-list">
    <h3>Mint List</h3>
    <multi-select-list>
      <div
        class="group"
        v-for="(group, idx) of groupedItems"
        :key="`mint-list-group-${idx}`"
      >
        <h4 v-if="group.name != '_'">{{ group.name }}</h4>

        <MultiSelectListItem
          v-for="item of group.items"
          :key="'ruler-' + item.id"
          :selected="isSelected(item)"
          @checkboxSelected="checkboxSelected(item)"
          @click.native="selectionChanged([item.id])"
          :style="{ color: item.color, borderColor: item.color }"
        >
          <span>{{ item.name }}</span>
        </MultiSelectListItem>
      </div>
    </multi-select-list>
  </div>
</template>

<script>
import MultiSelectList from './MultiSelectList.vue';
import MultiSelectListItem from './MultiSelectListItem.vue';
import MultiSelectListMixin from './mixins/multi-select-list.js';

export default {
  components: { MultiSelectList, MultiSelectListItem },
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

<style lang="scss" scoped>
h4 {
  color: #333;
}
</style>