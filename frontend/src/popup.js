export default class PopupHandler {


    constructor(vue) {
        this.activePopup = null
        this.vue = vue
        this.target

        this.onGlobalClick = this.onGlobalClick.bind(this)

        this.openedPopup = null
    }

    init(target) {
        this.target = target
        target.addEventListener("click", this.onGlobalClick)
        this.vue.$root.$on("popup-opened", this.popupOpened)
        this.vue.$root.$on("popup-closed", this.popupClosed)
    }

    popupOpened(component) {
        if (this.openedPopup) {
            this.openedPopup.close()
        }
        this.openedPopup = component
    }


    popupClosed(component) {
        if (this.openedPopup.$el == component.$el) {
            this.openedPopup = null
        }
    }


    onGlobalClick() {
        if (this.openedPopup) {
            this.openedPopup.close()
        }
    }

    cleanup() {
        this.target.removeEventListener("pointerdown", this.onGlobalClick)
        this.vue.$root.$off("popup-opened", this.popupOpened)
        this.vue.$root.$off("popup-closed", this.popupClosed)
    }

}