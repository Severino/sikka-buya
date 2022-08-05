<template>
  <div class="material-map ui">
    <Sidebar title="Prägeorte">
      <!-- <Button class="clear-filter-btn" @click="clearMintSelection"
        >Auswahl aufheben</Button
      > -->
      <mint-list
        :items="mintsList"
        :selectedIds="selectedMints"
        @selectionChanged="selectionChanged"
      />
    </Sidebar>

    <div class="center-ui center-ui-top">
      <div class="toolbar top-right-toobar">
        <Button
          v-if="catalogFilterActive"
          class="clear-filter-btn"
          @click="resetFilters()"
          >Filter aufheben</Button
        >
      </div>

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
          <Button @click.native="resetSettings"
            >Standard wiederherstellen</Button
          >
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
          ref="catalogFilter"
          @update="dataUpdated"
          :pageInfo="pageInfo"
          :exclude="['mint', 'yearOfMint', 'ruler', 'caliph']"
          :constantFilters="{
            excludeFromMapApp: false,
          }"
          :overwriteFilters="overwriteFilters"
          typeBody="
              id
              projectId
              yearOfMint
              material {
                id
                name
                color
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
import mintLocations from './mixins/MintLocationsMixin';

import MaterialOverlay from '../../maps/MaterialOverlay';
import Sorter from '../../utils/Sorter';

import FilterIcon from 'vue-material-design-icons/Filter.vue';
import SettingsIcon from 'vue-material-design-icons/Cog.vue';
import MintList from '../MintList.vue';
import ScrollView from '../layout/ScrollView.vue';
import LabeledInputContainer from '../LabeledInputContainer.vue';
import Button from '../layout/buttons/Button.vue';
import CatalogFilter from '../page/catalog/CatalogFilter.vue';

import Settings from '../../settings';

let settings = new Settings(window, 'MaterialOverlay');
const overlaySettings = settings.load();

export default {
  name: 'MaterialMap',
  components: {
    SettingsIcon,
    Sidebar,
    Timeline,
    Checkbox,
    FilterIcon,
    MintList,
    ScrollView,
    LabeledInputContainer,
    Button,
    CatalogFilter,
  },
  data: function () {
    return {
      painter: null,
      filteredMintLocation: null,
      filteredMintLayer: null,
      pageInfo: { page: 0, count: 100000 },
      materialLayer: null,
      mints: [],
      mintData: {},
      mintLocation: null,
      mintTimelineData: [],
      timelineActive: true,
      mintLayer: null,
      overlaySettings,
      catalogFilterActive: false,
      overwriteFilters: {
        yearOfMint: null,
        mint: null,
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
    mintLocations({
      showMarkers: false,
    }),
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
  created() {
    this.overlay = new MaterialOverlay(this.featureGroup, settings, {
      onGeoJSONTransform: (features) => {
        features.forEach((feature) => {
          feature.data.types.forEach((type) => {
            type.route = this.$router.resolve({
              name: 'Catalog Entry',
              params: { id: type.id },
            });
          });
        });
      },
    });
  },
  mounted: async function () {
    const starTime = parseInt(localStorage.getItem('map-timeline')) || 433;
    this.timelineActive = !localStorage.getItem('map-timeline-active')
      ? false
      : localStorage.getItem('map-timeline-active') === 'true';

    this.fetchMints();
    await this.initTimeline(starTime);
    this.updateTimeline();
    this.timelineChanged(starTime);
  },
  methods: {
    resetSettings() {
      this.overlay.settings.reset();
    },
    selectionChanged(mints) {
      this.mintSelectionChanged(mints);
      this.overwriteFilters.mint = mints;
    },
    dataUpdated(data) {
      const catalogFilters = Object.entries(
        this.$refs.catalogFilter.activeFilters
      ).filter(([key, val]) => {
        if (['excludeFromMapApp', 'mint'].indexOf(key) != -1) return false;
        else if (key === 'yearOfMint') {
          return false;
        }

        return true;
      });
      this.catalogFilterActive = catalogFilters.length > 0;

      this.overlay.setData(data);
      this.overlay.repaint();
    },
    updateMints() {
      this.$refs.catalogFilter.search();
    },
    toggleSettings() {
      this.settings.visible = !this.settings.visible;
    },
    timelineChanged(value) {
      localStorage.setItem('map-timeline', value);
      this.updateYearOverwrite(value);
      this.timeChanged(value);
    },
    timelineUpdated() {},
    updateTimeline: async function () {
      const triggered = this.updateYearOverwrite(this.timeline.value);
      if (!triggered) this.update();
    },
    updateYearOverwrite(value) {
      const old = this.overwriteFilters.yearOfMint;
      if (this.timelineActive) {
        this.overwriteFilters.yearOfMint = value.toString();
      } else {
        this.overwriteFilters.yearOfMint = null;
      }
      return old !== this.overwriteFilters.yearOfMint;
    },
    timelineToggled: async function () {
      this.timelineActive = !this.timelineActive;
      localStorage.setItem('map-timeline-active', this.timelineActive);
      this.updateYearOverwrite(
        this.timelineActive ? this.timeline.value : null
      );
      this.update();
    },
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
      this.$refs.catalogFilter.resetFilters();
      this.clearMintSelection({ preventUpdate: true });
      this.update();
    },
    update() {
      this.updateMints();
      this.$emit('timeline-updated', this.value);
    },
  },
};
</script>

<style lang="scss">
.material-map {
  .catalog-filters {
    $smaller-input-pad: $small-padding 2 * $small-padding;

    .labeled-input-container {
      margin-bottom: 0.1em;
    }

    .radio-button {
      label {
        padding: $smaller-input-pad;
      }
    }

    label {
      font-size: $small-font;
      font-weight: normal;
      margin-bottom: 0.1em;
    }

    .three-way-toggle {
      min-height: 20px;
    }

    .button,
    button,
    input {
      padding: $smaller-input-pad;
    }

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
