export default function (managedProperties = []) {
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
            },
            keep(options) {
                this.$router.replace(Object.assign({}, this.$route, { query: this._filterManaged(options) }))
            },
            _filterManaged(all) {
                let managed = {}
                keepManagedProperties.forEach(prop => {
                    if (options[prop]) {
                        managed[prop] = options[prop]
                    }
                });
                return managed
            }
        }
    }
}