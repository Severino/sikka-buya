
var L = require('leaflet');


export default {
    data: function () {
        return {
            featureGroup: L.layerGroup()
        }
    },
    props: {
        map: Object
    },
    watch: {
        map: function () {
            this.mapChanged()
        }
    },
    computed: {
        L: function () {
            return L;
        }
    },
    mounted: function () {
        if (this.map) {
            this.map.doubleClickZoom.disable();
            this.featureGroup.addTo(this.map)
        }
    },
    unmounted: function () {
        this.featureGroup.clearLayers()

    },
    beforeRouteEnter: function (_, _2, next) {
        next()
    },
    beforeRouteLeave(to, from, next) {
        this.featureGroup.name = "OLD"
        this.featureGroup.clearLayers()
        next()
    },
    methods: {
        update: function () {
            throw new Error("Map mixin requires an update method!")
        },
        mapChanged: function () {
            if (this.map) {
                this.map.doubleClickZoom.disable();
                this.featureGroup.addTo(this.map)
            }
        },
        clearLayers: function () {
            this.featureGroup.clearLayers()
        }
    }
}