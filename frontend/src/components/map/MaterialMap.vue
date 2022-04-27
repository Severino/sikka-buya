<template>
  <div class="material-map ui">
    <Sidebar title="Prägeorte">
      <!-- <Button class="clear-filter-btn" @click="clearMintSelection"
        >Auswahl aufheben</Button
      > -->
      <mint-list
        :items="mintsList"
        :selectedIds="selectedMints"
        @selectionChanged="mintSelectionChanged"
      />
    </Sidebar>

    <div class="center-ui center-ui-top">
      <div class="settings">
        <SettingsIcon class="settings-icon" @click="toggleSettings" />
        <div class="settings-window" v-if="settings.visible">
          <header>
            <h3>Einstellungen</h3>
          </header>
          <label>Kreisgröße</label>
          <input
            type="range"
            v-model="settings.maxRadius.value"
            :min="settings.maxRadius.min"
            :max="settings.maxRadius.max"
          />
        </div>
      </div>
    </div>
    <div class="center-ui center-ui-center"></div>
    <div class="center-ui center-ui-bottom">
      <timeline
        ref="timeline"
        :map="map"
        :from="timeline.from"
        :to="timeline.to"
        :value="raw_timeline.value"
        :valid="timelineValid"
        @input="timelineChanged"
        @change="timelineChanged"
      >
        <template #background>
          <canvas id="timeline-canvas" ref="timelineCanvas"> </canvas>
        </template>
      </timeline>
    </div>
  </div>
</template>

<script>
import Sidebar from './Sidebar.vue';
import Timeline from './control/Timeline.vue';
import Checkbox from '../forms/Checkbox.vue';

import map from './mixins/map';
import timeline from './mixins/timeline';
import localstore from '../mixins/localstore';
import mintLocations from './mixins/mintLocations';

import Query from '../../database/query';

import MintLocation from '../../models/mintlocation';
import Sorter from '../../utils/Sorter';
import MultiSelectList from '../MultiSelectList.vue';

import FilterIcon from 'vue-material-design-icons/Filter.vue';
import SettingsIcon from 'vue-material-design-icons/Cog.vue';
import RulerList from '../RulerList.vue';
import MintList from '../MintList.vue';
import ScrollView from '../layout/ScrollView.vue';
import { concentricCircles } from '../../models/map/geometry';
import Mint from '../../models/map/mint';

export default {
  name: 'MaterialMap',
  components: {
    SettingsIcon,
    Sidebar,
    Timeline,
    Checkbox,
    FilterIcon,
    MultiSelectList,
    RulerList,
    MintList,
    ScrollView,
  },
  data: function () {
    return {
      materialLayer: null,
      mints: [],
      mintData: {},
      mintLocation: null,
      mintTimelineData: [],
      settings: {
        visible: false,
        minRadius: { value: 10, min: 0, max: 50 },
        maxRadius: { value: 30, min: 10, max: 100 },
      },
    };
  },
  mixins: [
    map,
    timeline,
    localstore('material-map-settings', ['settings']),
    mintLocations,
  ],
  computed: {
    mintsList() {
      function addAvailability(mint, available) {
        mint.available = available;
        return mint;
      }

      return [
        ...this.availableMints
          .map((mint) => addAvailability(mint, true))
          .sort(Sorter.stringPropAlphabetically('name')),
        ...this.unavailableMints
          .map((mint) => addAvailability(mint, false))
          .sort(Sorter.stringPropAlphabetically('name')),
      ];
    },
  },
  watch: {
    settings: {
      handler: function () {
        this.update();
        this.save();
      },
      deep: true,
    },
  },
  mounted: async function () {
    const starTime =
      parseInt(localStorage.getItem('material-map-timeline')) || 433;

    this.mintLocation = new MintLocation(this.mintMarkerOptions);

    await this.initTimeline(starTime);
    this.updateTimeline();
  },
  methods: {
    toggleSettings() {
      this.settings.visible = !this.settings.visible;
    },
    timelineChanged(value) {
      localStorage.setItem('material-map-timeline', value);
      this.timeChanged(value);
    },
    updateTimeline: async function () {
      this.types = await this.fetchTypes();
      this.update();
    },
    async fetchTypes() {
      this.mintData = {};
      let fetching = true;

      await this.fetchMints();

      try {
        while (fetching) {
          const result = await Query.raw(
            `{
      coinType (filters: {yearOfMint:"${this.raw_timeline.value}"}) {
        pageInfo{
            page
            count
            last
            total
          }
          types {
            id
            projectId
            mint {id, name}
            material {id name}
          }
        }
      }`
          );

          const { types, pageInfo } = result.data.data.coinType;

          const colorMap = {
            5: '#ebb31a',
            6: '#9c9c9c',
            7: '#a0d2eb',
            9: '#e68143',
            10: '#d57b61',
          };

          types.forEach((type) => {
            const mintId = type?.mint?.id;
            const materialId = type?.material?.id;

            const fillColor = colorMap[type?.material?.id];
            if (!fillColor) console.error('COLOR NOT FOUND: ', type);
            if (materialId && mintId) {
              const options = {
                id: type?.material?.id,
                name: type?.material?.name,
                count: 1,
                fillColor,
                fillOpacity: 1,
                color: 'white',
                weight: 1,
              };

              if (!this.mintData[mintId]) {
                this.mintData[mintId] = {};
                this.mintData[mintId][materialId] = options;
              } else {
                if (!this.mintData[mintId][materialId]) {
                  this.mintData[mintId][materialId] = options;
                } else this.mintData[mintId][materialId].count++;
              }
            }
          });

          if (pageInfo.count * (pageInfo.page + 1) >= pageInfo.total) {
            fetching = false;
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    resetFilters: function () {
      this.clearMintSelection({ preventUpdate: true });
      this.update();
    },
    update() {
      this.updateMints();
      this.updateConcentricCircles();
      this.$emit('timeline-updated', this.value);
    },
    updateConcentricCircles() {
      this.clearLayers();

      let materialFeatures = Object.values(this.mints)
        .filter((mint) => {
          return this.mintData[mint.id];
        })
        .map((mint) => {
          const data = {
            mint,
            materials: Object.values(this.mintData[mint.id]),
          };
          return {
            coordinates: mint.location.coordinates,
            type: mint.location.type,
            data,
            mint,
          };
        });

      const that = this;
      this.materialLayer = this.L.geoJSON(materialFeatures, {
        pointToLayer: function (feature, latlng) {
          const featureGroup = concentricCircles(
            latlng,
            feature.data.materials.map((materials) => {
              return {
                data: [materials],
              };
            }),
            {
              innerRadius: 7,
              radius: 12,
              openPopup: (data) => {
                console.log(data);
                return `
                ${Mint.popupMintHeader(feature.mint)}
                <p>${data.data.name}</p>`;
              },
            }
          );

          const mintLocations = new MintLocation(that.mintMarkerOptions);
          const mintMarker = mintLocations.createMarker(feature, latlng);
          mintMarker.addTo(featureGroup);

          featureGroup.on('mouseover', () => featureGroup.bringToFront());
          featureGroup.on('click', () => featureGroup.bringToFront());

          featureGroup.bringToFront();
          return featureGroup;
        },
        coordsToLatLng: function (coords) {
          return new that.L.LatLng(coords[0], coords[1], coords[2]);
        },
      });

      this.materialLayer.addTo(this.featureGroup);
    },

    rulerSelectionChanged(selected, preventUpdate = false) {
      this.selectedRulers = selected;
      if (!preventUpdate) this.update();
    },
    mintHasActiveRuler(type) {
      if (!type.mint) return false;
      for (let property of ['issuers', 'overlords', 'caliph']) {
        if (!type[property]) continue;
        let personArr = !Array.isArray(type[property])
          ? [type[property]]
          : type[property];

        for (let i = 0; i < personArr.length; i++) {
          const personId = personArr[i].id;
          if (this.selectedRulers.indexOf(personId) != -1) return true;
        }
      }

      return false;
    },
    drawMintCountOntoTimeline() {
      const canv = this.$refs.timelineCanvas;
      let ctx = canv.getContext('2d');
      let rect = canv.getBoundingClientRect();

      /**
       * Resizing the canvas will also clear it.
       */
      canv.width = rect.width;
      canv.height = rect.height;

      if (this.selectedMints.length > 0)
        Query.raw(
          `{
 typeCountOfMints(ids: [${this.selectedMints.join(',')}]){
  id, data {
    x
    y
  }
	
}
}`
        )
          .then((val) => {
            this.mintTimelineData = val.data.data.typeCountOfMints;

            const lineWidth = 3;
            let curveMax = 0;
            let curveData = {};
            this.mintTimelineData.forEach((mint) => {
              mint.data.forEach((point) => {
                if (!curveData[point.x]) curveData[point.x] = point.y;
                else curveData[point.x] += point.y;

                if (curveData[point.x] > curveMax)
                  curveMax = curveData[point.x];
              });
            });

            const yStep =
              (canv.height - lineWidth - 10) / (curveMax > 0 ? curveMax : 20);

            let y = (val) => {
              return canv.height - val * yStep;
            };

            let x = (val) => {
              return (
                ((val - this.raw_timeline.from) /
                  (this.raw_timeline.to - this.raw_timeline.from)) *
                  canv.width -
                2
              );
            };

            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = '#bfbfbf';
            ctx.fillStyle = '#eee';
            ctx.beginPath();

            let last = null;
            Object.keys(curveData)
              .sort((a, b) => a - b)
              .forEach((x_key) => {
                const point = { x: x_key, y: curveData[x_key] };
                if (last && point.x - last > 1) {
                  ctx.lineTo(x(last), y(0));
                  last = null;
                }
                if (last == null) ctx.moveTo(x(point.x), y(0));

                ctx.lineTo(x(point.x), y(point.y));
                last = point.x;
              });

            ctx.lineTo(x(last), y(0));
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
          })
          .catch(console.error);
    },
  },
};
</script>

<style lang="scss">
.material-map {
  .side-bar {
    grid-row: 1 / span 3;

    .title {
      color: $gray;
      // text-transform: uppercase;
      // background-color: $light-gray;
      padding: $padding;
      margin: $padding 0;
      border-bottom: $border;

      h3 {
        font-size: 1em;
        margin-bottom: 0;
      }
    }

    .collapsible-header {
      margin-right: $padding;
    }

    .collapsible-content {
      background-color: rgba($color: #000000, $alpha: 0.05);
    }
  }

  .side-bar-right {
    .select-list-item {
      transition: background-color 0.3s;
      background-color: initial;

      > * {
        color: black;
      }

      // &.selected {
      //   background-color: currentColor;
      // }

      span {
        align-self: center;
      }
    }
  }

  .timeline {
    // max-width: 400px;
    margin: 10px 20px;
    width: 100%;

    .slider {
      color: $primary-color;
    }
  }

  .settings {
    position: absolute;
    top: 0;
    right: 0;
    padding: 10px;

    h3 {
      margin: 0;
      margin-bottom: 1em;
    }

    .settings-window {
      width: 240px;
      background-color: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: $shadow;
      border: 1px solid whitesmoke;
    }

    .material-design-icon svg {
      position: absolute;
      top: 20px;
      right: 20px;
      fill: white;
      filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.5));
    }
  }
}
</style>

<style lang="scss" scoped>
.unavailable {
  color: gray;
}

#timeline-canvas {
  position: absolute;
  width: 100%;
  height: 100%;
}

.clear-filter-btn {
  margin-bottom: 15px;
  background-color: $primary-color;
  color: $white;
  font-weight: bold;
  text-align: center;
  border-radius: $border-radius;
  justify-content: center;
  padding: 3px 10px;
}
.grayedOut {
  opacity: 0.3;
  background-color: gray;
}

.ui {
  position: absolute;
  top: 0;
  // background-color: red;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 5fr;

  @media screen and (max-width: 1080px) {
    grid-template-columns: 1fr 3fr;
  }

  @media screen and (max-width: 720px) {
    grid-template-columns: 1fr 2fr;
  }

  grid-template-rows: 1fr 3fr 120px;

  pointer-events: none;

  > * {
    pointer-events: auto;
  }
}

.settings {
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;

  .material-design-icon {
    fill: 'red';
  }
}

.center-ui {
  grid-column: 2;
  position: relative;
  pointer-events: none;

  > * {
    pointer-events: auto;
  }

  &.center-ui-top {
    grid-row: 1;

    z-index: 100;
  }
  &.center-ui-center {
    grid-row: 2;
    pointer-events: none;
    z-index: 100;
  }
  &.center-ui-bottom {
    grid-row: 3;
    display: flex;
    z-index: 100;
  }
}
</style>
