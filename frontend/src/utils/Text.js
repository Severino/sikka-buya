/**
 * Contains utility functions for text.
 * E.g. Formatting text according to singular plural.
 */

export default class Text {


    /**
     * Returns a specified singular or plural according of the length of an array.
     * If array is empty, it returns the plural.
     * 
     * @param {string} singular - Word in singular
     * @param {string} plural - Word in plural
     * @param {array} array - Array of elements
     * @returns {string} - Returns the word in singular or plural according to the array length. If array is empty, the plural is returned.
     */
    static pluralizer(singular, plural, array) {
        return array?.length == 1 ? singular : plural;
    }
}