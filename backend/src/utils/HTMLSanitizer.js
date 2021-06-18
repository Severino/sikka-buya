const { JSDOM } = require("jsdom")

/**
 * The HTMLSanitizer is a helper class, that get's an HTML string as input
 * and only allows certain styles on the HTML elements inside.
 * 
 */
class HTMLSanitizer {

    static sanitize(html, ...allowed){
        html = this.removeScripts(html)
        return this.allowStyles(html, ...allowed)
    }

    static removeScripts(html){
        let { window } = new JSDOM(html)
        let parsedDocument = window.document
        let scripts = parsedDocument.querySelectorAll("script")
        scripts.forEach(script => script.parentNode.removeChild(script))
        return parsedDocument.body.innerHTML
    }

    /**
     * The allow function will just allow a set of CSS styles on all elements provided
     * by the HTML string. All other styles will be removed from the elements.
     * 
     * @param {string} html 
     * @param  {...string} allowed 
     */
    static allowStyles(html, ...allowed) {
        let { window } = new JSDOM(html)
        let parsedDocument = window.document
        let elements = parsedDocument.querySelectorAll("*")

        if (elements.length > HTMLSanitizer.limit) {
            console.error("Provided HTML is too complex. HTMLSanitizer function was not applied!")
        } else {
            elements.forEach(el => {

                let cache = {}
                allowed.forEach(a => {
                    if (el.style[a]) {
                        cache[a] = el.style[a]
                    }
                })
                el.removeAttribute("style")
                Object.assign(el.style, cache)
            })
        }
        return parsedDocument.body.innerHTML
    }
}

HTMLSanitizer.limit = 1000

module.exports = HTMLSanitizer