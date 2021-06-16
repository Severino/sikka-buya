const { JSDOM } = require("jsdom")

/**
 * The styler is a helper class, that get's an HTML string as input
 * and only allows certain styles on the HTML elements inside.
 * 
 */
class Styler {

    /**
     * The allow function will just allow a set of CSS styles on all elements provided
     * by the HTML string. All other styles will be removed from the elements.
     * 
     * @param {string} html 
     * @param  {...string} allowed 
     */
    static allow(html, ...allowed) {
        let { window } = new JSDOM(html)
        let parsedDocument = window.document
        let elements = parsedDocument.querySelectorAll("*")

        if (elements.length > Styler.limit) {
            console.error("Provided HTML is too complex. Styler function was not applied!")
        } else {
            elements.forEach(el => {
                let cache = {}
                const oldStyle = el.getAttribute("style")
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

Styler.limit = 1000

module.exports = Styler