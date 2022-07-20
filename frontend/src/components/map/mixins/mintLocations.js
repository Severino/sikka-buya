

import MintLocation from '../../../models/mintlocation';
import Query from '../../../database/query';
import Mint from '../../../models/map/mint';

export default function ({
    showMarkers = true,
    onMintSelectionChanged = null,
    mintMarkerOptions = {
        radius: 5,
        stroke: false,
        fillColor: 'white',
        fillOpacity: 1,
    }
} = {}) {
    return {
        data() {
            return {
                mints: {},
                mintLocation: null,
                mintLocationLayer: null,
                selectedMints: [],
                availableMints: [],
                unavailableMints: [],
            }
        },
        unmounted: function () {
            if (this.mintLocationLayer) this.mintLocationLayer.clearLayers();
        },
        mounted() {
            this.mintLocation = new MintLocation({ markerOptions: mintMarkerOptions, popup: this.mintLocationPopup });
        },
        methods: {
            mintLocationPopup(feature) {
                return Mint.popupMintHeader(feature.mint)
            },
            async fetchMints() {
                const result = await this.queryMints()
                this.applyQuery(result.data.data.mint)
            },
            async queryMints() {
                return Query.raw(`{${this.mintGraphQL}}`);
            },
            applyQuery(mintArray) {
                let mints = mintArray.filter((mint) => mint.location != null);
                this.mints = {};
                mints
                    .filter((mint) => mint.location != null)
                    .forEach((mint) => {
                        mint.location = JSON.parse(mint.location);
                        this.mints[mint.id] = mint;
                    });
                this.updateMintLocations()

            },
            updateMintLocations() {
                if (showMarkers)
                    this.updateMintLocationMarker();
                this.updateAvailableMints();
            },
            updateAvailableMints() {
                let avalMints = {};
                let mints = this.mints;

                this.availableMints = Object.values(this.mints);

                if (this.types) {
                    for (let type of this.types) {
                        if (avalMints[type.mint.id] == null)
                            if (type.mint) {
                                const mintId = type.mint.id;

                                if (this.selectedRulers.length == 0) {
                                    avalMints[mintId] = type.mint;
                                } else {
                                    if (this.mintHasActiveRuler(type)) {
                                        avalMints[mintId] = type.mint;
                                    }
                                }
                            }
                    }

                    let unavailMints = [];
                    for (let mint of Object.values(mints)) {
                        if (!avalMints[mint.id]) {
                            unavailMints.push(mint);
                        }
                    }

                    this.availableMints = Object.values(avalMints);
                    this.unavailableMints = unavailMints;
                }
            },
            updateMintLocationMarker() {
                if (this.mintLocationLayer)
                    this.mintLocationLayer.clearLayers();

                let features = this.mintLocation.mapToGeoJsonFeature(this.mints);
                this.mintLocationLayer = this.mintLocation.createGeometryLayer(features);
                this.mintLocationLayer.addTo(this.featureGroup);
            },
            mintSelectionChanged(selected, { preventUpdate = false } = {}) {
                this.selectedMints = selected;
                if (onMintSelectionChanged)
                    onMintSelectionChanged()
                if (!preventUpdate) this.update();
            },
            clearMintSelection({ preventUpdate = false } = {}) {
                this.mintSelectionChanged([], { preventUpdate });
            },
        },
        computed: {
            mintGraphQL() {
                return `mint {
                id
                name
                location 
                uncertain
                province {
                  id
                  name
                }
              }`
            },

        }
    }
}