<template>
  <div class="map-page">
    <timeline
      ref="timeline"
      :map="this.map"
      :from="timeline.from"
      :to="timeline.to"
      :value="timeline.value"
      @input="timeChanged"
      @change="timeChanged"
    />

    <div class="side-bar side-bar-right">
      <div id="rulers">
        <ul>
          <h3>Herrscher</h3>
          <li
            v-for="ruler of rulers"
            :key="`ruler-list-item-${ruler.id}`"
            :style="
              `background-color: ${
                activeRuler
                  ? ruler.id == activeRuler.id
                    ? rulerColorMap[ruler.id]
                    : 'unset'
                  : rulerColorMap[ruler.id] || 'transparent'
              };`
            "
            @click="setActiveRuler(ruler)"
          >
            {{ ruler.shortName }}
          </li>
        </ul>
      </div>
    </div>

    <div class="side-bar side-bar-left">
      <div id="mints">
        <h3>Prägeorte</h3>
        <ul>
          <li
            v-for="mint of availableMints"
            :key="`mint-avail-list-item-${mint.id}`"
            @click="setActiveMint(mint)"
          >
            {{ mint.name }}
          </li>
        </ul>

        <ul>
          <li
            v-for="mint of unavailableMints"
            :key="`mint-unavail-list-item-${mint.id}`"
            @click="setActiveMint(mint)"
            class="inactive"
          >
            {{ mint.name }}
          </li>
        </ul>

        <!-- <h3>Prägeorte</h3>
        <ul>
          <li
            v-for="mint of mints"
            :key="`mint-list-item-${mint.id}`"
            @click="setActiveMint(mint)"
            :class="{ inactive: isMintInactive(mint) }"
          >
            {{ mint.name }}
          </li>
        </ul> -->
      </div>
    </div>

    <map-view class="mapview" ref="map" @mapReady="mapChanged"> </map-view>
  </div>
</template>

<script>
var L = require('leaflet');
var turf = require('@turf/turf');
console.log(turf);
import Query from '../../database/query';
import Timeline from '../map/control/Timeline.vue';
import MapView from '../map/MapView.vue';

export default {
  name: 'MapPage',
  components: { MapView, Timeline },
  data: function() {
    return {
      timeline: { from: null, to: null, value: null },
      mints: [],
      rulers: [],
      map: null,
      rulerColorMap: {},
      activeRuler: null,
      activeMint: null,
      availableMints: null,
      unavailableMints: null,
      types: []
    };
  },
  provide() {
    return {
      map: this.map || null
    };
  },
  methods: {
    updateAvailableMints() {
      let avalMints = {};
      let unavailMints = {};

      console.log(this.types);

      if (this.types) {
        for (let type of this.types) {
          if (type.mint) {
            if (!this.activeRuler) {
              avalMints[type.mint.id] = type.mint;
            } else {
              if (avalMints[type.mint.id] != null) continue;
              if (this.mintHasRuler(type, this.activeRuler)) {
                avalMints[type.mint.id] = type.mint;
                if (unavailMints[type.mint.id]) {
                  delete unavailMints[type.mint.id];
                }
              } else {
                unavailMints[type.mint.id] = type.mint;
              }
            }
          }
        }

        this.availableMints = Object.values(avalMints);
        this.unavailableMints = Object.values(unavailMints);
      }
    },
    mintHasRuler(type, ruler) {
      function hasRuler(property, type, ruler) {
        if (!type.mint) return false;

        for (let i = 0; i < type[property]?.length; i++) {
          if (type[property][i].id == ruler.id) return true;
        }
        return false;
      }

      return (
        hasRuler('issuers', type, ruler) || hasRuler('overlords', type, ruler)
      );
    },
    isMintActive: function(mint) {
      return this.activeMint?.id == mint.id;
    },
    isMintInactive: function(mint) {
      if (!this.activeMint) return false;
      else return !this.activeMint || this.activeMint.id !== mint.id;
    },
    mapChanged: function(map) {
      this.map = map;
      Query.raw(
        `{
        timespan {
          from
          to
        }
}`
      )
        .then(result => {
          let timeline = result.data.data.timespan;
          timeline.value = 363;
          this.timeline = timeline;
          this.$refs.timeline.init();
          this.update();

          window.map = this.map;
          this.map.doubleClickZoom.disable();
        })
        .catch(console.error);
    },
    setActiveMint(mint) {
      if (this.activeMint && this.activeMint.id == mint.id) {
        this.activeMint = null;
      } else this.activeMint = mint;
      this.update();
    },
    setActiveRuler(ruler) {
      console.log('UPDATE');
      if (this.activeRuler && this.activeRuler.id == ruler.id) {
        this.activeRuler = null;
      } else this.activeRuler = ruler;
      this.update();
    },
    getColor(i) {
      const colors = [
        '#7CCC7B',
        '#FFB581',
        '#89B0AE',
        '#A1DAA0',
        '#FEDFCA',
        '#f1e8b8',
        '#BEE3DB'
      ];
      if (i > colors.length) console.error('RAN OUT OF COLORS', i);
      return colors[i % colors.length];
    },
    async update() {
      // this.updateDominion();
      // this.updateMint();
      this.updateConcentricCircles();
      this.updateAvailableMints();
    },
    timeChanged: async function(val) {
      this.timeline.value = val;
      this.types = await this.fetchTypes();
      console.log(this.types);
      this.update();
    },
    fetchTypes: async function() {
      return new Promise((resolve, reject) => {
        Query.raw(
          `{
  getTypes(yearOfMint:${this.timeline.value}){
    projectId
    mint {
      id
      name
      location
    },
    issuers {
      id
      name
      shortName
    }
    overlords {
      id
      name
      shortName
      rank
    }
  }
}`
        )
          .then(result => {
            let data = result.data.data.getTypes;
            console.log('a', result.data.data.getTypes);

            data.forEach(type => {
              if (type?.mint.location) {
                try {
                  type.mint.location = JSON.parse(type.mint.location);
                } catch (e) {
                  console.error('Could not parse GeoJSON.', type.mint.location);
                }
              }
            });

            data = data.filter(
              d => (d.mint?.location && d.mint.location.coordinates) != null
            );

            resolve(data);
          })
          .catch(reject);
      });
    },
    updateConcentricCircles: function() {
      let rulers = {};
      let mints = {};

      this.types.forEach(type => {
        if (type.mint?.id) mints[type.mint.id] = type.mint;

        type.issuers.forEach(issuer => (rulers[issuer.id] = issuer));
        type.overlords.forEach(overlord => (rulers[overlord.id] = overlord));
      });

      let data = this.types;

      if (this.activeMint) data = data.filter(d => this.isMintActive(d.mint));

      this.rulerColorMap = {};
      let i = 0;

      this.rulers = rulers;
      Object.values(rulers).forEach(ruler => {
        this.rulerColorMap[ruler.id] = this.getColor(i);
        i++;
      });

      if (this.concentricCircles) this.concentricCircles.remove();

      const types = data.map(obj => {
        let mint = obj.mint;
        let geo = mint.location;
        geo.coin = obj;
        return geo;
      });

      let that = this;

      this.concentricCircles = L.geoJSON(
        types,

        {
          pointToLayer: function(feature, latlng) {
            let circles = [];
            let radius = 10;
            const increment = 5;
            for (let overlord of feature.coin.overlords) {
              let rulers = [...feature.coin.issuers, ...feature.coin.overlords];

              for (let [index, ruler] of rulers.entries()) {
                let fillColor = that.activeRuler
                  ? ruler.id !== that.activeRuler.id
                    ? '#ccc'
                    : that.rulerColorMap[ruler.id]
                  : that.rulerColorMap[ruler.id];

                let circle = L.circleMarker(latlng, {
                  radius,
                  weight: 0.75,
                  stroke: true,
                  color: '#fff',
                  fillColor,
                  fillOpacity: 1
                }).bindTooltip(ruler.name, {
                  className: 'map-label',
                  // permanent: true,
                  direction: 'top'
                });

                circle.on('click', () => {
                  that.setActiveRuler(ruler);
                });

                circles.push(circle);
                radius += increment;
              }
              circles.reverse();
              return L.layerGroup(circles);
            }
          },

          coordsToLatLng: function(coords) {
            return new L.LatLng(coords[0], coords[1], coords[2]);
          },
          style: {
            stroke: false,
            fillColor: '#629bf0',
            fillOpacity: 1
          },
          tooltip: function(feature) {
            return feature.mint.name;
          }
        }
      );

      this.concentricCircles.addTo(this.map);
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
  position: absolute;
  box-sizing: border-box;
  z-index: 1000;
  background-color: rgba($color: $white, $alpha: 0.8);
  padding: 20px;
  top: 0px;
  height: 100%;
  overflow-y: auto;

  min-width: 200px;
  width: 20vw;
  max-width: 400px;

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

    &.inactive {
      opacity: 0.3;
    }

    &:hover {
      border: 1px solid $gray;
    }
  }
}

.side-bar-right {
  right: 0;
}
</style>
