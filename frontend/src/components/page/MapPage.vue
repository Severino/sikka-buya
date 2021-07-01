<template>
  <map-view class="mapview" ref="map" />
</template>

<script>
var L = require("leaflet");
import Query from "../../database/query";
import MapView from "../MapView.vue";
export default {
  components: { MapView },
  mounted: function () {
    Query.raw(
      `{getGeo{
  type
  coordinates
}}`
    )
      .then((result) => {
        console.log("ACCESS MAP");
        let geoJSON = result.data.data.getGeo

        L.geoJSON(geoJSON,
          {
            pointToLayer: function (feature, latlng) {
              console.log("POINT WAS FOUND");
              return L.circleMarker(latlng, { radius: 100 });
            },
            coordsToLatLng: function(coords){
              return new L.LatLng(coords[0], coords[1], coords[2]);
            }
          }
        ).addTo(this.$refs.map.map);
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