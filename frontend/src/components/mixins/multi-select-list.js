export default {
    props: {
        items: { type: Array, required: true },
        selectedIds: { type: Array, required: true },
    },
    methods: {
        isSelected(item) {
            return this.selectedIds.indexOf(item.id) != -1;
        },
        selectionChanged(items) {
            this.$emit('selectionChanged', items);
        },
        checkboxSelected(item) {
            let selection = this.selectedIds;
            const idx = selection.indexOf(item.id);
            if (idx == -1) {
                selection.push(item.id);
                this.selectionChanged(selection);
            } else {
                selection.splice(idx, 1);
                this.selectionChanged(selection);
            }
        },
        group() {
            return this.items
        },
        createGroup(name, items) {
            return {
                name,
                items
            }
        },
        selectedItemsInGroup(group) {
            return group.items.filter(element => {
                return this.isSelected(element)
            });
        },
        selectionCountInGroup(group) {
            return this.selectedItemsInGroup(group).length
        }
    },
}