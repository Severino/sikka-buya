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
            if (obj[key] != undefined)
                url.searchParams.set(key, obj[key]);

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
     * All params in the URL string are strings.
     * So there are a few methods to get the respective
     * data type from the string directly.
     * 
     * If either the parameter is not found or 
     * a conversion is not possible, a default value is returned.
     */
    static getInteger(key, defaultValue) {
        let value = defaultValue
        let url = new URL(window.location)
        const queryParam = url.searchParams.get(key)
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