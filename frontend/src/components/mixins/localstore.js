
export default function (name, variables = []) {
    return {
        data() {
            return {
                localstore_name: name,
                localstore_variables: variables
            }
        },
        mounted() {
            this.$nextTick(() => {
                let data = {}
                if (localStorage.getItem(this.localstore_name) != null) {
                    let data_str = localStorage.getItem(this.localstore_name)
                    if (data_str != null) {
                        try {
                            data = JSON.parse(data_str)
                        } catch (e) {
                            console.error("Could not parse stored data: ", e)
                        }
                    }

                    this.localstore_variables.forEach(key => {
                        if (Object.prototype.hasOwnProperty.call(this.$data, key)) {
                            this.$data[key] = data[key]
                        }
                    })
                }
            })
        },
        methods: {
            save() {
                const data = {}
                this.localstore_variables.forEach(key => {
                    try {
                        if (Object.prototype.hasOwnProperty.call(this.$data, key) && this.$data[key] != null) {
                            data[key] = this.$data[key]
                        }
                    } catch (e) {
                        console.error(`Could not stringify key '${key}' of localstore ${this.name}.`, e)
                    }
                })
                try {
                    localStorage.setItem(this.localstore_name, JSON.stringify(data))
                } catch (e) {
                    console.warn(e)
                }
            }
        }
    }
}