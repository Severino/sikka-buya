var L = require('leaflet');

export default class MintLocation {
    constructor(circleOptions = {}) {
        this.circleOptions = circleOptions


        this.iconSize = this.circleOptions.radius * 3 / 2
    }


    mapToGeoJsonFeature(mints) {
        return Object.values(mints).map(mint => {
            let feature = JSON.parse(mint.location);
            feature.mint = mint;
            return feature;
        });
    }

    createGeometryLayer(features) {
        let that = this

        let layer = new L.geoJSON(features, {
            pointToLayer: function (feature, latlng) {
                return that.createMarker.call(that, feature, latlng)
            },
            coordsToLatLng: function (coords) {
                return new L.LatLng(coords[0], coords[1], coords[2]);
            }
        });

        return layer
    }

    removeUncertainLayer(layer) {
        if (layer) layer.remove()
    }

    createMarker(feature, latlng) {
        const mint = feature.mint
        let circle = L.circleMarker(latlng, this.circleOptions).bindPopup(`<header><span class="subtitle">${mint.name}</span></header>`);

        if (!mint.uncertain) return circle
        else {

            let group = L.layerGroup([circle])


            const uncertainIcon = L.icon({
                iconUrl: "/icons/help.svg",
                iconSize: [this.iconSize, this.iconSize]
            })

            console.log(uncertainIcon)

            const marker = L.marker(latlng, {
                icon: uncertainIcon,
                interactive: false
            })

            return group.addLayer(marker)
        }
    }

}