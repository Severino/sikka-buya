<template>
  <map-view class="mapview" ref="map">
    <timeline
      v-if="timeline"
      :from="timeline.from"
      :to="timeline.to"
      v-model="timeline.value"
      @change="updateDominion"
    />
  </map-view>
</template>

<script>
var L = require("leaflet");
var turf = require("@turf/turf");
console.log(turf);
import Query from "../../database/query";
import Timeline from "../map/control/Timeline.vue";
import MapView from "../map/MapView.vue";

export default {
  components: { MapView, Timeline },
  computed: {
    map: function () {
      return this.$refs.map.map;
    },
  },
  data: function () {
    return {
      timeline: null,
    };
  },
  mounted: function () {
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

        this.updateMint(result.data.data.mint);
        this.updateDominion();
      })
      .catch(console.error);
  },
  methods: {
    queryMint: function () {
      Query.raw(`{mint {name location { type coordinates} } }`)
        .then((result) => {
          this.updateMint(result.data.data.mint);
        })
        .catch(console.error);
    },
    updateMint: function (mintData) {
      mintData = mintData.filter((mint) => {
        return (
          mint.location?.coordinates &&
          Array.isArray(mint.location.coordinates) &&
          mint.location.coordinates.length > 0
        );
      });
      console.log(mintData);

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
          coordsToLatLng: function (coords) {
            return new L.LatLng(coords[0], coords[1], coords[2]);
          },
          style: {
            stroke: false,
            fillColor: "#48ac48",
            fillOpacity: 1,
          },
          tooltip: function (feature) {
            return feature.mint.name;
          },
        }
      );

      this.mintLayer.addTo(this.map);
    },
    updateDominion: function () {
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

          console.log(rms);

          if (this.mintGeoJSONLayer) this.mintGeoJSONLayer.remove();
          this.mintGeoJSONLayer = L.geoJSON([], {
            coordsToLatLng: function (coords) {
              return new L.LatLng(coords[0], coords[1], coords[2]);
            },
            style: {
              stroke: true,
              opacity: 0.75,
              color: "#48ac48",
              fillColor: "#48ac48",
              fillOpacity: 0.5,
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
            coordsToLatLng: function (coords) {
              return new L.LatLng(coords[0], coords[1], coords[2]);
            },
            style: {
              stroke: true,
              opacity: 0.75,
              color: "#48ac48",
              fillColor: "#48ac48",
              fillOpacity: 0.5,
            },
          }).addTo(this.map);
          this.dominionLayer.bindTooltip(
            (layer) => {
              return layer.feature.dominion.overlord.name;
            },
            {
              sticky: true,
              direction: "top",
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
</style>
