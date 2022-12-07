export default class URLParams {



    /**
     * Removes all existing parmameters and sets all 
     * specified parameters. 
     * 
     * @param {*} params 
     * @returns 
     */
    static generate(params) {
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
    static getArray(key) {
        let arr = null
        let url = new URL(window.location);

        if (url.searchParams.has(key)) {
            const queryVariable = url.searchParams.get(key)
            if (queryVariable === "null" || queryVariable === '') return []
            arr = URLParams.fromStringArray(queryVariable)
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

    /**
     * Removes all parameters from the URL.
     * 
     * Note: May be used to prevent the user to get the same
     * result when refreshing the page.
     */
    static clear() {
        let location = new URL(window.location)

        for (const key of location.searchParams.keys()) {
            location.searchParams.delete(key)
        }

        window.history.replaceState(null, "", location.href)
    }

    static fromStringArray(str) {
        return str.split(",")
    }

    static toStringArray(arr) {
        return arr.join(",")
    }
}