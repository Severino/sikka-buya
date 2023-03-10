export default {
    data() {
        return {
            mounted: false,
            loaded: false
        }
    },
    mounted() {
        this.isMounted()
    },
    methods: {
        isLoaded() {
            this.mounted = true
            this._mountedAndLoadedChanged()
        },
        isMounted() {
            this.loaded = true
            this._mountedAndLoadedChanged()
        },
        _mountedAndLoadedChanged() {
            if (this.mounted && this.loaded) {
                this.mountedAndLoaded()
            }
        },
        mountedAndLoaded() {
            console.warn("You are not using the mounted and loaded mixin. Either implement the mountedAndLoaded method or remove the mixin!")
        }
    }
}