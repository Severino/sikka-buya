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

        selectedItemsInGroup(group) {
            return group.items.filter(element => {
                return this.isSelected(element)
            });
        },
        selectionCountInGroup(group) {
            return this.selectedItemsInGroup(group).length
        },
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
    },
}