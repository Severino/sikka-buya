<template>
  <div class="multi-select-list">
    <Button
      :class="{ grayedOut: !selectionActive, nonInteractive: !selectionActive }"
      class="clear-filter-btn"
      @click="clearSelection"
      >Filter Zurücksetzen</Button
    >
    <ul>
      <li
        v-for="item of items"
        :key="item.id"
        @click="selected(item)"
        :class="{ selected: isSelected(item) }"
      >
        <input
          :class="{
            grayedOut: !selectionActive,
            nonInteractive: !selectionActive,
          }"
          type="checkbox"
          :checked="isSelected(item)"
          @input.stop="checkboxSelect($event, item)"
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
import Button from './layout/buttons/Button.vue';
export default {
  components: { Button },
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
    clearSelection() {
      this.selectionChanged([]);
    },
    checkboxSelect(event, item) {
      const selection = this.selectedIds;
      if (event.target.checked) {
        selection.push(item.id);
      } else {
        const itemIdx = selection.indexOf(item.id);
        if (itemIdx != -1) {
          selection.splice(itemIdx, 1);
        }
      }
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
        this.clearSelection();
      }
    },
    selectionChanged(selection) {
      this.selectedIds = selection;
      console.log('selectionChanged');
      this.$emit('selectionChanged', this.selectedItems);
    },
    isSelected(item) {
      return this.selectedIds.indexOf(item.id) != -1;
    },
  },
  computed: {
    selectionActive() {
      return this.selectedIds.length > 0;
    },
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

<style lang="scss">
.multi-select-list {
  > .clear-filter-btn {
    margin-bottom: 15px;
    background-color: $primary-color;
    color: $white;
    font-weight: bold;
    text-align: center;
    border-radius: $border-radius;
    justify-content: center;
    padding: 3px 10px;
  }
  .hidden {
    visibility: hidden;
  }

  .grayedOut {
    opacity: 0.3;
    background-color: gray;
  }

  .nonInteractive {
    pointer-events: none;
  }

  ul {
    margin-left: -15px;
  }
}
</style>