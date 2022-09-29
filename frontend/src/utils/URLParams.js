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
}