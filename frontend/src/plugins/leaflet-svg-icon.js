/* eslint-disable */

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
        window.L.YourPlugin = factory(L);
    }
}(function (L) {


    L.SVG.include({
        _drawSvg: function (layer) {
            this._setPath(layer, layer.options.path)
            this.makeCentered(layer)
        },
        makeCentered(layer) {

            let { width = 0, height = 0, scale = 1 } = layer.options

            layer._path.setAttribute("transform", `translate(${layer._point.x - width / 2},${layer._point.y - height / 2}) scale(${scale.toFixed(4)})`)
        }
    })


    L.SvgIcon = L.CircleMarker.extend({
        initialize: function (latlng, options) {
            this._overwriteAddPath = true
            L.CircleMarker.prototype.initialize.call(this, latlng, options)
        },
        _updatePath: function () {
            this._renderer._drawSvg(this, this._point);
        },
        _updateBounds: function () {
            const bb = this._path.getBBox()
            this._pxBounds = [[bb.x, bb.y], [bb.x + bb.width, bb.y + bb.height]]
        },
    })


    L.svgIcon = function (latlng, options) {
        return new L.SvgIcon(latlng, options)
    }
}, window));