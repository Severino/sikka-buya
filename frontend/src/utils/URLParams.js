export default class URLParams {

    /**
 * Update existing params and push the state to the history object. Params that are no in the 
 * query string, will not be updated!
 *  
 * @param {*} obj 
 */
    static update(obj) {
        const url = this.updateURL(obj)
        window.history.replaceState({}, '', url);
    }


    /**
 * Update existing params. Params that are no in the 
 * query string, will not be updated!
 *  
 * @param {*} obj 
 */
    static updateURL(obj) {
        let url = new URL(window.location);

        url.searchParams.forEach((_, key) => {
            if (obj[key] != undefined) {
                if (Array.isArray(obj[key])) {
                    let arr = obj[key]
                    let val = arr.pop()
                    if (val) {
                        url.searchParams.set(key, val)
                        while (arr.length > 0) {
                            let val = arr.pop()
                            url.searchParams.append(key, val)
                        }

                    }
                } else {
                    url.searchParams.set(key, obj[key]);
                }
            }
        })
        return url
    }

    /**
     * Removes all existing parmameters and sets all 
     * specified parameters. 
     * 
     * @param {*} params 
     * @returns 
     */
    static apply(params) {
        let url = new URL(window.location)
        url.searchParams.forEach((_, key) => {
            url.searchParams.delete(key)
        })

        for (let [key, value] of Object.entries(params)) {
            if (value != null)
                url.searchParams.set(key, value)
        }

        return url
    }

    /**
     * Retrieves an array by a key.
     * Also transforms a single value into an 
     * array if only one is present.
     * 
     * @param {String} key 
     * @returns {Array | null} Array or null when no value was found.
     */
    static getAll(key) {
        let arr = null
        let url = new URL(window.location);

        if (url.searchParams.has(key)) {
            arr = url.searchParams.getAll(key)
        }
        return arr
    }


    /**
     * All params in the URL string are strings.
     * So there are a few methods to get the respective
     * data type from the string directly.
     * 
     * If either the parameter is not found or 
     * a conversion is not possible, a default value is returned.
     */
    static getInteger(key, defaultValue, allowNull = true) {
        let value = defaultValue
        let url = new URL(window.location)
        const queryParam = url.searchParams.get(key)

        if (allowNull && url.searchParams.has(key) && queryParam == null) {
            return null
        }

        let integer = parseInt(queryParam)
        if (queryParam && !isNaN(integer)) {
            value = integer
        }
        return value

    }

    /**
    * All params in the URL string are strings.
    * So there are a few methods to get the respective
    * data type from the string directly.
    * 
    * If either the parameter is not found or 
    * a conversion is not possible, a default value is returned.
    */
    static getBoolean(key, defaultValue) {
        let value = defaultValue
        let url = new URL(window.location)
        const queryParam = url.searchParams.get(key)

        if (queryParam !== undefined) {
            if (queryParam === "true") value = true
            else if (queryParam === "false") value = false
        }

        return value
    }
}