export default {
    methods: {
        initPasteUnformattedFields(refs) {
            refs.forEach(ref => {
                ref.addEventListener('paste', this.pastePlainText);
            });
        },
        cleanupPasteUnformattedFields(refs) {
            refs.forEach(ref => {
                ref.removeEventListener('paste', this.pastePlainText);
            });
        },
        pastePlainText: function (event) {
            event.preventDefault();
            let paste = (event.clipboardData || window.clipboardData).getData('text');
            const selection = window.getSelection();
            if (!selection.rangeCount) return false;
            selection.deleteFromDocument();
            selection.getRangeAt(0).insertNode(document.createTextNode(paste));
            selection.removeAllRanges();
        },
    }
}