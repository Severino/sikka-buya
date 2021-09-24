<template>
  <div :id="'map_' + _uid" ref="map">
    <template v-if="ready">
      <slot />
    </template>
  </div>
</template>

<script>
var L = require('leaflet');
import('/node_modules/leaflet/dist/leaflet.css');

export default {
  name: 'MapView',
  props: {
    height: String
  },
  data: function() {
    return {
      map: null,
      ready: false
    };
  },
  mounted: function() {
    const minBoundingPoint = L.latLng(10, 10);
    const maxBoundingPoint = L.latLng(50, 90);
    const mapBoundaries = L.latLngBounds(minBoundingPoint, maxBoundingPoint);

    L.Map.include({
      _initControlPos: function() {
        var corners = (this._controlCorners = {}),
          l = 'leaflet-',
          container = (this._controlContainer = L.DomUtil.create(
            'div',
            l + 'control-container',
            this._container
          ));

        function createCorner(vSide, hSide) {
          var className = l + vSide + ' ' + l + hSide;

          corners[vSide + hSide] = L.DomUtil.create(
            'div',
            className,
            container
          );
        }

        createCorner('top', 'left');
        createCorner('top', 'right');

        createCorner('bottom', 'left');
        createCorner('bottom', 'right');

        createCorner('middle', 'left');
        createCorner('middle', 'right');

        createCorner('top', 'center');
        createCorner('middle', 'center');
        createCorner('bottom', 'center');
      }
    });
    // Initialize the map
    var map = L.map('map_' + this._uid, {
      maxBounds: mapBoundaries,
      zoomControl: false
    });

    // Set the position and zoom level of the map
    map.setView([33.284619968887675, 49.921875], 5);

    if (this.height) {
      this.$refs.map.style.height = this.height;
      map.invalidateSize();
    }

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    this.$data.map = map;
    this.ready = true;

    this.$nextTick(() => {
      console.log('MAP CHANGED');
      this.$emit('mapReady', map);
    });
  }
};
</script>

<style lang="scss">
.leaflet-top {
  z-index: 900;
}
</style>
