import { FilterType, filterConfig, filterKeys, filterNameMap } from "../../config/catalog_filter";
import URLParams from "../../utils/URLParams";

import Query from "../../database/query";

export default function (storage, urlParamsConfig) {
    return {
        created() {
            if (!this.catalog_filter_mixin_override_with_query_params()) {
                console.log("Loaded stored filter values!")
                this.catalog_filter_mixin_load()
            } else console.log("Override with query params!")
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
            catalog_filter_mixin_override_with_query_params() {
                const data = {}
                const url = new URL(window.location)
                const params = url.searchParams

                params.forEach((value, key) => {
                    if (filterNameMap[key]) {
                        if (!data[key]) {
                            switch (filterNameMap[key].type) {
                                case FilterType.text:
                                    data[key] = URLParams.get(key, "string")
                                    break
                                case FilterType.threeWay:
                                    data[key] = URLParams.get(key, "bool")
                                    break
                                case FilterType.multiSelect:
                                    data[key] = URLParams.getMultiSelect(key, 'int')
                                    break
                                // case FilterType.multiSelect2D:
                                //     data[key] = URLParams.getArray2D(value)
                                //     break
                                default:
                                    throw new Error(`Unknown filter type "${filterNameMap[key].type}"!`)
                            }
                        } else {
                            console.warn(`Found two filters of type "${key}"!`)
                        }

                    }
                })

                // function capitalize(name) {
                //     return `${name[0].toUpperCase() + name.slice(1)}`
                // }

                // function getQueryName(name, id) {
                //     return `get${capitalize(name)}${id}`
                // }

                // const body = []
                //     ;[
                //         ...filterConfig[FilterType.multiSelect],
                //         ...filterConfig[FilterType.multiSelect2D]
                //     ].forEach(({ name }) => {
                //         if (data[name]) {
                //             data[name].value.forEach((obj) => {
                //                 body.push(`${getQueryName(name, obj.id)}:get${capitalize(name)}(id: ${obj.id}){id name}`)
                //             })
                //         }
                //     })

                // const queriedData = (await Query.raw(`query {${body.join('\n')}}`, {}, true)).data.data

                //     ;[
                //         ...filterConfig[FilterType.multiSelect],
                //         ...filterConfig[FilterType.multiSelect2D]
                //     ].forEach(({ name }) => {
                //         if (data[name]) {
                //             data[name].value.forEach((obj) => {
                //                 obj.value = queriedData[getQueryName(name, obj.id)]
                //             })
                //         }
                //     })

                //     console.log(data)

                this.catalog_filter_mixin_initData = data
                return Object.keys(data).length > 0
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