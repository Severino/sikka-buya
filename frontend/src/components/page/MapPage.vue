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
    location
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
        this.map.doubleClickZoom.disable();
      })
      .catch(console.error);
  },
  methods: {
    getColor(i) {
      const colors = [
        '#ff6542',
        'red',
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
        .then((result) => {
          let data = result.data.data.getTypes;

          let issuers = {};
          let overlords = {};

          data.forEach((type) => {
            if (type?.mint.location) {
              try {
                type.mint.location = JSON.parse(type.mint.location);
                type.issuers.forEach((issuer) => (issuers[issuer.id] = issuer));
                type.overlords.forEach(
                  (overlord) => (overlords[overlord.id] = overlord)
                );
              } catch (e) {
                console.error('Could not parse GeoJSON.', type.mint.location);
              }
            }
          });

          data = data.filter(
            (d) => d.mint?.location && d.mint.location.coordinates != null
          );

          let rulerColorMap = {};
          let i = 0;
          let oArr = Object.values(overlords);
          let iArr = Object.values(issuers);

          [...iArr, ...oArr].forEach((ruler) => {
            rulerColorMap[ruler.id] = this.getColor(i);
            console.log(
              `%c ${ruler.shortName} `,
              `background: ${ruler.color} ;`,
              ruler
            );
            i++;
          });

          if (this.concentricCircles) this.concentricCircles.remove();

          const types = data.map((obj) => {
            let mint = obj.mint;
            let geo = mint.location;
            geo.coin = obj;
            return geo;
          });

          this.concentricCircles = L.geoJSON(
            types,

            {
              pointToLayer: function(feature, latlng) {
                let circles = [];
                let radius = 30;
                const increment = 10;

                if (feature.coin.issuers.length > 1)
                  console.error(
                    'MORE THAN ONE ISSUER ON MINT THIS LEADS TO A WRONG REPRESENTATION'
                  );

                let rulers = [
                  ...feature.coin.issuers,
                  ...feature.coin.overlords,
                ];

                for (let [index, ruler] of rulers.entries()) {
                  circles.push(
                    L.circleMarker(latlng, {
                      radius,
                      weight: 0.1,
                      stroke: false,
                      fillColor: rulerColorMap[ruler.id],
                      fillOpacity: 1,
                    }).bindTooltip(ruler.name, {
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
        .then((result) => {
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

          result.data.data.ruledMint.forEach((mint) => {
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
