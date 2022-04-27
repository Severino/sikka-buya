

import MintLocation from '../../../models/mintlocation';
import Query from '../../../database/query';

export default {
    data() {
        return {
            mints: {},
            mintLocation: null,
            selectedMints: [],
            availableMints: [],
            unavailableMints: [],
        }
    },
    unmounted: function () {
        if (this.mintLocations) this.mintLocations.clearLayers();
    },
    mounted() {

        this.mintLocation = new MintLocation(this.mintMarkerOptions);
    },
    methods: {
        async fetchMints() {
            const result = await this.queryMints()
            this.applyQuery(result)
        },
        async queryMints() {
            return Query.raw(`{${this.mintGraphQL}}`);
        },
        applyQuery(result) {
            let mints = result.data.data.mint.filter((mint) => mint.location != null);
            this.mints = {};
            mints
                .filter((mint) => mint.location != null)
                .forEach((mint) => {
                    mint.location = JSON.parse(mint.location);
                    this.mints[mint.id] = mint;
                });
        },
        updateMints() {
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
            if (this.mintLocations)
                this.mintLocations.clearLayers();
            const _ = new MintLocation(this.mintMarkerOptions);
            let features = _.mapToGeoJsonFeature(this.mints);
            this.mintLocations = _.createGeometryLayer(features);
            this.mintLocations.addTo(this.map);
        },
        mintSelectionChanged(selected, { preventUpdate = false }) {
            this.selectedMints = selected;
            if (!preventUpdate) this.update();

            this.drawMintCountOntoTimeline();
        },
        clearMintSelection({ preventUpdate = false }) {
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
        mintMarkerOptions() {
            return {
                radius: 5,
                stroke: false,
                fillColor: 'white',
                fillOpacity: 1,
            };
        },
    }
}