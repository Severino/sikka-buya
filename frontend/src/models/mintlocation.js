var L = require('leaflet');

export default class MintLocation {
    constructor(circleOptions = {}) {
        this.circleOptions = circleOptions
        this.iconSize = this.circleOptions.radius * 3 / 2
    }


    mapToGeoJsonFeature(mints) {
        return Object.values(mints).map(mint => {

            let location = mint.location
            if (typeof mint.location == "string") {
                try {
                    location = JSON.parse(mint.location);
                } catch (e) {
                    location = { type: null, coordinates: null }
                }
            }

            return {
                type: location.type,
                coordinates: location.coordinates,
                mint: mint
            };
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

    createMarker(feature, latlng) {
        const mint = feature.mint
        let circle = L.circleMarker(latlng, this.circleOptions).bindPopup(`<header><span class="subtitle">${mint.name}</span><div class="tooltip-container"><div class="div-icon-button div-icon circle-div-icon">?</div><div class="tooltip">Verortung der Münzstätte ist nicht sicher.</div></div></header>`);

        if (!mint.uncertain) return circle
        else {
            const uncertainIcon = L.svgIcon(latlng, {
                path: "M10,19H13V22H10V19M12,2C17.35,2.22 19.68,7.62 16.5,11.67C15.67,12.67 14.33,13.33 13.67,14.17C13,15 13,16 13,17H10C10,15.33 10,13.92 10.67,12.92C11.33,11.92 12.67,11.33 13.5,10.67C15.92,8.43 15.32,5.26 12,5A3,3 0 0,0 9,8H6A6,6 0 0,1 12,2Z",
                width: 10,
                height: 10,
                scale: 0.4,
                interactive: false
            })

            uncertainIcon.setStyle({
                stroke: false,
                color: "#666666",
                fillOpacity: 1
            })

            uncertainIcon.bringToFront()

            return L.featureGroup([circle, uncertainIcon])
        }
    }

}