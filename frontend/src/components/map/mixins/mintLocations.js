export default {
    updateMintLocationMarker() {
        const _ = new MintLocation(this);
        _.removeExistingLocation();
        let features = _.mapToGeoJsonFeature(this.mints);
        this.mintLocations = _.createGeometryLayer(features);
        this.mintLocations.addTo(this.map);
    },
}