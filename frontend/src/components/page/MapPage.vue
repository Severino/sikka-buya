<template>
  <div class="map-page">
    <!-- <div id="map-select">
      <router-link :to="{ name: 'PoliticalMap' }" class="button"
        >Politics</router-link
      >
      <router-link :to="{ name: 'DominionMap' }" class="button"
        >Dominion</router-link
      >
    </div> -->
    <map-view class="mapview" ref="map" @mapReady="mapChanged"> </map-view>

    <router-view :map="map" />
  </div>
</template>

<script>
require('leaflet-semicircle');
require('../../plugins/leaflet-svg-icon');

import MapView from '../map/MapView.vue';

export default {
  name: 'MapPage',
  components: { MapView },
  data: function () {
    return {
      map: null,
      types: [],
    };
  },
  methods: {
    mapChanged: function (map) {
      this.map = map;
    },
  },
};
</script>

<style lang="scss">
.leaflet-popup {
  font-family: $font;

  .body {
    position: relative;
  }

  header {
    background-color: gray;
    margin-left: -20px;
    margin-top: -20px;
    margin-right: -20px;
    margin-bottom: 10px;
    padding: 10px 20px;
    min-width: 200px;

    &:last-of-type {
      margin-bottom: 0;
    }

    .subtitle {
      color: $white;
    }
  }

  .leaflet-popup-content-wrapper {
    border-radius: 3px;
  }

  a.leaflet-popup-close-button {
    color: white;
    opacity: 1;
    font-size: 1.5em !important;
    margin: 2px 10px;
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
    right: 0px;
    top: 0px;
    color: $primary-color;
    padding: 3px 5px;
    font-weight: bold;
    border: 1px solid $primary-color;
    border-radius: 5px;
  }
}

.map-page {
  position: relative;
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
  }

  li {
    margin-bottom: 10px;
    border-radius: 10px;
    cursor: pointer;
    box-sizing: border-box;
    border: 1px solid transparent;
    user-select: none;

    &.inactive {
      opacity: 0.5;
    }

    &:hover {
      border: 1px solid $gray;
    }
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
