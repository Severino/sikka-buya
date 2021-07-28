<template>
  <map-view class="mapview" ref="map" />
</template>

<script>
var L = require("leaflet");
import Query from "../../database/query";
import MapView from "../MapView.vue";
export default {
  components: { MapView },
  computed: {
    map: function() {
      return this.$refs.map.map;
    },
  },
  mounted: function() {
    Query.raw(
      `{mint{
        name,
        location {
          type,
          coordinates
        }
}}`
    )
      .then((result) => {
        let locatedMints = result.data.data.mint
          .filter(
            (mint) =>
              mint.location &&
              Array.isArray(mint.location.coordinates) &&
              mint.location.coordinates.length > 0
          )
          .map((el) => {
            return {
              type: el.location.type,
              coordinates: el.location.coordinates,
              original: el,
            };
          });

        console.log(locatedMints);

        L.geoJSON(locatedMints, {
          pointToLayer: function(feature, latlng) {
            let marker = L.circleMarker(latlng, {
              radius: 10,
              stroke: 0,
              fillOpacity: 1,
              fillColor: "#67c067",
            });
            marker.bindTooltip(feature.original.name, {
              direction: "top",
              offset: L.point(0, -15)
            });
            return marker;
          },
          coordsToLatLng: function(coords) {
            return new L.LatLng(coords[0], coords[1], coords[2]);
          },
        }).addTo(this.map);
      })
      .catch(console.error);
  },
};
</script>

<style lang="scss">
.mapview {
  min-height: 100px;
  flex: 1;
}
</style>
