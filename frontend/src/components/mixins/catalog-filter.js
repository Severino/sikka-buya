export default function (storage) {
    return {
        created() {
            this.catalog_filter_mixin_load()
        },
        data() {
            return {
                catalog_filter_mixin_initData: {},
                catalog_filter_mixin_filterActive: false
            }
        },
        methods: {
            catalog_filter_mixin_reset(catalogFilterRef) {
                catalogFilterRef.resetFilters()
            },
            catalog_filter_mixin_load() {
                try {
                    const storedFilters = localStorage.getItem(storage)
                    this.catalog_filter_mixin_initData = JSON.parse(storedFilters);
                } catch (e) {
                    console.warn('Could not load stored filter values!', e);
                }
                console.log("LOADED", this.catalog_filter_mixin_initData)
            },
            catalog_filter_mixin_save(catalogFilterRef) {
                console.log("SAVE", catalogFilterRef.storageString)
                localStorage.setItem(storage, catalogFilterRef.storageString)
            },
            catalog_filter_mixin_updateActive(catalogFilterRef, excludedKeys = []) {
                const catalogFilters = Object.keys(
                    catalogFilterRef.activeFilters
                ).filter((key) => {
                    if (excludedKeys.indexOf(key) != -1) {
                        return false;
                    }

                    return true;
                });

                console.log(catalogFilters.length)

                this.catalog_filter_mixin_filterActive = catalogFilters.length > 0
            }
        }
    }
}