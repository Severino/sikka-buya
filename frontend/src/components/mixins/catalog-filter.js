export default function (storage) {
    return {
        created() {
            this.catalog_filter_mixin_load()
        },
        data() {
            return {
                catalog_filter_mixin_initData: {},
                catalog_filter_mixin_filterMode: {},
                catalog_filter_mixin_filterActive: false
            }
        },
        methods: {
            // Can be overloaded in component.
            // E.g. If you want to save an additional object
            // pass it as second arg to the 'catalog_filter_mixin_save(red, obj)
            // And remove it from the data after it's loaded. 
            catalog_filter_mixin_loaded(data) {
                return;
            },
            catalog_filter_mixin_reset(catalogFilterRef) {
                catalogFilterRef.resetFilters()
            },
            catalog_filter_mixin_load() {
                try {
                    const storedFilters = localStorage.getItem(storage)
                    const loadedData = JSON.parse(storedFilters)
                    this.catalog_filter_mixin_loaded(loadedData)
                    this.catalog_filter_mixin_initData = loadedData
                } catch (e) {
                    console.warn('Could not load stored filter values!', e);
                }
            },
            catalog_filter_mixin_save(catalogFilterRef, obj = {}) {
                const data = Object.assign({}, catalogFilterRef.storage, obj)
                localStorage.setItem(storage, JSON.stringify(data))
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

                this.catalog_filter_mixin_filterActive = catalogFilters.length > 0
            }
        }
    }
}