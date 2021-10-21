
var L = require('leaflet');
export default {
    data: function () {
        return {
            mapInit: false
        }
    },
    props: {
        map: Object
    },
    computed: {
        L: function () {
            return L;
        }
    },
    methods: {
        update: function () {
            throw new Error("Map mixin requires an update method!")
        },
        mapChanged: function () {
            throw new Error("Map mixin requires a mapChanged method!")
        }
    }
}