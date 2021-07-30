<template>
  <map-view class="mapview" ref="map" />
</template>

<script>
var L = require("leaflet");
var turf = require("@turf/turf");
console.log(turf);
import Query from "../../database/query";
import MapView from "../MapView.vue";

export default {
  components: { MapView },
  computed: {
    map: function () {
      return this.$refs.map.map;
    },
  },
  mounted: function () {
    Query.raw(
      `{
  mint {
    name
    location {
      type
      coordinates
    }
  }
  getDominion {
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
  }
}`
    )
      .then((result) => {
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
            let distance = 1 / (idx + 1);
            let resolution = 3;
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
          console.log(points);

          let area = turf.convex(turf.featureCollection(points));
          area.dominion = dominion;
          dominionData[idx] = area;
        });

        let geoJsonLayer = L.geoJSON(dominionData, {
          coordsToLatLng: function (coords) {
            return new L.LatLng(coords[0], coords[1], coords[2]);
          },
          style: {
            stroke: false,
            fillColor: "#48ac48",
            fillOpacity: 0.5,
          },
        }).addTo(this.map);

        geoJsonLayer.bindTooltip(
          (layer) => {
            return layer.feature.dominion.overlord.name;
          },
          {
            sticky: true,
            direction: "top",
          }
        );

        let mintData = result.data.data.mint;
        mintData = mintData.filter((mint) => {
          return (
            mint.location?.coordinates &&
            Array.isArray(mint.location.coordinates) &&
            mint.location.coordinates.length > 0
          );
        });
        console.log(mintData);

        L.geoJSON(
          mintData.map((mint) => {
            let geo = mint.location;
            geo.mint = mint;
            return geo;
          }),
          {
            pointToLayer: (point, latlng) => {
              console.log(point, latlng);
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
        ).addTo(this.map);
      })
      .catch(console.error);
  },
};
</script>

<style lang="scss">
.mapview {
  min-height: 100px;
  flex: 1;
}
</style>
