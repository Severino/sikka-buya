var L = require('leaflet');

export default class MintLocation {
    constructor(context, circleOptions = {}) {
        this.context = context
        this.circleOptions = circleOptions


        this.iconSize = this.circleOptions.radius * 3 / 2

        this.uncertainIcon = L.icon({
            iconUrl: "/icons/help.svg",
            iconSize: [this.iconSize, this.iconSize]
        })
    }

    removeExistingLocation() {
        if (this.context.mintLocations) this.context.mintLocations.remove();
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
                const mint = feature.mint



                let circle = L.circleMarker(latlng, that.circleOptions).bindPopup(`<header><span class="subtitle">${mint.name}</span></header>`);

                if (!mint.uncertain) return circle
                else {

                    let group = L.layerGroup([circle])
                    // let marker = new L.Marker(latlng, {
                    //     icon: new L.DivIcon({
                    //         className: 'uncertain-marker',
                    //         html: "<div>?</div>",
                    //         iconSize: [24, 40],
                    //         iconAnchor: [0, 0],
                    //     })
                    // });
                    // return group.addLayer(marker)


                    // let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
                    // svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
                    // svg.setAttribute('viewBox', "0 0 24 24")
                    // svg.innerHTML = `<path fill="red" d="M10,19H13V22H10V19M12,2C17.35,2.22 19.68,7.62 16.5,11.67C15.67,12.67 14.33,13.33 13.67,14.17C13,15 13,16 13,17H10C10,15.33 10,13.92 10.67,12.92C11.33,11.92 12.67,11.33 13.5,10.67C15.92,8.43 15.32,5.26 12,5A3,3 0 0,0 9,8H6A6,6 0 0,1 12,2Z" />`
                    // let svgOverlay = L.svgOverlay(svg, [[latlng.lat - 0.15, latlng.lng - 0.15], [latlng.lat + 0.15, latlng.lng + 0.15]])
                    const marker = L.marker(latlng, { icon: that.uncertainIcon })
                    return group.addLayer(marker)
                }

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

    createUncertainLayer(mints) {

        let features = this.mapToGeoJsonFeature(mints).filter(feature => feature.mint.uncertain)
        let that = this
        return new L.geoJSON(features, {
            pointToLayer: function (feature, latlng) {
                const mint = feature.mint
                return L.marker(latlng, {
                    icon: that.uncertainIcon
                })
            },
            coordsToLatLng: function (coords) {
                return new L.LatLng(coords[0], coords[1], coords[2]);
            }
        });
    }

}