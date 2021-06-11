<template>
  <div id="map"></div>
</template>

<script>
var L = require("leaflet");
import("/node_modules/leaflet/dist/leaflet.css");

export default {
  name: "MapPage",
  mounted: function () {
    const minBoundingPoint = L.latLng(26.78484736105119, 30.498046875000004);
    const maxBoundingPoint = L.latLng(39.90973623453719, 64.90722656250001);
    const mapBoundaries = L.latLngBounds(minBoundingPoint, maxBoundingPoint);

    // Initialize the map
    var map = L.map("map", {
      maxBounds: mapBoundaries,
    });

    // Set the position and zoom level of the map
    map.setView([33.284619968887675, 49.921875], 5);

    map.on("click", function (e) {
      console.log(e.latlng.lat + ", " + e.latlng.lng);
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
  },
};
</script>

<style lang="scss">
.leaflet-top {
  z-index: 900;
}
</style>

<style lang="scss" scoped>
#map {
  top: 0;
  left: 0;
  flex: 1;
}
</style>