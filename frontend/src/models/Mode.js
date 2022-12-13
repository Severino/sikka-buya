export default class Mode {

    static get And() { return "and" }
    static get Or() { return "or" }


    static toggle(mode) {
        return (mode === Mode.And) ? Mode.Or : Mode.And
    }

    static mixin() {
        return {
            methods: {
                toggleMode(input) {
                    if (!input.mode) throw new Error("Require mode on input!")
                    input.mode = Mode.toggle(input.mode)
                }
            }
        }
    }
}