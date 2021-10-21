<template>
  <div>
    <timeline
      ref="timeline"
      :map="this.map"
      :from="timeline.from"
      :to="timeline.to"
      :value="timeline.value"
      @input="timeChanged"
      @change="timeChanged"
    />
  </div>
</template>

<script>
import Sidebar from './Sidebar.vue';
import Timeline from './control/Timeline.vue';
import Checkbox from '../forms/Checkbox.vue';
import FilterIcon from 'vue-material-design-icons/Filter.vue';
var turf = require('@turf/turf');

import map from './mixins/map';
import timeline from './mixins/timeline';

import Query from '../../database/query';
import Color from '../../models/map/color';

export default {
  name: 'DominionMap',
  components: { Sidebar, Timeline, Checkbox, FilterIcon },
  mixins: [map, timeline],
  mounted: async function() {
    await this.initTimeline();
    this.updateDominion();
  },
  methods: {
    updateTimeline() {
      this.update();
    },
    update: function() {
      this.updateDominion();
    },
    updateDominion: function() {
      let component = this;
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
          this.mintGeoJSONLayer = component.L.geoJSON([], {
            coordsToLatLng: function(coords) {
              return new component.L.LatLng(coords[0], coords[1], coords[2]);
            },
            style: {
              stroke: true,
              opacity: 0.75,
              color: 'red',
              fillColor: '#48ac48',
              fillOpacity: 0.1
            }
          }).addTo(this.featureGroup);

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

          result.data.data.getDominion.forEach(dominion => {
            dominion.mints.forEach(mint => {
              try {
                mint.location = JSON.parse(mint.location);
              } catch (e) {
                console.error('Could not parse GeoJSON from mint.', mint);
              }
            });
          });

          let dominionData = result.data.data.getDominion;
          dominionData.filter(
            data =>
              data?.mints?.location?.coordinates &&
              Array.isArray(data.mints.location.coordinates) &&
              data.mints.location.coordinates.length > 0
          );
          dominionData.forEach((dominion, idx) => {
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

          let i = 0;
          this.dominionLayer = component.L.geoJSON(dominionData, {
            onEachFeature: function(feature, layer) {
              let color = Color.byIndex(i++);
              layer.setStyle({
                color,
                fillColor: color
              });
            },
            coordsToLatLng: function(coords) {
              return new component.L.LatLng(coords[0], coords[1], coords[2]);
            },
            style: {
              stroke: true,
              opacity: 0.75,
              color: '#48ac48',
              fillColor: '#48ac48',
              fillOpacity: 0.5
            }
          }).addTo(this.featureGroup);
          this.dominionLayer.bindTooltip(
            layer => {
              return layer.feature.dominion.overlord.shortName;
            },
            {
              sticky: true,
              direction: 'top'
            }
          );

          console.log(this.featureGroup);
        })
        .catch(console.error);
    }
  }
};
</script>
