<template>
  <div class="map-page">
    <router-view :map="map" />
    <map-view class="mapview" ref="map" @mapReady="mapChanged"> </map-view>
  </div>
</template>

<script>
var L = require('leaflet');

require('leaflet-semicircle');
var turf = require('@turf/turf');
import Vue from 'vue';

import Query from '../../database/query';
import MapView from '../map/MapView.vue';

export default {
  name: 'MapPage',
  components: { MapView },
  data: function() {
    return {
      map: null,
      types: []
    };
  },
  methods: {
    mapChanged: function(map) {
      this.map = map;
    },

    updateDominion: function() {
      Query.raw(
        `
      {
  ruledMint(year: ${this.timeline.value}) {
    mint {
      name
      location
    }
    overlords {
      name
      rank
      honorifics {
        name
      }
    }
  }


      getDominion(year: ${this.timeline.value}) {
    overlord {
      name
      shortName
    }
    mints {
      name
      location
    }
  }}`
      )
        .then(result => {
          if (this.mintGeoJSONLayer) this.mintGeoJSONLayer.remove();
          this.mintGeoJSONLayer = L.geoJSON([], {
            coordsToLatLng: function(coords) {
              return new L.LatLng(coords[0], coords[1], coords[2]);
            },
            style: {
              stroke: true,
              opacity: 0.75,
              color: 'red',
              fillColor: '#48ac48',
              fillOpacity: 0.1
            }
          }).addTo(this.map);

          result.data.data.ruledMint.forEach(mint => {
            if (mint.location) {
              try {
                mint.location = JSON.parse(mint.location);
                this.mintGeoJSONLayer.addData(mint.location);
              } catch (e) {
                console.error('Could not parse GeoJSON from mint.', mint);
              }
            }
          });

          let dominionData = result.data.data.getDominion;
          dominionData.filter(
            data =>
              data?.mints?.location?.coordinates &&
              Array.isArray(data.mints.location.coordinates) &&
              data.mints.location.coordinates.length > 0
          );
          dominionData.forEach((dominion, idx) => {
            const mintsCount = dominion.mints.length;
            let points = [];
            dominion.mints.forEach(mint => {
              let distance = 0.2 / (idx + 1);
              let resolution = 10;
              let vertices = resolution * 4;
              for (
                let angle = 0;
                angle < 2 * Math.PI;
                angle += (2 * Math.PI) / vertices
              ) {
                let lat =
                  Math.cos(angle) * distance + mint.location.coordinates[0];
                let lng =
                  Math.sin(angle) * distance + mint.location.coordinates[1];
                points.push(turf.point([lat, lng]));
              }
            });

            let area = turf.convex(turf.featureCollection(points));
            area.dominion = dominion;
            dominionData[idx] = area;
          });
          if (this.dominionLayer) this.dominionLayer.remove();

          this.dominionLayer = L.geoJSON(dominionData, {
            coordsToLatLng: function(coords) {
              return new L.LatLng(coords[0], coords[1], coords[2]);
            },
            style: {
              stroke: true,
              opacity: 0.75,
              color: '#48ac48',
              fillColor: '#48ac48',
              fillOpacity: 0.5
            }
          }).addTo(this.map);
          this.dominionLayer.bindTooltip(
            layer => {
              return layer.feature.dominion.overlord.shortName;
            },
            {
              sticky: true,
              direction: 'top'
            }
          );
        })
        .catch(console.error);
    }
  }
};
</script>

<style lang="scss">
.leaflet-popup {
  font-family: $font;

  header {
    background-color: gray;
    margin-left: -20px;
    margin-top: -20px;
    margin-right: -20px;
    margin-bottom: 10px;
    padding: 10px 20px;

    .subtitle {
      color: $white;
    }
  }

  .leaflet-popup-content-wrapper {
    border-radius: 3px;
  }

  .leaflet-popup-content {
    margin: 20px;
  }

  a.leaflet-popup-close-button {
    color: white;
    opacity: 1;
    font-size: 1.5em !important;
    margin: 10px;
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
    color: $primary-color;
    // text-decoration: underline;
  }

  .catalog-link {
    position: absolute;
    right: 20px;
    top: 52px;
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
    padding: 5px 10px;
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
</style>
