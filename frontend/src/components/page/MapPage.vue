<template>
  <map-view class="mapview" ref="map">
    <timeline
      v-if="timeline"
      :from="timeline.from"
      :to="timeline.to"
      v-model="timeline.value"
      @change="changed"
    />
  </map-view>
</template>

<script>
var L = require('leaflet');
var turf = require('@turf/turf');
console.log(turf);
import Query from '../../database/query';
import Timeline from '../map/control/Timeline.vue';
import MapView from '../map/MapView.vue';

export default {
  components: { MapView, Timeline },
  computed: {
    map: function() {
      return this.$refs.map.map;
    },
  },
  data: function() {
    return {
      timeline: null,
      mints: [],
    };
  },
  mounted: function() {
    Query.raw(
      `{
        timespan {
          from
          to
        }
    mint {
    name
    location {
      type
      coordinates
    }
  }
}`
    )
      .then((result) => {
        let timeline = result.data.data.timespan;
        timeline.value = 363;
        this.timeline = timeline;
        this.mints = result.data.data.mint;
        this.update();

        window.map = this.map;
      })
      .catch(console.error);
  },
  methods: {
    getColor(i) {
      const colors = [
        '#ff6542',
        '#0b1d51',
        '#f092dd',
        '#ffaff0',
        '#9ece9a',
        '#f1e8b8',
        '#e2c044',
        '#1b4079',
        '#2ba84a',
      ];
      if (i > colors.length) console.error('RAN OUT OF COLORS', i);
      return colors[i % colors.length];
    },
    update() {
      // this.updateDominion();
      // this.updateMint();
      this.updateConcentricCircles();
    },
    changed: function(val) {
      this.timeline.value = val;
      this.update();
    },
    queryMint: function() {
      Query.raw(`{mint {name location { type coordinates} } }`)
        .then((result) => {
          this.mints = result.data.data.mint;
          this.update();
        })
        .catch(console.error);
    },
    updateConcentricCircles: function() {
      Query.raw(
        `{
  getTypes(yearOfMint:${this.timeline.value}){
    projectId
    mint {
      id
      name
      location {
        type
        coordinates
      }
    },
    overlords {
      id
      name
      shortName
      rank
    }
  }
}`
      )
        .then((result) => {
          let data = result.data.data.getTypes;

          let overlords = {};

          data = data.filter(
            (d) => d.mint?.location && d.mint.location.coordinates != null
          );

          data.forEach((type) => {
            type.overlords.forEach((o) => (overlords[o.id] = o));
          });

          let oArr = Object.values(overlords);
          for (let i = 0; i < oArr.length; i++) {
            overlords[oArr[i].id].color = this.getColor(i);
          }

          if (this.concentricCircles) this.concentricCircles.remove();
          this.concentricCircles = L.geoJSON(
            data.map((obj) => {
              let mint = obj.mint;
              let geo = mint.location;
              geo.coin = obj;
              return geo;
            }),
            {
              pointToLayer: function(feature, latlng) {
                let circles = [];
                let radius = 10;
                const increment = 5;
                for (let ov of feature.coin.overlords) {
                  const overlord = overlords[ov.id];

                  circles.push(
                    L.circleMarker(latlng, {
                      radius,
                      // color: "#ffffff",
                      weight: 0.1,
                      stroke: false,
                      fillColor: overlord.color,
                      fillOpacity: 1,
                    }).bindTooltip(overlord.name, {
                      className: 'map-label',
                      // permanent: true,
                      direction: 'top',
                    })
                  );
                  radius += increment;
                }
                circles.reverse();
                return L.layerGroup(circles);
              },
              coordsToLatLng: function(coords) {
                return new L.LatLng(coords[0], coords[1], coords[2]);
              },
              style: {
                stroke: false,
                fillColor: '#629bf0',
                fillOpacity: 1,
              },
              tooltip: function(feature) {
                return feature.mint.name;
              },
            }
          );

          this.concentricCircles.addTo(this.map);
        })
        .catch(console.error);
    },
    updateMint: function() {
      let mintData = this.mints.filter((mint) => {
        return (
          mint.location?.coordinates &&
          Array.isArray(mint.location.coordinates) &&
          mint.location.coordinates.length > 0
        );
      });
      if (this.mintLayer) this.mintLayer.remove();

      this.mintLayer = L.geoJSON(
        mintData.map((mint) => {
          let geo = mint.location;
          geo.mint = mint;
          return geo;
        }),
        {
          pointToLayer: (point, latlng) => {
            return L.circleMarker(latlng);
          },
          coordsToLatLng: function(coords) {
            return new L.LatLng(coords[0], coords[1], coords[2]);
          },
          style: {
            stroke: false,
            fillColor: '#629bf0',
            fillOpacity: 1,
          },
          tooltip: function(feature) {
            return feature.mint.name;
          },
        }
      );

      this.mintLayer.addTo(this.map);
    },
    updateDominion: function() {
      Query.raw(
        `
      {
  ruledMint(year: ${this.timeline.value}) {
    mint {
      name
      location {
        type
        coordinates
      }
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
      location {
        type
        coordinates
      }
    }
  }}`
      )
        .then((result) => {
          let rms = result.data.data.ruledMint.filter(
            (rm) =>
              rm.mint.location != null && rm.mint.location.coordinates != null
          );

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
              fillOpacity: 0.1,
            },
          }).addTo(this.map);

          rms.forEach((rm) => {
            console.log(rm.mint.location);
            this.mintGeoJSONLayer.addData(rm.mint.location);
          });

          let dominionData = result.data.data.getDominion;
          dominionData.filter(
            (data) =>
              data?.mints?.location?.coordinates &&
              Array.isArray(data.mints.location.coordinates) &&
              data.mints.location.coordinates.length > 0
          );
          dominionData.forEach((dominion, idx) => {
            const mintsCount = dominion.mints.length;
            let points = [];
            dominion.mints.forEach((mint) => {
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
              fillOpacity: 0.5,
            },
          }).addTo(this.map);
          this.dominionLayer.bindTooltip(
            (layer) => {
              return layer.feature.dominion.overlord.shortName;
            },
            {
              sticky: true,
              direction: 'top',
            }
          );
        })
        .catch(console.error);
    },
  },
};
</script>

<style lang="scss">
.mapview {
  min-height: 100px;
  flex: 1;
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
</style>
