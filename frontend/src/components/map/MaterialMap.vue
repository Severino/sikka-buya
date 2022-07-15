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
        :allowToggle="true"
        :timelineActive="timelineActive"
        @input="timelineChanged"
        @change="timelineChanged"
        @toggle="timelineToggled"
      >
        <template #background>
          <canvas id="timeline-canvas" ref="timelineCanvas"> </canvas>
        </template>
      </timeline>
    </div>

    <Sidebar title="Filter" side="right">
      <div class="padding-box">
        <catalog-filter
          @update="dataUpdated"
          :pageInfo="pageInfo"
          typeBody="mint {
                id
                name
                location 
                uncertain
                province {
                  id
                  name
                }
              }"
        />
      </div>
    </Sidebar>
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

import MintLocation from '../../models/mintlocation';
import Sorter from '../../utils/Sorter';
import MultiSelectList from '../MultiSelectList.vue';

import FilterIcon from 'vue-material-design-icons/Filter.vue';
import SettingsIcon from 'vue-material-design-icons/Cog.vue';
import MintList from '../MintList.vue';
import ScrollView from '../layout/ScrollView.vue';
import { concentricCircles } from '../../models/map/geometry';
import Mint from '../../models/map/mint';
import { White } from '../../utils/Color';
import DataSelectField from '../forms/DataSelectField.vue';
import LabeledInputContainer from '../LabeledInputContainer.vue';
import ThreeWayToggle from '../forms/ThreeWayToggle.vue';
import MultiButton from '../layout/buttons/MultiButton.vue';
import Button from '../layout/buttons/Button.vue';
import CatalogFilter from '../page/catalog/CatalogFilter.vue';

export default {
  name: 'MaterialMap',
  components: {
    SettingsIcon,
    Sidebar,
    Timeline,
    Checkbox,
    FilterIcon,
    MultiSelectList,
    MintList,
    ScrollView,
    DataSelectField,
    LabeledInputContainer,
    ThreeWayToggle,
    MultiButton,
    Button,
    CatalogFilter,
  },
  data: function () {
    return {
      pageInfo: { page: 0, count: 100000 },
      materialLayer: null,
      mints: [],
      mintData: {},
      mintLocation: null,
      mintTimelineData: [],
      timelineActive: true,
      mintLayer: null,
      filters: {
        material: { id: null, name: '' },
        materials: [],
        nominals: [],
        caliphs: [],
        donativ: null,
        cursive: null,
        yearUncertain: null,
        mintUncertain: null,
      },
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
    mintMarkerOptions() {
      return {
        radius: 10,
        stroke: true,
        weight: 1,
        color: 'gray',
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
      parseInt(localStorage.getItem('material-map-timeline')) || 433;
    await this.initTimeline(starTime);
    this.updateTimeline();
  },
  methods: {
    dataUpdated(data) {
      const mints = {};

      data.types
        .filter((type) => type?.mint?.location != null)
        .forEach((type) => {
          if (!mints[type.mint.id]) {
            const mint = type.mint;
            mint.location = JSON.parse(mint.location);
            mints[type.mint.id] = mint;
            mints[type.mint.id].data = { mint, types: [] };
          }
        });

      this.mints = mints;

      this.updateMints();
    },
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
    timelineToggled: async function () {
      this.timelineActive = !this.timelineActive;
      // this.fetchTypes();
      this.update();
    },
    async fetchTypes() {
      // await this.fetchMints();
      // try {
      //   if (this.timelineActive) {
      //     await this.fetchMaterial();
      //   } else {
      //     await this.fetchMaterial();
      //   }
      //   this.update();
      // } catch (e) {
      //   console.error(e);
      // }
    },
    //     async fetchMaterial2() {
    //       this.mintData = {};
    //       const result = await Query.raw(`{mintMaterials {
    //   mint {
    //     id
    //     name
    //   },
    //   materials {
    //     id,
    //     name,
    //     color
    //   }
    // }}`);
    //       this.mintData = result.data.data.mintMaterials.reduce(
    //         (prev, { mint, materials }) => {
    //           if (mint.id) {
    //             if (prev[mint.id] != null)
    //               console.error('Mint id was already set.');
    //             else {
    //               prev[mint.id] = {};
    //               materials.forEach((mat) => {
    //                 if (!mat.id) {
    //                   console.log(`Material has no id: `, mat);
    //                 } else {
    //                   prev[mint.id][mat.id] = this.getMaterialOptions(mat);
    //                 }
    //               });
    //             }
    //           } else console.error('Mint had no id: ', mint);
    //           return prev;
    //         },
    //         {}
    //       );
    //     },

    // async fetchMaterial() {
    //   this.mintData = {};
    //   const types = {};
    //   let fetching = true;

    //   let pagination = {
    //     page: 0,
    //     count: 1000,
    //   };

    //   const filters = {
    //     material: this.filters.materials.map((mat) => mat.id),
    //   };

    //   if (this.timelineActive)
    //     filters.yearOfMint = this.timeline.value.toString();

    //   while (fetching) {
    //     console.log(filters);

    //     const result = await Query.raw(
    //       `query ($pagination:Pagination, $filters: TypeFilter){
    //           coinType (pagination: $pagination, filters: $filters) {
    //             pageInfo{
    //                 page
    //                 count
    //                 last
    //                 total
    //               }
    //               types {
    //                 id
    //                 projectId
    //                 mint {id, name}
    //                 material {id name color}
    //               }
    //             }
    //         }`,
    //       { filters, pagination }
    //     );

    //     pagination.page++;

    //     const { types, pageInfo } = result.data.data.coinType;

    //     if (
    //       pageInfo.count * (pageInfo.page + 1) >= pageInfo.total ||
    //       types.length == 0
    //     ) {
    //       fetching = false;
    //     }

    //     types.forEach((type) => {
    //       const mintId = type?.mint?.id;
    //       const materialId = type?.material?.id;
    //       if (materialId && mintId) {
    //         if (!this.mintData[mintId]) {
    //           this.mintData[mintId] = {};
    //           this.mintData[mintId][materialId] = this.getMaterialOptions(
    //             type?.material
    //           );
    //         } else {
    //           if (!this.mintData[mintId][materialId]) {
    //             this.mintData[mintId][materialId] = this.getMaterialOptions(
    //               type?.material
    //             );
    //           } else this.mintData[mintId][materialId].count++;
    //         }
    //       }
    //     });
    //   }
    // },
    getMaterialOptions(material) {
      return {
        id: material?.id,
        name: material?.name,
        count: 1,
        fillColor: material?.color || '#222',
        fillOpacity: 1,
        color: 'white',
        weight: 1,
      };
    },
    resetFilters: function () {
      this.clearMintSelection({ preventUpdate: true });
      this.update();
    },
    update() {
      this.updateMints();
      // this.updateConcentricCircles();
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

      console.log(that);

      this.materialLayer = this.L.geoJSON(materialFeatures, {
        pointToLayer: function (feature, latlng) {
          let data = feature.data.materials.map((materials) => {
            return {
              data: [materials],
            };
          });

          let sorted = data.sort((a, b) => {
            return a.data[0].name.localeCompare(b.data[0].name);
          });

          const featureGroup = concentricCircles(latlng, sorted, {
            innerRadius: 5,
            radius: 15,
            styles: [
              {
                stroke: true,
                color: White,
                weight: 1.5,
              },
            ],
            openPopup: (data) => {
              return `
                ${Mint.popupMintHeader(feature.mint)}
                <div class="popup-body">
                ${data.data.name}
                </div>`;
            },
          });

          this.mintLocation = new MintLocation({
            markerOptions: that.mintMarkerOptions,
            popup() {
              return 'Hello WOrld';
            },
          });
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
    popupFunction(feature) {
      console.log(feature);
      return 'Hello World';
    },
  },
};
</script>

<style lang="scss">
.material-map {
  .catalog-filters {
    > * {
      grid-column: span 6;
    }
  }

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

.active-list {
  display: flex;
  flex-wrap: wrap;

  button {
    margin: $small-padding/2;
    font-size: $small-font;
    border-radius: $border-radius;
    padding: $small-padding/2 $small-padding;
    background-color: $primary-color;
    color: white;
    font-weight: bold;
  }
}
</style>
