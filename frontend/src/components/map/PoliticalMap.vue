<template>
  <div class="islam-political-map ui">
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

    <Sidebar title="Herrscher" side="right">
      <!-- <Button class="clear-filter-btn" @click="clearRulerSelection"
        >Auswahl aufheben</Button
      > -->
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
import Sidebar from './Sidebar.vue';
import Timeline from './control/Timeline.vue';
import Checkbox from '../forms/Checkbox.vue';
import Sort from '../../utils/Sorter';

import map from './mixins/map';
import timeline from './mixins/timeline';
import localstore from '../mixins/localstore';

import Query from '../../database/query';

import MintLocation from '../../models/mintlocation';
import SikkaColor from '../../utils/Color';
import MultiSelectList from '../MultiSelectList.vue';
import { rulerPopup } from '../../models/map/political';

import FilterIcon from 'vue-material-design-icons/Filter.vue';
import SettingsIcon from 'vue-material-design-icons/Cog.vue';
import { concentricCircles } from '../../models/map/geometry';
import { coinsToRulerData } from '../../models/rulers';
import RulerList from '../RulerList.vue';
import MintList from '../MintList.vue';
import ScrollView from '../layout/ScrollView.vue';

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
  },
  data: function () {
    return {
      types: [],
      mints: [],
      persons: {},
      rulers: [],
      availableRulers: [],
      selectedUnavailableRulers: [],
      selectedRulers: [],
      selectedMints: [],
      rulerListStyles: [],
      availableMints: [],
      unavailableMints: [],
      mintLocation: null,
      patterns: {},
      mintTimelineData: [],
      location: [29.70507136092254, 51.17151184658878],
      zoom: 6,
      settings: {
        visible: false,
        minRadius: { value: 10, min: 0, max: 50 },
        maxRadius: { value: 30, min: 10, max: 100 },
      },
    };
  },
  mixins: [map, timeline, localstore('political-map-settings', ['settings'])],
  computed: {
    filtersActive: function () {
      return this.selectedRulers.length > 0 || this.selectedMints.length > 0;
    },
    mintsList() {
      function addAvailability(mint, available) {
        mint.available = available;
        return mint;
      }

      return [
        ...this.availableMints.map((mint) => addAvailability(mint, true)),
        ...this.unavailableMints.map((mint) => addAvailability(mint, false)),
      ];
    },
    mintMarkerOptions() {
      return {
        radius: 8,
        stroke: false,
        fillColor: 'white',
        fillOpacity: 1,
      };
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
      parseInt(localStorage.getItem('political-timeline')) || 433;

    this.mintLocation = new MintLocation(this.mintMarkerOptions);

    await this.initTimeline(starTime);
    this.updateTimeline();

    let location = localStorage.getItem('map-location');
    if (location) {
      this.location = JSON.parse(location);
    }

    let zoom = localStorage.getItem('map-zoom');

    if (zoom) {
      console.log(zoom);
      this.zoom = zoom;
    }

    this.map.setView(this.location, this.zoom, { animate: false });

    this.$nextTick(() => {
      this.map.on('moveend', function (args) {
        const { target: map } = args;

        const { lat, lng } = map.getCenter();
        localStorage.setItem('map-location', JSON.stringify([lat, lng]));
        localStorage.setItem('map-zoom', map.getZoom());
      });
    });
  },
  unmounted: function () {
    if (this.mintLocations) this.mintLocations.clearLayers();
  },
  methods: {
    toggleSettings() {
      this.settings.visible = !this.settings.visible;
    },
    timelineChanged(value) {
      localStorage.setItem('political-timeline', value);
      this.timeChanged(value);
    },
    fetchTypes: async function () {
      return new Promise((resolve, reject) => {
        if (!this.timeline.value) {
          reject('Invalid value in timeline.');
        } else {
          Query.raw(
            `{
person {
  id
  name
  shortName
  color
  dynasty {
    id
    name
  }
}
              
mint {
  id
  name
  location
  uncertain
  province {
    id
    name
  }
}
  coinType( filters :{yearOfMint: "${this.timeline.value}", excludeFromMapApp: false},pagination:{count:1000, page:0}){
    types{
    id
    projectId
    material {name}
    donativ
    procedure
    nominal {name}
    mintAsOnCoin
    caliph {
      name,
      shortName
      id
      color
      dynasty{
        id,name
      }
    }
    mint {
      id
      name
      location
      uncertain
      province {
        id
        name
      }
    },
    issuers {
      id
      name
      shortName
      color
      dynasty{
        id,name
      }
    }
    overlords {
      id
      name
      shortName
      rank
      color
      dynasty{
        id,name
      }
    }
    otherPersons {
    id
    shortName
    name
    color
    role {
      id
      name
    }
  }
    excludeFromTypeCatalogue
  }
  }
}`
          )
            .then((result) => {
              let data = result.data.data;
              let types = data.coinType.types;
              let mints = data.mint.filter((mint) => mint.location != null);
              this.mints = {};
              mints.forEach((mint) => {
                this.mints[mint.id] = mint;
              });

              data.person.forEach(
                (person) => (this.persons[person.id] = person)
              );

              types.forEach((type) => {
                if (type?.mint.location) {
                  try {
                    type.mint.location = JSON.parse(type.mint.location);
                  } catch (e) {
                    console.error(
                      'Could not parse GeoJSON.',
                      type.mint.location
                    );
                  }
                }
              });

              types = types.filter(
                (d) => (d.mint?.location && d.mint.location.coordinates) != null
              );

              resolve(types);
            })
            .catch(reject);
        }
      });
    },
    updateTimeline: async function () {
      this.types = await this.fetchTypes();
      this.update();
    },
    resetFilters: function () {
      this.mintSelectionChanged([], true);
      this.rulerSelectionChanged([], true);
      this.update();
    },
    update() {
      this.updateMintLocationMarker();
      this.updateConcentricCircles();
      this.updateAvailableMints();
      this.updateAvailableRulers();
      this.$emit('timeline-updated', this.value);
    },
    updateMintLocationMarker() {
      if (this.mintLocations) this.mintLocations.clearLayers();
      let features = this.mintLocation.mapToGeoJsonFeature(this.mints);
      this.mintLocations = this.mintLocation.createGeometryLayer(features);
      this.mintLocations.addTo(this.featureGroup);
    },
    updateAvailableRulers() {
      let selectedRulers = this.selectedRulers.slice();

      this.availableRulers = Object.values(this.rulers).sort(
        Sort.stringsByProperty
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
      this.selectedUnavailableRulers.sort(Sort.stringsByProperty);
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
      const radius = this.settings.maxRadius.value;
      const mintMarkerOptions = this.mintMarkerOptions;
      const L = this.L;

      this.concentricCircles = this.L.geoJSON(
        Object.values(mintsFeatures),

        {
          pointToLayer: function (feature, latlng) {
            const { data, selected } = coinsToRulerData(
              feature.coins,
              selectedRulers,
              patterns
            );

            const featureGroup = concentricCircles(latlng, data, {
              openPopup: function ({ data, groupData }) {
                return rulerPopup(groupData, data?.data);
              },
              innerRadius: 7,
              radius,
            });

            if (feature?.coins?.length > 0) {
              const mintFeature = {
                mint: feature.coins[0].mint,
              };

              const mintLocations = new MintLocation(mintMarkerOptions);
              mintLocations
                .createMarker(mintFeature, latlng)
                .addTo(featureGroup);
            }

            featureGroup.selected = selected;
            featureGroup.on('mouseover', () => featureGroup.bringToFront());
            featureGroup.on('click', () => featureGroup.bringToFront());
            return featureGroup;
          },
          coordsToLatLng: function (coords) {
            return new L.LatLng(coords[0], coords[1], coords[2]);
          },
          style: {
            fillOpacity: 1,
          },
        }
      );

      this.concentricCircles.addTo(this.featureGroup);

      /**
       * Bring selected layer to the front.
       */
      for (let layer of Object.values(this.concentricCircles._layers)) {
        if (layer.selected) layer.bringToFront();
      }
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
      let avalMints = {};
      let mints = this.mints;

      if (this.types) {
        for (let type of this.types) {
          if (avalMints[type.mint.id] == null)
            if (type.mint) {
              const mintId = type.mint.id;

              if (this.selectedRulers.length == 0) {
                avalMints[mintId] = type.mint;
              } else {
                if (this.mintHasActiveRuler(type)) {
                  avalMints[mintId] = type.mint;
                }
              }
            }
        }

        let unavailMints = [];
        for (let mint of Object.values(mints)) {
          if (!avalMints[mint.id]) {
            unavailMints.push(mint);
          }
        }

        this.availableMints = Object.values(avalMints);
        this.unavailableMints = unavailMints;
      }
    },
    mintSelectionChanged(selected, preventUpdate = false) {
      this.selectedMints = selected;
      if (!preventUpdate) this.update();

      this.drawMintCountOntoTimeline();
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

                console.log(point.y);

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
.islam-political-map {
  .side-bar {
    grid-row: 1 / span 3;
  }

  .side-bar-right {
    .select-list-item {
      transition: background-color 0.3s;
      background-color: initial;

      > * {
        color: black;
      }

      &.selected {
        background-color: currentColor;
      }

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
