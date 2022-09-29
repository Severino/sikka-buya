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
    <div class="center-ui center-ui-center">
      <div class="unlocated-mints" v-if="filteredUnlocatedTypes.length > 0">
        <header class="underlined-header">
          <h3 class="gray-heading"><i>nicht auf Karte:</i></h3>
        </header>
        <section
          v-for="obj of unlocatedTypesByMint"
          :key="`unlocated-${obj.mint.id}`"
          class="unlocated-mint-wrapper"
        >
          <h4>
            {{ obj.mint.name }}
          </h4>
          <div class="mint-grid grid col-3">
            <router-link
              v-for="type of obj.types"
              target="_blank"
              :to="{ name: 'Catalog Entry', params: { id: type.id } }"
              :key="`unlocated-mint-${type.projectId}`"
              >{{ type.projectId }}</router-link
            >
          </div>
        </section>
      </div>
    </div>
    <div class="center-ui center-ui-bottom">
      <timeline
        ref="timeline"
        :map="map"
        :from="timeline.from"
        :to="timeline.to"
        :value="raw_timeline.value"
        :valid="timelineValid"
        :shareLink="shareLink"
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
import Range from '../../models/timeline/range.js';
import Sequence from '../../models/timeline/sequence.js';

//Utils
import Sort from '../../utils/Sorter';
import Sorter from '../../utils/Sorter';

// Other
import Query from '../../database/query';

//Mixins
import map from './mixins/map';
import { mintLocationsMixin } from './mixins/MintLocationsMixin';
import settingsMixin from '../map/mixins/settings';
import timeline from './mixins/timeline';

// Components
import Checkbox from '../forms/Checkbox.vue';
import LabeledInputContainer from '../LabeledInputContainer.vue';
import MapSettingsBox from '../MapSettingsBox.vue';
import MintList from '../MintList.vue';
import MultiSelectList from '../MultiSelectList.vue';
import RulerList from '../RulerList.vue';
import ScrollView from '../layout/ScrollView.vue';
import Sidebar from './Sidebar.vue';
import Slider from '../forms/Slider.vue';
import Timeline from './control/Timeline.vue';

// Icons
import SettingsIcon from 'vue-material-design-icons/Cog.vue';

// Other
import PoliticalOverlay from '../../maps/PoliticalOverlay';
import Settings from '../../settings.js';
import URLParams from '../../utils/URLParams.js';

let settings = new Settings(window, 'PoliticalOverlay');
const overlaySettings = settings.load();

let selectedRulers;

try {
  const json = localStorage.getItem('map-rulers');
  selectedRulers = JSON.parse(json);
} catch (e) {
  console.warn(
    'Could not load selected rulers. This is normal on first start of the app.'
  );
} finally {
  if (!selectedRulers) selectedRulers = [];
}

export default {
  name: 'PoliticalMap',
  components: {
    Checkbox,
    LabeledInputContainer,
    MapSettingsBox,
    MintList,
    MultiSelectList,
    RulerList,
    ScrollView,
    SettingsIcon,
    Sidebar,
    Slider,
    Timeline,
  },
  data: function () {
    return {
      availableRulers: [],
      data: null,
      mints: [],
      mintTimelineData: [],
      overlay: null,
      patterns: {},
      persons: {},
      rulerListStyles: [],
      rulers: [],
      selectedRulers,
      selectedUnavailableRulers: [],
      unlocatedTypes: [],
      timelineChart: null,
      types: [],
    };
  },
  mixins: [
    map,
    timeline,
    settingsMixin(overlaySettings),
    mintLocationsMixin({
      onMintSelectionChanged: async function () {
        await this.drawTimeline();
      },
    }),
  ],
  computed: {
    shareLink() {
      const params = {};
      if (this.map) {
        params.zoom = this.map.getZoom();
        const latlng = this.map.getCenter();
        params.location = JSON.stringify([latlng.lat, latlng.lng]);
      }

      params.year = this.timeline.value;
      params.selectedRulers = JSON.stringify(this.selectedRulers);
      params.selectedMints = JSON.stringify(this.selectedMints);

      return URLParams.apply(params).href;
    },
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

      let sorted = [
        ...this.availableMints.map((mint) => addAvailability(mint, true)),
        ...this.unavailableMints.map((mint) => addAvailability(mint, false)),
      ];

      sorted = sorted
        .filter((mint) => mint?.province?.id)
        .sort(Sorter.stringPropAlphabetically('name'));
      return sorted;
    },
    filteredUnlocatedTypes() {
      return this.unlocatedTypes.filter((type) => {
        const mintId = type?.mint?.id ? type.mint.id : 0;

        if (
          this.selectedMints.length > 0 &&
          this.selectedMints.indexOf(mintId) === -1
        ) {
          return false;
        } else {
          return true;
        }
      });
    },
    unlocatedTypesByMint() {
      const mintMap = {};

      this.filteredUnlocatedTypes.forEach((type) => {
        const mintId = type?.mint?.id ? type.mint.id : 0;

        if (!mintMap[mintId]) {
          mintMap[mintId] = {
            mint: mintId === 0 ? { id: 0, name: 'Ohne Münzstätte' } : type.mint,
            types: [],
          };
        }

        mintMap[mintId].types.push(type);
      });

      for (let obj of Object.values(mintMap)) {
        obj.types.sort(Sorter.stringPropAlphabetically('projectId'));
      }
      return Object.values(mintMap).sort(
        Sorter.stringPropAlphabetically('mint.name')
      );
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
        this.unlocatedTypes = transformedData.unlocatedTypes;

        this.updateAvailableRulers();
      },
    });
  },
  mounted: async function () {
    if (this.$route.query['selectedRulers']) {
      try {
        let parsed = JSON.parse(this.$route.query['selectedRulers']);
        if (Array.isArray(parsed)) {
          this.selectedRulers = parsed;
        }
      } catch (e) {
        console.warn(e);
      }
    }

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

    this.timelineChart = new TimelineChart(
      this.$refs.timelineCanvas,
      this.raw_timeline
    );
    await this.initTimeline(433);
    this.update();
    await this.drawTimeline();

    window.addEventListener('resize', this.updateCanvas);
  },
  unmounted: function () {
    if (this.mintLocations) this.mintLocations.clearLayers();

    window.removeEventListener('resize', this.updateCanvas);
  },
  methods: {
    async drawTimeline() {
      this.timelineChart.clear();
      if (this.selectedMints.length > 0 && this.selectedRulers.length > 0) {
        await this.drawRulersOntoTimeline(true);
        await this.drawMintCountOntoTimeline();
      } else if (this.selectedMints.length > 0)
        await this.drawMintCountOntoTimeline();
      else if (this.selectedRulers.length > 0)
        await this.drawRulersOntoTimeline();
    },
    async drawRulersOntoTimeline(drawAsLines = false) {
      const result = await Query.raw(
        `{
 ruledMintCount(rulers: [${this.selectedRulers.join(
   ','
 )}], mints: [${this.selectedMints.join(',')}]){
   ruler {id name color}
    data {x, y}
}
}`
      );
      const rulerPointArrays = result.data.data.ruledMintCount;
      this.timelineChart.updateTimeline(this.raw_timeline);

      if (drawAsLines) {
        let yPos = 25;
        const height = 5;
        const padding = Math.ceil(height / 2);

        rulerPointArrays.forEach((rulerObj) => {
          const rulerRanges = Range.fromSequence(rulerObj.data, (obj) => obj.x);
          this.timelineChart.drawRangeLineOnCanvas(rulerRanges, yPos, {
            lineCap: 'butt',
            lineWidth: height,
            strokeStyle: rulerObj.ruler.color,
          });
          yPos += height + padding;
        });
      } else {
        let max = 0;
        Object.values(rulerPointArrays).forEach(({ ruler, data }) => {
          const c_max = data.reduce((prev, cur) => {
            const value = cur.y;
            return value > prev ? value : prev;
          }, -Infinity);

          if (c_max > max) max = c_max;
        });

        rulerPointArrays.forEach(({ ruler, data }) => {
          this.timelineChart.drawGraphOnTimeline(
            data,
            {
              strokeStyle: ruler.color + 'aa',
              lineWidth: 2,
              fillStyle: 'transparent',
            },
            {
              max,
            }
          );
        });
      }
    },
    updateCanvas() {
      this.timelineChart.updateSize();
      this.drawTimeline();
    },
    timelineChanged(value) {
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
    clearMintSelection() {
      this.mintSelectionChanged([]);
    },
    clearRulerSelection(preventUpdate = false) {
      this.rulerSelectionChanged([], preventUpdate);
    },
    getRulerColor(ruler) {
      // return '#333333';
      return ruler.color || '#ff00ff';
    },
    updateAvailableMints() {},
    rulerSelectionChanged(selected, preventUpdate = false) {
      this.selectedRulers = selected;

      URLParams.update({
        selectedRulers: selected,
      });

      try {
        localStorage.setItem('map-rulers', JSON.stringify(this.selectedRulers));
      } catch (e) {
        console.warn(e);
      }
      this.updateAvailableRulers();

      if (!preventUpdate) {
        this.repaint();
        this.drawTimeline();
      }
    },
    async drawMintCountOntoTimeline() {
      await Query.raw(
        `{
 typeCountOfMints(ids: [${this.selectedMints.join(',')}]){
   mint {id name}
    data {x, y}
}
}`
      )
        .then((val) => {
          this.timelineChart.updateTimeline(this.raw_timeline);

          this.mintTimelineData = val.data.data.typeCountOfMints;
          const sequence = Sequence.fromArrayObject(
            this.mintTimelineData,
            (obj) => {
              return obj.data;
            }
          );

          const mintRanges = Range.fromSequence(sequence, (obj) => obj.x);
          const height = 20;
          this.timelineChart.drawRangeLineOnCanvas(mintRanges, height / 2, {
            lineCap: 'butt',
            lineWidth: height,
            strokeStyle: '#ccc',
          });
        })
        .catch(console.error);
    },
  },
};
</script>

<style lang="scss" scoped>
.unlocated-mints {
  position: absolute;
  left: $padding * 2;
  bottom: $padding * 4;
  background-color: $white;
  width: 260px;
  border-radius: $border-radius;

  h3 {
    font-size: 1em;
  }
}

h4 {
  margin: 0;
  font-size: $regular-font;
  color: $gray;
  padding-bottom: $padding;
}

.unlocated-mint-wrapper {
  padding: $big-padding;
  font-size: $small-font;
}
</style>


