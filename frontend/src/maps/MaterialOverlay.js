import { concentricCircles } from "../maps/graphics/ConcentricCircles"
import Mint from "../models/map/mint"
import L from "leaflet"

export default class MaterialOverlay {


    static createMarker(latlng, feature, materialStats) {

        const materialArrays = Object.values(materialStats.get()).map(({ material }) => {
            let data = {
                material,
                fillOpacity: 1,
                fillColor: material.color
            }


            return data

        }).sort((a, b) => {
            if (!a.name) return 1
            else a.name.localeCompare(b.name)
        })

        return concentricCircles(latlng, materialArrays, {
            innerRadius: 5,
            radius: 15,
            styles: [
                {
                    stroke: true,
                    color: "#ff0000",
                    weight: 1.5,
                },
            ]
        });
    }
    static update(mints, mintData) {


        let materialFeatures = Object.values(mints)
            .filter((mint) => {
                return mintData[mint.id];
            })
            .map((mint) => {
                const data = {
                    mint,
                    materials: Object.values(mintData[mint.id]),
                };
                return {
                    coordinates: mint.location.coordinates,
                    type: mint.location.type,
                    data,
                    mint,
                };
            });

        const layer = this.L.geoJSON(materialFeatures, {
            pointToLayer: function (feature, latlng) {
                let data = feature.data.materials.map((materials) => {
                    return {
                        data: [materials],
                    };
                });

                let sorted = data.sort((a, b) => {
                    return a.data[0].name.localeCompare(b.data[0].name);
                });

                const featureGroup = concentricCircles(latlng, sorted, {
                    innerRadius: 5,
                    radius: 15,
                    styles: [
                        {
                            stroke: true,
                            color: "#ff0000",
                            weight: 1.5,
                        },
                    ],
                    openPopup: (data) => {
                        return `
                  ${Mint.popupMintHeader(feature.mint)}
                  <div class="popup-body">
                  ${data.data.name}
                  </div>`;
                    },
                });


                return featureGroup;
            },
            coordsToLatLng: function (coords) {
                return new L.LatLng(coords[0], coords[1], coords[2]);
            },
        });

        return layer
    }
}