<template>
  <div class="multi-select-list">
    <ul>
      <slot />
    </ul>
  </div>
</template>

<script>
import Button from './layout/buttons/Button.vue';
export default {
  components: { Button },
  name: 'MultiSelectList',
  // methods: {
  //   checkboxSelect(item) {
  //     const selection = this.selectedIds;
  //     const itemIdx = selection.indexOf(item.id);

  //     let added = [];
  //     let removed = [];
  //     if (itemIdx != -1) {
  //       removed = selection.splice(itemIdx, 1);
  //     } else {
  //       selection.push(item.id);
  //       added = item.id;
  //     }

  //     console.log('CHECKBOX', added);
  //     this.selectionChanged(selection, {
  //       added,
  //       removed,
  //     });
  //   },
  //   selected(item) {
  //     const oldSelection = this.selectedItems;
  //     let add =
  //       this.selectedItems.length == 1 && this.selectedItems[0] == item.id
  //         ? false
  //         : true;

  //     let selection = [];
  //     let added = [];
  //     let removed = [];
  //     if (add) {
  //       removed = oldSelection.filter((i) => i == item.id);
  //       added = [item.id];
  //       selection = added;
  //     } else {
  //       removed = [item.id];
  //       added = [];
  //       selection = added;
  //     }

  //     console.log('CLICK', added);

  //     this.selectionChanged(selection, {
  //       added,
  //       removed,
  //     });
  //   },
  //   selectionChanged(selection, { added = [], removed = [] } = {}) {
  //     console.log('HUHU');
  //     this.$emit('selectionChanged', selection, { added, removed });
  //   },
  //   isSelected(item) {
  //     return this.selectedIds.indexOf(item.id) != -1;
  //   },
  //   getItemText(index) {
  //     return this.items[index].text == null
  //       ? 'Kein Text vorhanden'
  //       : this.items[index].text;
  //   },
  //   getItemStyle(index) {
  //     if (!this.items[index].style) return '';
  //     return this.items[index].style
  //       ? Object.entries(this.items[index].style)
  //           .map((pair) => pair.join(': '))
  //           .join(';') + ';'
  //       : '';
  //   },
  // },
  // computed: {
  //   selectionActive() {
  //     return this.selectedIds.length > 0;
  //   },
  //   selectedItems() {
  //     return this.items.filter((item) => this.isSelected(item));
  //   },
  // },
};
</script>

<style lang="scss">
.multi-select-list {
  .select-list-item {
    display: grid;
    grid-template-columns: 30px 1fr;

    & > *:not(.checkbox) {
      align-self: center;
    }
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
}
</style>