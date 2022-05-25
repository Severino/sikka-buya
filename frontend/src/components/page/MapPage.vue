<template>
  <div class="map-page">
    <map-nav />
    <div class="map-view-container">
      <map-view
        class="mapview"
        :location="location"
        :zoom="zoom"
        ref="map"
        @mapReady="mapChanged"
      >
      </map-view>

      <router-view :map="map" />
    </div>
  </div>
</template>

<script>
import MapNav from '../map/MapNav.vue';
require('leaflet-semicircle');
require('../../plugins/leaflet-svg-icon');

import MapView from '../map/MapView.vue';

export default {
  name: 'MapPage',
  components: { MapView, MapNav },
  data: function () {
    return {
      map: null,
      types: [],
      location: [29.70507136092254, 51.17151184658878],
      zoom: 6,
    };
  },
  mounted() {
    let location = localStorage.getItem('map-location');
    if (location) {
      this.location = JSON.parse(location);
    }

    let zoom = localStorage.getItem('map-zoom');

    if (zoom) {
      this.zoom = parseInt(zoom);
    }

    this.$nextTick(() => {
      this.map.on('moveend', function (args) {
        const { target: map } = args;

        const { lat, lng } = map.getCenter();
        localStorage.setItem('map-location', JSON.stringify([lat, lng]));
        localStorage.setItem('map-zoom', map.getZoom());
      });
    });
  },
  methods: {
    mapChanged: function (map) {
      this.map = map;
    },
  },
};
</script>

<style lang="scss">
.map-view-container {
  position: relative;
  flex: 1;
}

.leaflet-popup {
  font-family: $font;
  min-width: 250px;

  .body {
    position: relative;
  }

  header {
    background-color: gray;
    display: flex;
    justify-content: space-between;
    align-items: center;

    // margin-left: calc(#{$padding * -2} - 2px);
    // margin-top: calc(#{$padding * -2} - 2px);
    // margin-right: calc(#{$padding * -2} - 2px);
    margin-bottom: 10px;
    padding: $padding $padding * 2;
    padding-right: 50px;

    border-top-right-radius: $border-radius;
    border-top-left-radius: $border-radius;
    // min-width: 200px;

    &:last-of-type {
      margin-bottom: 0;
    }

    .subtitle {
      color: $white;
    }
  }

  .leaflet-popup-content-wrapper {
    padding: 0;
    border-radius: $border-radius;
  }

  .leaflet-popup-content {
    margin: 0;
  }
  a.leaflet-popup-close-button {
    color: white;
    opacity: 1;
    font-size: 1.5em !important;
    padding: 9px !important;
  }

  h2,
  h3,
  h4 {
    margin: 0.5em 0;
  }

  h2:first-child {
    margin-bottom: 0;
  }

  ul,
  ol {
    margin: 0.5em 0;
    padding-left: 1em;
  }

  .active {
    padding: 2px 5px;
    font-weight: bold;
    text-decoration: underline;
  }

  .catalog-link {
    position: absolute;
    right: $padding * 2;
    top: 46px;
    color: $primary-color;
    padding: 3px 5px;
    font-weight: bold;
    border: 1px solid $primary-color;
    border-radius: 5px;
  }
}

.map-page {
  position: relative;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  flex: 1;
}

.mapview {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.map-label {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
  font-weight: bold;
  font-size: 22px;
  margin-bottom: 10px;

  &::before {
    border-top-color: transparent !important;
  }
}

.side-bar {
  z-index: 100;

  h3 {
    margin-top: 0;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
    overflow: hidden;
  }

  li {
    margin: $padding;
    border-radius: 10px;
    cursor: pointer;
    box-sizing: border-box;
    // border: 1px solid transparent;
    user-select: none;

    &.inactive {
      opacity: 0.5;
    }

    // &:hover {
    //   border: 1px solid $gray;
    // }
  }
}

#mints {
  li {
    margin-bottom: 0;
  }
}

.selected {
  color: $primary-color;
}

.side-bar-right {
  right: 0;
}

.notification {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  color: $white;
  background-color: $primary-color;
  margin-top: 10px;
  padding: 5px 10px;
  border-radius: $border-radius;
  display: flex;
  align-items: center;

  button {
    margin-left: 10px;
    padding: 3px 10px;
    border-radius: $border-radius;
    background-color: $primary-color;
    color: $white;
    border-color: $white;
  }
}

#map-select {
  left: 50%;
  z-index: 1;
  position: absolute;
  top: 55px;
  display: flex;
  transform: translateX(-50%);
}
</style>
