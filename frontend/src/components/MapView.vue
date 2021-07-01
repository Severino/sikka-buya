<template>
  <div :id="'map_' + _uid" ref="map"></div>
</template>

<script>
var L = require("leaflet");
import("/node_modules/leaflet/dist/leaflet.css");

export default {
  name: "MapView",
  props: {
    height: String,
  },
  data: function () {
    return {
      map: null,
    };
  },
  mounted: function () {
    const minBoundingPoint = L.latLng(10, 10);
    const maxBoundingPoint = L.latLng(50, 90);
    const mapBoundaries = L.latLngBounds(minBoundingPoint, maxBoundingPoint);

    // Initialize the map
    var map = L.map("map_" + this._uid, {
      maxBounds: mapBoundaries,
    });

    // Set the position and zoom level of the map
    map.setView([33.284619968887675, 49.921875], 5);

    if (this.height) {
      this.$refs.map.style.height = this.height;
      map.invalidateSize();
    }

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    this.map = map;
    console.log("MAP IS SET")
  },
};
</script>

<style lang="scss">
.leaflet-top {
  z-index: 900;
}
</style>
