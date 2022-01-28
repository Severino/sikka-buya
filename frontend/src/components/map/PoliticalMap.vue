<template>
  <div class="islam-political-map ui">
    <Sidebar title="Prägeorte">
      <Button class="clear-filter-btn" @click="clearMintSelection"
        >Auswahl aufheben</Button
      >
      <multi-select-list
        id="mints"
        :items="availableMintsList"
        :selectedIds="this.selectedMints"
        @selectionChanged="mintSelectionChanged"
      />
      <multi-select-list
        id="mints"
        class="unavailable"
        :items="unavailableMintsList"
        :selectedIds="this.selectedMints"
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
      />
    </div>

    <Sidebar title="Herrscher" side="right">
      <Button class="clear-filter-btn" @click="clearRulerSelection"
        >Auswahl aufheben</Button
      >

      <multi-select-list
        id="mints"
        :items="availableRulers"
        :selectedIds="selectedRulers"
        @selectionChanged="rulerSelectionChanged"
      />
    </Sidebar>
  </div>
</template>

<script>
import Sidebar from './Sidebar.vue';
import Color from '../../models/map/color.js';
import Timeline from './control/Timeline.vue';
import Checkbox from '../forms/Checkbox.vue';

import map from './mixins/map';
import timeline from './mixins/timeline';
import localstore from '../mixins/localstore';

import Query from '../../database/query';

import MintLocation from '../../models/mintlocation';
import SikkaColor from '../../utils/Color';
import MultiSelectList from '../MultiSelectList.vue';

import Person from '../../utils/Person';
import { rulerPopup } from '../../models/map/political';

import L from 'leaflet';

import FilterIcon from 'vue-material-design-icons/Filter.vue';
import SettingsIcon from 'vue-material-design-icons/Cog.vue';
import { concentricCircles } from '../../models/map/geometry';
import { coinsToRulerData } from '../../models/rulers';

export default {
  name: 'PoliticalMap',
  components: {
    SettingsIcon,
    Sidebar,
    Timeline,
    Checkbox,
    FilterIcon,
    MultiSelectList,
  },
  data: function () {
    return {
      types: [],
      mints: [],
      rulers: [],
      selectedRulers: [],
      selectedMints: [],
      rulerListStyles: [],
      availableMints: [],
      unavailableMints: [],
      availableRulers: [],
      mintLocation: null,
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
    availableMintsList() {
      return this.availableMints.map((mint) => {
        return {
          id: mint.id,
          text: mint.name,
        };
      });
    },
    unavailableMintsList() {
      return this.unavailableMints.map((mint) => {
        return {
          id: mint.id,
          text: mint.name,
        };
      });
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

    this.mintLocation = new MintLocation(this, {
      radius: 8,
      stroke: false,
      fillColor: 'white',
      fillOpacity: 1,
    });

    await this.initTimeline(starTime);
    this.updateTimeline();
  },
  unmounted: function () {
    this.mintLocation.removeExistingLocation();
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
mint {
  id
  name
  location
  uncertain
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
    }
    mint {
      id
      name
      location
    },
    issuers {
      id
      name
      shortName
      color
    }
    overlords {
      id
      name
      shortName
      rank
      color
    }
    excludeFromTypeCatalogue
  }
  }
}`
          )
            .then((result) => {
              let data = result.data.data.coinType.types;
              let mints = result.data.data.mint.filter(
                (mint) => mint.location != null
              );
              this.mints = {};
              mints.forEach((mint) => {
                this.mints[mint.id] = mint;
              });

              data.forEach((type) => {
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

              data = data.filter(
                (d) => (d.mint?.location && d.mint.location.coordinates) != null
              );

              resolve(data);
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
      this.selectedMints = [];
      this.selectedRulers = [];
      this.update();
    },
    update() {
      this.updateConcentricCircles();
      this.updateAvailableMints();
      this.updateMintLocationMarker();
      this.updateAvailableRulers();
      this.$emit('timeline-updated', this.value);
    },
    updateMintLocationMarker() {
      this.mintLocation.removeExistingLocation();
      let features = this.mintLocation.mapToGeoJsonFeature(this.mints);
      this.mintLocations = this.mintLocation.createGeometryLayer(features);

      this.mintLocations.addTo(this.featureGroup);
    },
    updateAvailableRulers() {
      const rulers = Object.values(this.rulers);
      this.availableRulers = rulers.map((ruler) => ({
        id: ruler.id,
        text: ruler.shortName || ruler.name || 'Unbenannter Herrscher',
        style: {
          border: '2px solid ' + this.getRulerColor(ruler),
          'border-left': '15px solid ' + this.getRulerColor(ruler),
          marginBottom: '3px',
        },
      }));
    },
    updateConcentricCircles: function () {
      let rulers = {};
      let mints = {};

      this.types.forEach((type) => {
        if (type.mint?.id) mints[type.mint.id] = type.mint;
        if (type.caliph) rulers[type.caliph.id] = type.caliph;
        type.issuers.forEach((issuer) => (rulers[issuer.id] = issuer));
        type.overlords.forEach((overlord) => (rulers[overlord.id] = overlord));
      });

      let data = this.types;

      if (this.selectedMints.length > 0) {
        data = data.filter((type) =>
          this.selectedMints.includes(type.mint?.id)
        );
      }

      this.rulerColorMap = {};
      let i = 0;

      this.rulers = rulers;
      Object.values(rulers).forEach((ruler) => {
        this.rulerColorMap[ruler.id] = Color.byIndex(i);
        i++;
      });

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

      let that = this;

      this.L.geoJSON(Object.values(this.mints));

      this.concentricCircles = this.L.geoJSON(
        Object.values(mintsFeatures),

        {
          pointToLayer: function (feature, latlng) {
            const data = coinsToRulerData(feature.coins, that.selectedRulers);

            console.log(that.selectedMints);

            return concentricCircles(latlng, data, {
              openPopup: function ({ data, groupData }) {
                return rulerPopup(groupData, data?.data);
              },
              innerRadius: that.settings.minRadius.value,
              radius: that.settings.maxRadius.value,
            });
          },

          coordsToLatLng: function (coords) {
            return new that.L.LatLng(coords[0], coords[1], coords[2]);
          },
          style: {
            fillOpacity: 1,
          },
        }
      );

      this.concentricCircles.addTo(this.featureGroup);
    },
    clearMintSelection() {
      this.selectedMints = [];
      this.update();
    },
    clearRulerSelection() {
      this.selectedRulers = [];
      this.update();
    },
    getRulerColor(ruler) {
      // return '#333333';
      return ruler.color || '#ff00ff';
    },
    getContrastColor(ruler) {
      const contrastColor = SikkaColor.getContrastColor(
        this.getRulerColor(ruler),
        '#ffffff',
        '#000000'
      );

      return contrastColor;
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
    mintSelectionChanged(selected) {
      this.selectedMints = selected;
      this.update();
    },
    rulerSelectionChanged(selected) {
      this.selectedRulers = selected;
      this.update();
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
  },
};
</script>

<style lang="scss">
.islam-political-map {
  .side-bar {
    grid-row: 1 / span 3;
  }

  .timeline {
    border: 1px solid $light-gray;
    background-color: white;
    // height: 100%;
    padding: 20px 40px;
    margin: 100px;
    margin-bottom: 20px;
    border-radius: 10px;
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
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-rows: 1fr 3fr 1fr;

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

    z-index: 100;
  }
}
</style>
