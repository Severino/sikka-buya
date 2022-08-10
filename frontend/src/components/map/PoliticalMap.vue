<template>
  <div class="political-map ui">
    <Sidebar title="Prägeorte">
      <mint-list
        :items="mintsList"
        :selectedIds="selectedMints"
        @selectionChanged="mintSelectionChanged"
      />
    </Sidebar>

    <div class="center-ui center-ui-top">
      <div class="toolbar top-right-toobar">
        <Button
          v-if="filtersActive"
          class="clear-filter-btn"
          @click="resetFilters()"
          >Filter aufheben</Button
        >
      </div>
      <map-settings-box
        :open="overlaySettings.uiOpen"
        @toggle="toggleSettings"
        @reset="resetSettings"
      >
        <label>Kreisgröße</label>
        <input
          type="range"
          name="maxRadius"
          :value="overlaySettings.maxRadius"
          @input="overlaySettingsChanged"
          :min="overlaySettings.maxRadiusMinimum"
          :max="overlaySettings.maxRadiusMaximum"
        />
      </map-settings-box>
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

    <Sidebar title="Herrscher" side="right">
      <ruler-list
        :selectedUnavailable="selectedUnavailableRulers"
        :items="availableRulers"
        :selectedIds="selectedRulers"
        @selectionChanged="rulerSelectionChanged"
      />
    </Sidebar>
  </div>
</template>

<script>
// Models
import TimelineChart from '../../models/timeline/TimelineChart.js';

//Utils
import Sort from '../../utils/Sorter';
import Sorter from '../../utils/Sorter';

// Other
import Query from '../../database/query';

//Mixins
import map from './mixins/map';
import timeline from './mixins/timeline';
import mintLocations from './mixins/MintLocationsMixin';
import settingsMixin from '../map/mixins/settings';

// Components
import FilterIcon from 'vue-material-design-icons/Filter.vue';
import SettingsIcon from 'vue-material-design-icons/Cog.vue';

import Sidebar from './Sidebar.vue';
import Timeline from './control/Timeline.vue';
import Checkbox from '../forms/Checkbox.vue';
import MultiSelectList from '../MultiSelectList.vue';
import ScrollView from '../layout/ScrollView.vue';
import RulerList from '../RulerList.vue';
import MintList from '../MintList.vue';

import PoliticalOverlay from '../../maps/PoliticalOverlay';
import Settings from '../../settings.js';

import MapSettingsBox from '../MapSettingsBox.vue';

let settings = new Settings(window, 'PoliticalOverlay');
const overlaySettings = settings.load();

export default {
  name: 'PoliticalMap',
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
    MapSettingsBox,
  },
  data: function () {
    return {
      data: null,
      overlay: null,
      types: [],
      mints: [],
      persons: {},
      rulers: [],
      availableRulers: [],
      selectedUnavailableRulers: [],
      selectedRulers: [],
      rulerListStyles: [],
      patterns: {},
      mintTimelineData: [],
      timelineChart: null,
    };
  },
  mixins: [
    map,
    timeline,
    settingsMixin(overlaySettings),
    mintLocations({
      onMintSelectionChanged: function () {
        this.drawMintCountOntoTimeline();
        // this.update();
      },
    }),
  ],
  computed: {
    filters() {
      return {
        yearOfMint: this.timeline.value.toString(),
        mint: this.selectedMints,
      };
    },
    selections() {
      return {
        selectedRulers: this.selectedRulers,
        selectedMints: this.selectedMints,
      };
    },
    filtersActive: function () {
      return this.selectedRulers.length > 0 || this.selectedMints.length > 0;
    },
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
  created() {
    settings.onSettingsChanged((changedSettings) => {
      let settings = this.overlaySettings;
      changedSettings.forEach(([key, value]) => {
        settings[key] = value;
      });
      this.overlaySettings = Object.assign(this.overlaySettings, settings);

      this.repaint();
    });

    this.overlay = new PoliticalOverlay(this.featureGroup, settings, {
      onDataTransformed: (transformedData, filters) => {
        this.mints = transformedData.mints;
        this.unavailableMints = transformedData.unavailableMints;
        this.availableMints = transformedData.availableMints;
        this.persons = transformedData.persons;
        this.rulers = transformedData.rulers;

        this.updateAvailableRulers();
      },
    });
  },
  mounted: async function () {
    const starTime = parseInt(localStorage.getItem('map-timeline')) || 433;
    this.timelineChart = new TimelineChart(
      this.$refs.timelineCanvas,
      this.raw_timeline
    );
    await this.initTimeline(starTime);
    this.update();

    console.log(this.timeline);
    this.drawMintCountOntoTimeline();

    window.addEventListener('resize', this.updateCanvas);
  },
  unmounted: function () {
    if (this.mintLocations) this.mintLocations.clearLayers();

    window.removeEventListener('resize', this.updateCanvas);
  },
  methods: {
    updateCanvas() {
      const canvas = this.$refs.timelineCanvas;
      const rect = canvas.parentNode.getBoundingClientRect();

      canvas.width = rect.width;
      canvas.height = rect.height;
      this.drawMintCountOntoTimeline();
    },
    timelineChanged(value) {
      localStorage.setItem('map-timeline', value);
      this.timeChanged(value);
    },
    timelineUpdated: async function () {
      this.update();

      //   let types = await this.fetchTypes();
      //   if (types != null) {
      //     this.types = types;
      //     this.update();
      //   }
    },
    resetFilters: function () {
      this.rulerSelectionChanged([], true);
      this.mintSelectionChanged([], true);
      this.update();
    },
    async update() {
      await this.overlay.update({
        filters: this.filters,
        selections: this.selections,
      });

      // this.updateMintLocationMarker();
      // this.updateAvailableMints();
      // this.updateAvailableRulers();
      // this.$emit('timeline-updated', this.value);
    },
    repaint() {
      if (this.overlay) {
        this.overlay.repaint({
          filters: this.filters,
          selections: this.selections,
        });
      }
    },
    updateAvailableRulers() {
      let selectedRulers = this.selectedRulers.slice();

      this.availableRulers = Object.values(this.rulers).sort(
        Sort.stringPropAlphabetically('shortName')
      );

      /**
       * If a ruler is selected but not in the timeline anymore:
       */
      this.selectedUnavailableRulers = [];
      selectedRulers.forEach((selectedRuler) => {
        if (!this.rulers[selectedRuler]) {
          this.selectedUnavailableRulers.push(this.persons[selectedRuler]);
        }
      });
      this.selectedUnavailableRulers.sort(
        Sort.stringPropAlphabetically('shortName')
      );
    },
    updateConcentricCircles: function () {
      let rulers = {};
      let mints = {};

      for (let caliphKey of Object.keys(this.patterns)) {
        for (let heirKey of Object.keys(this.patterns[caliphKey])) {
          this.patterns[caliphKey][heirKey].removeFrom(this.map);
          delete this.patterns[caliphKey][heirKey];
        }
        delete this.patterns[caliphKey];
      }
      this.patterns = {};

      this.types.forEach((type) => {
        if (type.mint?.id) mints[type.mint.id] = type.mint;
        if (type.caliph) {
          rulers[type.caliph.id] = type.caliph;

          /**
           * There should be only one heir.
           * So we only look for the first heir we find.
           */
          if (type.otherPersons) {
            const heir = type.otherPersons.find(
              (person) => person.role.name === 'heir'
            );
            if (heir != undefined) {
              rulers[heir.id] = heir;
              type.heir = heir;
              const stripes = new this.L.StripePattern({
                color: type.caliph.color,
                spaceColor: heir.color,
                opacity: 1,
                spaceOpacity: 1,
                weight: 7,
                angle: -45,
              });
              stripes.addTo(this.map);

              if (!this.patterns[type.caliph.id])
                this.patterns[type.caliph.id] = {};
              this.patterns[type.caliph.id][heir.id] = stripes;
            }
          }
        }
        type.issuers.forEach((issuer) => (rulers[issuer.id] = issuer));
        type.overlords.forEach((overlord) => (rulers[overlord.id] = overlord));
      });

      let data = this.types;

      if (this.selectedMints.length > 0) {
        data = data.filter((type) =>
          this.selectedMints.includes(type.mint?.id)
        );
      }

      this.rulers = rulers;

      if (this.concentricCircles) {
        this.concentricCircles.remove();
        this.concentricCircles = null;
      }

      let mintsFeatures = {};

      data.forEach((obj) => {
        let mint = obj.mint;

        if (!mintsFeatures[mint.id]) {
          let obj = {
            name: mint.name,
            type: mint.location.type,
            coordinates: mint.location.coordinates,
            drawn: 0,
            coins: [],
          };
          mintsFeatures[mint.id] = obj;
        }

        mintsFeatures[mint.id].coins.push(obj);
      });

      this.L.geoJSON(Object.values(this.mints));

      const selectedRulers = this.selectedRulers.slice();
      const patterns = this.patterns;
      const mintMarkerOptions = this.mintMarkerOptions;
      const L = this.L;

      // this.concentricCircles = this.L.geoJSON(
      //   Object.values(mintsFeatures),

      //   {
      //     pointToLayer: function (feature, latlng) {},
      //     coordsToLatLng: function (coords) {
      //       return new L.LatLng(coords[0], coords[1], coords[2]);
      //     },
      //     style: {
      //       fillOpacity: 1,
      //     },
      //   }
      // );

      // this.concentricCircles.addTo(this.featureGroup);

      /**
       * Bring selected layer to the front.
       */
      // for (let layer of Object.values(this.concentricCircles._layers)) {
      //   if (layer.selected) layer.bringToFront();
      // }
    },
    clearMintSelection() {
      this.mintSelectionChanged([]);
    },
    clearRulerSelection() {
      this.rulerSelectionChanged([]);
    },
    getRulerColor(ruler) {
      // return '#333333';
      return ruler.color || '#ff00ff';
    },
    updateAvailableMints() {
      // let avalMints = {};
      // let mints = this.mints;
      // if (this.types) {
      //   for (let type of this.types) {
      //     if (avalMints[type.mint.id] == null && type?.mint?.id) {
      //       const mintId = type.mint.id;
      //       if (this.selectedRulers.length == 0) {
      //         avalMints[mintId] = type.mint;
      //       } else {
      //         if (this.mintHasActiveRuler(type)) {
      //           avalMints[mintId] = type.mint;
      //         }
      //       }
      //     }
      //   }
      //   let unavailMints = [];
      //   for (let mint of Object.values(mints)) {
      //     if (!avalMints[mint.id]) {
      //       unavailMints.push(mint);
      //     }
      //   }
      //   this.availableMints = Object.values(avalMints);
      //   this.unavailableMints = unavailMints;
      // }
    },
    rulerSelectionChanged(selected, preventUpdate = false) {
      this.selectedRulers = selected;

      if (!preventUpdate) {
        this.repaint();
      }
    },
    // mintHasActiveRuler(type) {
    //   if (!type.mint) return false;
    //   for (let property of ['issuers', 'overlords', 'caliph']) {
    //     if (!type[property]) continue;
    //     let personArr = !Array.isArray(type[property])
    //       ? [type[property]]
    //       : type[property];

    //     for (let i = 0; i < personArr.length; i++) {
    //       const personId = personArr[i].id;
    //       if (this.selectedRulers.indexOf(personId) != -1) return true;
    //     }
    //   }

    //   return false;
    // },
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
   mint {id name}
    data {x, y}
}
}`
        )
          .then((val) => {
            this.mintTimelineData = val.data.data.typeCountOfMints;

            let xSet = new Set();
            let x = [];

            function resolveRange(arr) {
              const sorted = arr.sort();
              let ranges = [];

              if (sorted.length !== 0) {
                const first = sorted.shift();
                ranges.push([first, first]);

                let prev = first;
                let prevRange = 0;
                for (let point of sorted) {
                  if (point - prev === 1) {
                    ranges[prevRange][1] = point;
                  } else {
                    ranges.push([point, point]);
                    prevRange++;
                  }
                  prev = point;
                }
              }
              return ranges;
            }

            this.mintTimelineData.forEach((mintData, idx) => {
              mintData.data.forEach(({ x }) => {
                xSet.add(x);
              });

              const mint = mintData;
              delete mint.data;
            });

            this.timelineChart.updateTimeline(this.raw_timeline);
            this.timelineChart.drawMintLinesOnCanvas(
              resolveRange(Array.from(xSet.values())),
              5,
              {
                lineCap: 'square',
                lineWidth: 5,
                strokeStyle: '#48ac48',
              }
            );
          })
          .catch(console.error);
    },
  },
};
</script>

<style lang="scss">
.political-map {
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
  grid-template-columns: 1fr 5fr 1fr;

  @media screen and (max-width: 1080px) {
    grid-template-columns: 1fr 3fr 1fr;
  }

  @media screen and (max-width: 720px) {
    grid-template-columns: 1fr 2fr 1fr;
  }

  grid-template-rows: 1fr 3fr 120px;

  pointer-events: none;

  > * {
    pointer-events: auto;
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
