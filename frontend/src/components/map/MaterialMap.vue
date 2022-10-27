<template>
  <div class="material-map ui">
    <Sidebar title="Prägeorte">
      <mint-list
        :items="mintsList"
        :selectedIds="selectedMints"
        @selectionChanged="
          (val) => mintSelectionChanged(val, { preventUpdate: true })
        "
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
        <labeled-input-container label="Kreisgröße">
          <slider
            name="maxRadius"
            :value="overlaySettings.maxRadius"
            @input="overlaySettingsChanged"
            :min="overlaySettings.maxRadiusMinimum"
            :max="overlaySettings.maxRadiusMaximum"
          />
        </labeled-input-container>
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
        :allowToggle="true"
        :timelineActive="timelineActive"
        :shareLink="shareLink"
        timelineName="additional-map"
        @input="timelineChanged"
        @change="timelineChanged"
        @toggle="timelineToggled"
      >
        <template #background>
          <canvas id="timeline-canvas" ref="timelineCanvas"> </canvas>
        </template>
      </timeline>
    </div>

    <Sidebar title="Filter" side="right" ref="catalogSidebar">
      <div class="padding-box">
        <catalog-filter
          ref="catalogFilter"
          @update="dataUpdated"
          @dynamic-change="recalculateCatalogSidebar"
          :pageInfo="pageInfo"
          :exclude="[
            'mint',
            'yearOfMint',
            'ruler',
            'caliph',
            'treadwellId',
            'projectId',
          ]"
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
// Mixins
import localstore from '../mixins/localstore';
import map from './mixins/map';
import {
  mintLocationsMixin,
  loadSelectedMints,
} from './mixins/MintLocationsMixin';
import settingsMixin from '../map/mixins/settings';
import timeline from './mixins/timeline';

//Components
import Button from '../layout/buttons/Button.vue';
import CatalogFilter from '../page/catalog/CatalogFilter.vue';
import Checkbox from '../forms/Checkbox.vue';
import LabeledInputContainer from '../LabeledInputContainer.vue';
import MintList from '../MintList.vue';
import Sidebar from './Sidebar.vue';
import Slider from '../forms/Slider.vue';
import Timeline from './control/Timeline.vue';

//Icons
import FilterIcon from 'vue-material-design-icons/Filter.vue';

// Other
import MapSettingsBox from '../MapSettingsBox.vue';
import MaterialOverlay from '../../maps/MaterialOverlay';
import Settings from '../../settings';
import Sorter from '../../utils/Sorter';
import URLParams from '../../utils/URLParams';
import slideshow from '../mixins/slideshow';

const queryPrefix = 'map-filter-';
let settings = new Settings(window, 'MaterialOverlay');
const overlaySettings = settings.load();
const selectedMints = loadSelectedMints();

export default {
  name: 'MaterialMap',
  components: {
    Button,
    CatalogFilter,
    Checkbox,
    FilterIcon,
    LabeledInputContainer,
    MapSettingsBox,
    MintList,
    Sidebar,
    Slider,
    Timeline,
  },
  data: function () {
    return {
      catalogFilterActive: false,
      filteredMintLayer: null,
      filteredMintLocation: null,
      materialLayer: null,
      mintData: {},
      mintLayer: null,
      mintLocation: null,
      mints: [],
      mintTimelineData: [],
      overwriteFilters: {
        yearOfMint: null,
        mint: selectedMints,
      },
      pageInfo: { page: 0, count: 100000 },
      painter: null,
      timelineActive: true,
    };
  },
  mixins: [
    map,
    timeline,
    slideshow,
    settingsMixin(overlaySettings),
    localstore('material-map-settings', ['settings']),
    mintLocationsMixin({
      showMarkers: false,
      onMintSelectionChanged(selection) {
        this.overwriteFilters.mint = selection;
      },
    }),
  ],
  computed: {
    options() {
      const options = {};
      if (this.map) {
        options.zoom = this.map.getZoom();
        const latlng = this.map.getCenter();
        options.location = [latlng.lat, latlng.lng];
      }

      if (this.$refs.catalogFilter?.activeFilters) {
        for (let [key, val] of Object.entries(
          this.$refs.catalogFilter.activeFilters
        )) {
          options[`${queryPrefix}${key}`] = val;
        }
      }
      options.year = this.timelineActive ? this.timeline.value : 'null';
      options.selectedMints = this.selectedMints;

      return options;
    },
    shareLink() {
      const options = Object.assign({}, this.options);
      for (let [key, val] of Object.entries(options)) {
        options[key] = JSON.stringify(val);
      }
      return URLParams.apply(options).href;
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
    filtersActive() {
      return this.selectedMints.length > 0 || this.catalogFilterActive;
    },
  },
  created() {
    settings.onSettingsChanged((changedSettings) => {
      let settings = this.overlaySettings;
      changedSettings.forEach(([key, value]) => {
        settings[key] = value;
      });
      this.overlaySettings = Object.assign(this.overlaySettings, settings);

      this.overlay.repaint();
    });

    this.overlay = new MaterialOverlay(this.featureGroup, settings, {
      onApplyData: (data) => {
        const validTypes = [];
        data.types.forEach((type) => {
          if (type?.mint?.location) {
            try {
              type.mint.location = JSON.parse(type.mint.location);
              validTypes.push(type);
            } catch (e) {
              console.warn(`Could not parse all mints: ${type.mint.name}`, e);
            }
          }
        });

        return validTypes;
      },
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
    this.fetchMints();

    if (this.$route.query['selectedMints']) {
      try {
        let parsed = JSON.parse(this.$route.query['selectedMints']);
        if (Array.isArray(parsed)) {
          this.selectedMints = parsed;
        }
      } catch (e) {
        console.warn(e);
      }
    }

    this.$nextTick(() => {
      for (let [key, val] of Object.entries(this.$route.query)) {
        if (
          key.startsWith(queryPrefix) &&
          this.$refs?.catalogFilter?.activeFilters
        ) {
          try {
            let parsed = JSON.parse(val);
            const filterKey = key.replace(queryPrefix, '');
            this.$refs.catalogFilter.setFilter(filterKey, parsed);
          } catch (e) {
            console.warn(e);
          }
        }
      }
    });

    if (this.$route.query.year) {
      if (this.$route.query.year === 'null') this.timelineActive = false;
    } else {
      this.timelineActive =
        JSON.parse(
          window.localStorage.getItem('material-map-timeline-active')
        ) || false;
    }

    await this.initTimeline(433);
    this.updateTimeline();
  },
  methods: {
    recalculateCatalogSidebar() {
      this.$refs.catalogSidebar.recalculate();
    },
    requestSlideOptions({ slideshow, index, overwrite } = {}) {
      slideshow.createSlide(this.options, index, overwrite);
    },
    applySlide(options = {}) {
      if (options.zoom && options.location) {
        this.map.flyTo(options.location, options.zoom);
      }

      if (options.year) {
        if (options.year === 'null') {
          this.timelineActive = false;
        } else {
          this.timelineActive = true;
          this.timeChanged(options.year);
        }
      }

      if (options.selectedMints)
        this.mintSelectionChanged(options.selectedMints);

      this.$refs.catalogFilter.resetFilters();
      Object.entries(options).forEach(([key, value]) => {
        if (key.startsWith(queryPrefix)) {
          const param = key.replace(queryPrefix, '');
          this.$refs.catalogFilter.filters[param] = value;
        }
      });
    },
    resetSettings() {
      this.overlay.settings.reset();
      this.$emit('reset');
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
      localStorage.setItem('material-map-timeline-active', this.timelineActive);

      const year = this.timelineActive ? this.timeline.value : 'null';
      URLParams.update({ year });

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
      // this.$refs.catalogFilter.stopWatching();
      this.$refs.catalogFilter.resetFilters();
      this.clearMintSelection({ preventUpdate: true });
      this.overwriteFilters.mint = this.selectedMints;
      // this.$refs.catalogFilter.resumeWatching();

      // this.update();
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

    > * {
      grid-column: span 6;
    }
  }
}
</style>

<style lang="scss" scoped>
// .active-list {
//   display: flex;
//   flex-wrap: wrap;

//   button {
//     margin: $small-padding/2;
//     font-size: $small-font;
//     border-radius: $border-radius;
//     padding: $small-padding/2 $small-padding;
//     background-color: $primary-color;
//     color: white;
//     font-weight: bold;
//   }
// }
</style>
