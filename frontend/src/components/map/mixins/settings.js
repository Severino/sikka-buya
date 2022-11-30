export default function (settings) {
    return {
        data() {
            return {
                overlay: null,
                overlaySettings: settings,
            }
        },
        methods: {
            resetSettings() {
                this.overlay.settings.reset();
                this.$emit('reset');
            },
            overlaySettingsChanged(e) {
                this.overlay.settings.change(e.currentTarget.name, e.currentTarget.value);
            },
            toggleSettings() {
                this.overlay.settings.toggle('uiOpen');
            },
        }
    }
}