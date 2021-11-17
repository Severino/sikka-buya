<template>
  <div class="multi-select-list">
    <ul>
      <li
        v-for="item of items"
        :key="item.id"
        @click="selected(item)"
        :class="{ selected: isSelected(item) }"
      >
        <input
          v-if="selectedItems.length > 0"
          type="checkbox"
          :checked="isSelected(item)"
          @input.stop="added(item)"
          @click.stop
        />
        {{ item[attribute] }}
      </li>
    </ul>
    <!-- <ul>
      <li
        v-for="mint of unavailableMints"
        :key="`mint-unavail-list-item-${mint.id}`"
        @click="mintSelected(mint)"
        class="inactive"
        :class="{ selected: mint.selected }"
      >
        <input
          v-if="selectedMints.length > 0"
          type="checkbox"
          :checked="mint.selected"
          @input.stop="mintAdded($event, mint)"
          @click.stop
        />

        {{ mint.name }}
      </li>
    </ul> -->
  </div>
</template>

<script>
export default {
  name: 'MultiSelectList',
  props: {
    items: {
      type: Array,
      required: true,
    },
    attribute: {
      type: String,
      default: 'name',
    },
  },
  data() {
    return {
      selectedIds: [],
    };
  },
  methods: {
    added(item) {
      const selection = this.selectedIds;
      selection.push(item.id);
      this.selectionChanged(selection);
    },
    selected(item) {
      let add =
        this.selectedItems.length == 1 && this.selectedItems[0] == item.id
          ? false
          : true;

      if (add) {
        this.selectionChanged([item.id]);
      } else {
        this.selectionChanged([]);
      }
    },
    selectionChanged(selection) {
      this.selectedIds = selection;
      const selectedItems = this.$emit('selection-changed', this.selectedItems);
    },
    isSelected(item) {
      return this.selectedIds.indexOf(item.id) != -1;
    },
  },
  computed: {
    selectedItems() {
      return this.items.filter((item) => this.isSelected(item));
    },
  },
};

// mintAdded(event, mint) {
//   mint.selected = event.target.checked;
//   if (mint.selected) this.addActiveMint(mint);
//   else this.removeActiveMint(mint);

//   this.update();
// },
// addActiveMint(mint) {
//   this.selectedMints.push(mint);
//   mint.selected = true;
// },
// removeActiveMint(mint) {
//   const selectedMintPosition = this.selectedMints.findIndex(
//     (selectedMint) => selectedMint.id == mint.id
//   );
//   if (selectedMintPosition != -1) {
//     mint.selected = false;
//     this.selectedMints.splice(selectedMintPosition, 1);
//     return true;
//   }
//   return false;
// },
</script>

<style>
</style>