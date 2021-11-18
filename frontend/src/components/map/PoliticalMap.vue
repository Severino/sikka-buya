<template>
  <div>
    <div v-if="filtersActive" class="notification">
      <FilterIcon /> Filter aktiv
      <Button @click="resetFilters">Zurücksetzen</Button>
    </div>

    <timeline
      ref="timeline"
      :map="map"
      :from="timeline.from"
      :to="timeline.to"
      :value="timeline.value"
      @input="timelineChanged"
      @change="timelineChanged"
    />

    <Sidebar title="Herrscher" side="right">
      <multi-select-list
        id="mints"
        :items="availableRulers"
        :selectedItems="[]"
        attribute="shortName"
        @selectionChanged="rulerSelectionChanged"
      />
    </Sidebar>

    <Sidebar title="Prägeorte">
      <multi-select-list
        id="mints"
        :items="availableMints"
        :selectedItems="[]"
        @selectionChanged="mintSelectionChanged"
      />
    </Sidebar>
  </div>
</template>

<script>
import Sidebar from './Sidebar.vue';
import Color from '../../models/map/color.js';
import Timeline from './control/Timeline.vue';
import Checkbox from '../forms/Checkbox.vue';
import FilterIcon from 'vue-material-design-icons/Filter.vue';

import map from './mixins/map';
import timeline from './mixins/timeline';

import Query from '../../database/query';

import MintLocation from '../../models/mintlocation';
import SikkaColor from '../../utils/Color';
import MultiSelectList from '../MultiSelectList.vue';

import Person from '../../utils/Person';

export default {
  name: 'PoliticalMap',
  components: { Sidebar, Timeline, Checkbox, FilterIcon, MultiSelectList },
  data: function () {
    return {
      mints: [],
      rulers: [],
      selectedRulers: [],
      selectedMints: [],
      rulerColorMap: {},
      availableMints: [],
      unavailableMints: [],
      availableRulers: [],
    };
  },
  mixins: [map, timeline],
  computed: {
    filtersActive: function () {
      return this.selectedRulers.length > 0 || this.selectedMints.length > 0;
    },
  },
  mounted: async function () {
    const starTime =
      parseInt(localStorage.getItem('political-timeline')) || 433;
    await this.initTimeline(starTime);
    this.updateTimeline();
  },
  methods: {
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
  getTypes(yearOfMint:${this.timeline.value}, excludeFromMapApp: false){
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
    }
    overlords {
      id
      name
      shortName
      rank
    }
    excludeFromTypeCatalogue
  }
}`
          )
            .then((result) => {
              let data = result.data.data.getTypes;
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
      const _ = new MintLocation(this);
      _.removeExistingLocation();
      let features = _.mapToGeoJsonFeature(this.mints);
      this.mintLocations = _.createGeometryLayer(features);

      this.mintLocations.addTo(this.featureGroup);
    },
    updateAvailableRulers() {
      this.availableRulers = Object.values(this.rulers);
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
            let types = [];

            const allTypesGroup = that.L.featureGroup();

            const coinCount = feature.coins.length;
            for (let coinNum = 0; coinNum < coinCount; coinNum++) {
              let circles = [];
              const coin = feature.coins[coinNum];

              types.push(coin.projectId);
              let rulers = that.extractRulers(coin);

              let minRadius = 5000;
              let maxRadius = 75000;
              let angle = 360 / coinCount;

              let radius = maxRadius;
              function createPopup(coin, clickedRuler) {
                function buildRulerList(personsArr, orderedList = false) {
                  function printName(person) {
                    let name = person.shortName || person.name;
                    if (person.id == clickedRuler.id)
                      name = `<span class="active">${name}</span>`;
                    return name;
                  }

                  if (!personsArr || personsArr.length == 0) return '-';
                  else if (Array.isArray(personsArr) && personsArr.length > 1) {
                    let str = orderedList ? '<ol>' : '<ul>';
                    personsArr.forEach((person) => {
                      str += `<li>${printName(person)}</li>`;
                    });

                    return str + (orderedList ? '</ol>' : '</ul>');
                  } else {
                    if (Array.isArray(personsArr)) personsArr = personsArr[0];
                    return printName(personsArr);
                  }
                }

                let caliphText = buildRulerList(coin.caliph);

                let overlordsText;
                if (coin.overlords) {
                  let sorted = coin.overlords.sort((a, b) => a.rank > b.rank);
                  overlordsText = buildRulerList(sorted, true);
                } else {
                  overlordsText = '-';
                }
                let issuersText = buildRulerList(coin.issuers);
                return `
                    <header>
                      <span class="subtitle">${coin.mint.name}</span>
                    </header>
                    <h2>${coin.projectId}</h2>
                    ${
                      !coin.excludeFromTypeCatalogue
                        ? `<a href="/catalog/${coin.id}" target="_blank" class="catalog-link">Katalogeintrag</a>`
                        : ''
                    }
                    
                    <h3>Münzherren</h3>
                    ${issuersText}
                    <h3>Oberherren</h3>
                    ${overlordsText}
                     <h3>Kalif</h3>
                    ${caliphText}
                  `;
              }

              if (rulers.length > 0) {
                for (let [rulerNum, ruler] of rulers.entries()) {
                  const rulerCount = rulers.length;

                  const increment = (maxRadius - minRadius) / (rulerCount + 1);
                  radius = maxRadius - increment * (rulerCount - rulerNum - 1);

                  function getOptions(ruler) {
                    let active = that.selectedRulers.length > 0;
                    let selected =
                      active && that.selectedRulers.indexOf(ruler.id) != -1;

                    let fillColor =
                      active && !selected ? '#ccc' : that.getRulerColor(ruler);

                    return {
                      radius,
                      weight: 0.75,
                      stroke: true,
                      color: '#fff',
                      fillColor,
                      fillOpacity: 1,
                    };
                  }

                  let circle;

                  if (Array.isArray(ruler) && ruler.length == 1)
                    ruler = ruler[0];

                  if (Array.isArray(ruler)) {
                    const subAngle = angle / ruler.length;
                    circle = that.L.layerGroup();

                    for (let [subRulerNum, subRuler] of ruler.entries()) {
                      const subOptions = getOptions(subRuler);
                      const subPopup = createPopup(coin, subRuler);
                      let semiCircle = that.L.semiCircle(
                        latlng,
                        subOptions
                      ).setDirection(
                        (angle * coinNum + subAngle * subRulerNum) % 360,
                        subAngle
                      );
                      semiCircle.bindPopup(subPopup);
                      semiCircle.addTo(circle);
                    }
                  } else {
                    const options = getOptions(ruler);
                    const popup = createPopup(coin, ruler);
                    if (coinCount == 1) {
                      circle = that.L.circle(latlng, options);
                    } else {
                      circle = that.L.semiCircle(latlng, options).setDirection(
                        (angle * coinNum) % 360,
                        angle
                      );
                    }
                    circle.bindPopup(popup);
                  }

                  if (circle) circles.push(circle);
                  radius += increment;
                }

                circles.reverse();
              } else {
                let circle = that.L.semiCircle(latlng, {
                  radius: maxRadius,
                  weight: 0.75,
                  stroke: true,
                  color: '#fff',
                  fillColor: '#fff',
                  fillOpacity: 1,
                }).setDirection((angle * coinNum) % 360, angle);
                const popup = createPopup(coin);
                circle.bindPopup(popup);
                circles.push(circle);
              }

              const typeGroup = that.L.layerGroup(circles);
              typeGroup.interactive = true;

              allTypesGroup.addLayer(typeGroup);
            }

            return allTypesGroup;
          },

          coordsToLatLng: function (coords) {
            return new that.L.LatLng(coords[0], coords[1], coords[2]);
          },
          style: {
            stroke: false,
            fillColor: '#629bf0',
            fillOpacity: 1,
          },
        }
      );

      this.concentricCircles.addTo(this.featureGroup);
    },
    getRulerColor(ruler) {
      return SikkaColor.fromHash(Person.getName(ruler));
    },
    getContrastColor(ruler) {
      const contrastColor = SikkaColor.getContrastColor(
        this.getRulerColor(ruler),
        '#ffffff',
        '#000000'
      );

      return contrastColor;
    },
    extractRulers(coin) {
      let rulers = [];

      if (coin.issuers && coin.issuers.length > 0) rulers.push(coin.issuers);
      if (coin.overlords && coin.overlords.length > 0)
        rulers = [...rulers, ...coin.overlords];
      if (coin.caliph) rulers.push(coin.caliph);
      return rulers;
    },
    updateAvailableMints() {
      let avalMints = {};
      let mints = this.mints;

      if (this.types) {
        for (let type of this.types) {
          if (type.mint && avalMints[type.mint.id] == null) {
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
      this.selectedMints = selected.map((mint) => mint.id);
      this.update();
    },
    rulerSelectionChanged(selected) {
      this.selectedRulers = selected.map((person) => person.id);
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

<style lang="scss" scoped></style>
