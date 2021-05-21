export default class NavigationGuard {

    constructor(component) {
        console.log("HELLO WORLD")
        if (!component || !component.guard) throw new Error("Your component must implement a guard prop, data property, method or computed value!")
        this.component = component
        this.active = true
    }

    enable() {
        window.onbeforeunload = (event) => {
            if (this.isGuarded()) {
                event.returnValue = "Navigation prevented!";
                return "";
            } else {
                this.disableBeforeUnload()
                return true;
            }
        };
    }

    beforeRouteLeave(to, from, next, message) {
        if (this.active) {
            let proceed = false
            if (this.isGuarded()) {
                if (window.confirm(message)) {
                    proceed = true
                }
            } else {
                proceed = true
            }

            if (proceed) {
                this.disableBeforeUnload()
                next()
            } else {
                next(false)
            }
        } else next()
    }

    disable() {
        this.active = false
        this.disableBeforeUnload()
    }

    disableBeforeUnload() {
        window.onbeforeunload = null;
    }

    isGuarded() {
        if (typeof this.component.guard == 'function') {
            return this.component.guard()
        } else {
            return this.component.guard
        }
    }
}