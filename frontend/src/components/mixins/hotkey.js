export default {
    mounted() {
        this._hotkeyKeyDown = this._hotKeyDown.bind(this)
        document.addEventListener("keydown", this._hotkeyKeyDown)
    },
    beforeDestroy() {
        document.removeEventListener("keydown", this._hotkeyKeyDown)
    },
    methods: {
        _hotKeyDown(...args) {
            this.handleHotkey(...args)
        },
        handleHotkey() {
            console.error("Override handleHotkey function or remove the mixin!")
        }
    }
}