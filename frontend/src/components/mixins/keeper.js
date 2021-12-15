export default function (managedProperties = [], applyKeep = true) {
    return {
        created() {
            this.initKeep()
        },
        data() {
            return {
                keepManagedProperties: managedProperties
            }
        },
        methods: {
            initKeep: function () {
                let params = this.$route.query
                let managed = this._filterManaged(params)

                for (let name of Object.keys(managed)) {
                    this.$data[name] = managed[name]
                }
                if (applyKeep)
                    this.applyKeep(managed)
            },
            applyKeep() {
                console.warn("Overwrite appplyKeep or set applyKeep to false in the mixin!")
            },
            keep(options) {
                this.$router.replace(Object.assign({}, this.$route, { query: this._filterManaged(options) })).catch(() => { /* Avoid the redundand location error */ })
            },
            _filterManaged(options) {
                let managed = {}
                this.keepManagedProperties.forEach(prop => {
                    if (options[prop]) {
                        managed[prop] = options[prop]
                    }
                });
                return managed
            }
        }
    }
}