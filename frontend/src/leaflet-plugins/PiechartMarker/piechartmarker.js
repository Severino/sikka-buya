/**
 * Leaflet Plugin:
 * PieChartMarker
 * 
 * author: Severin Opel
 */
(function (factory, window) {

    // define an AMD module that relies on 'leaflet'
    if (typeof define === 'function' && define.amd) {
        define(['leaflet'], factory);

        // define a Common JS module that relies on 'leaflet'
    } else if (typeof exports === 'object') {
        module.exports = factory(require('leaflet'));
    }

    // attach your plugin to the global 'L' variable
    if (typeof window !== 'undefined' && window.L) {
        window.L.PieChartMarker = factory(L);
    }
}(function (L) {
    var plugin = {};
    // implement your plugin



    // return your plugin when you are done
    return plugin;
}, window));