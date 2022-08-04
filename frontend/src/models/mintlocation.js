import Mint from './map/mint';

var L = require('leaflet');

export default class MintLocation {
    constructor({
        markerOptions = {},
        createMarker = null,
        bindPopup = null
    }) {
        this.markerOptions = markerOptions
        this.iconSize = this.markerOptions.radius * 3 / 2
        this.bindPopupCallback = bindPopup
        this.createMarkerCallback = createMarker
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
                return that.createMarker.call(that, latlng, feature)
            },
            coordsToLatLng: function (coords) {
                return new L.LatLng(coords[0], coords[1], coords[2]);
            }
        });

        return layer
    }

    createMarker(latlng, feature) {
        let marker = null

        if (this.createMarkerCallback)
            marker = this.createMarkerCallback(latlng, feature)
        else {
            let locationMarker = new MintLocationMarker(feature.mint)
            marker = locationMarker.create(latlng)
        }
        if (this.bindPopupCallback)
            marker.bindPopup(this.bindPopupCallback(feature))
        else
            marker.bindPopup(Mint.popupMintHeader(feature.mint));

        return marker
    }
}


export class MintLocationMarker {

    constructor(mint) {
        this.mint = mint
    }

    create(latlng) {
        let marker = L.circleMarker(latlng, {
            radius: 6,
            stroke: true,
            weight: 1,
            color: "#333",
            fillColor: 'white',
            fillOpacity: 1,
        })

        if (this.mint.uncertain) {
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
            marker = L.featureGroup([marker, uncertainIcon])
        }
        return marker
    }
}

export class CountMarker {
    constructor(size = 20) {
        this.size = size
    }

    create(latlng, num) {
        // const size = this.markerOptions.radius * 2
        const icon = L.divIcon({
            className: "mint-location-div-marker",
            html: `${num}`,
            iconSize: [this.size, this.size],
            iconAnchor: [this.size / 2, this.size / 2]
        })

        return L.marker(latlng, { icon })
    }
}