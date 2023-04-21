export default {
    props: {
        items: { type: Array, required: true },
        selectedIds: { type: Array, required: true },
    },
    methods: {
        isSelected(item) {
            return this.selectedIds.indexOf(item.id) != -1;
        },
        selectionChanged({ active = [], added = [], removed = [] } = {}) {
            this.$emit('selectionChanged', { active, added, removed });
        },
        checkboxSelected(item) {
            let selection = this.selectedIds;
            const idx = selection.indexOf(item.id);
            console.log(idx)
            if (idx == -1) {
                selection.push(item.id);
                this.selectionChanged({ active: selection, addeed: [item.id], removed: [] });
            } else {
                selection.splice(idx, 1);
                this.selectionChanged({ active: selection, addeed: [], removed: [item.id] });
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
            return !group.items.some((item) => this.isSelected(item));
        },
        selectAllInGroup(group) {
            const groupItems = group.items.map((item) => item.id)
            let added = groupItems.filter(id =>
                this.selectedIds.indexOf(id) == -1
            )

            const set = new Set([...this.selectedIds, ...groupItems]);
            const active = Array.from(set);
            this.selectionChanged({ active, added });
        },
        removeAllFromGroup(group) {
            let removed = []
            let active = this.selectedIds.filter(
                (id) => {
                    let inGroup = group.items.find((item) => item.id === id) !== undefined
                    if (inGroup) removed.push(id)
                    return !inGroup
                }
            );

            this.selectionChanged({ active, removed });
        },
    },
}