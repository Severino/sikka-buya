<template>
  <div>
    <div v-if="filtersActive" class="notification">
      <FilterIcon /> Filter aktiv
      <Button @click="resetFilters">Zurücksetzen</Button>
    </div>

    <timeline
      ref="timeline"
      :map="this.map"
      :from="timeline.from"
      :to="timeline.to"
      :value="timeline.value"
      @input="timeChanged"
      @change="timeChanged"
    />

    <Sidebar title="Herrscher" side="right">
      <ul>
        <li
          v-for="ruler of rulers"
          :key="`ruler-list-item-${ruler.id}`"
          :style="`background-color: ${
            activeRuler
              ? ruler.id == activeRuler.id
                ? rulerColorMap[ruler.id]
                : 'unset'
              : rulerColorMap[ruler.id] || 'transparent'
          };`"
          @click="setActiveRuler(ruler)"
        >
          {{ ruler.shortName || ruler.name }}
        </li>
      </ul>
    </Sidebar>

    <Sidebar title="Prägeorte">
      <div id="mints">
        <ul>
          <li
            v-for="mint of availableMints"
            :key="`mint-avail-list-item-${mint.id}`"
            @click="mintSelected(mint)"
            :class="{ selected: mint.selected }"
          >
            <input
              v-if="selectedMints.length > 0"
              type="checkbox"
              :checked="mint.selected"
              @input.stop="mintAdded($event, mint)"
              @click.stop
            />
            {{ mint.name }}
          </li>
        </ul>

        <ul>
          <li
            v-for="mint of unavailableMints"
            :key="`mint-unavail-list-item-${mint.id}`"
            @click="mintSelected(mint)"
            class="inactive"
            :class="{ selected: mint.selected }"
          >
            <input
              v-if="selectedMints.length > 0"
              type="checkbox"
              :checked="mint.selected"
              @input.stop="mintAdded($event, mint)"
              @click.stop
            />

            {{ mint.name }}
          </li>
        </ul>
      </div>
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

export default {
  name: 'PoliticalMap',
  components: { Sidebar, Timeline, Checkbox, FilterIcon },
  data: function () {
    return {
      mints: [],
      rulers: [],
      activeRuler: null,
      selectedMints: [],
      rulerColorMap: {},
      availableMints: null,
      unavailableMints: null,
    };
  },
  mixins: [map, timeline],
  computed: {
    filtersActive: function () {
      return this.activeRuler != null || this.selectedMints.length > 0;
    },
  },
  mounted: async function () {
    await this.initTimeline();
    this.updateTimeline();
  },
  methods: {
    fetchTypes: async function () {
      return new Promise((resolve, reject) => {
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
                  console.error('Could not parse GeoJSON.', type.mint.location);
                }
              }
            });

            data = data.filter(
              (d) => (d.mint?.location && d.mint.location.coordinates) != null
            );

            resolve(data);
          })
          .catch(reject);
      });
    },
    updateTimeline: async function () {
      this.types = await this.fetchTypes();
      this.update();
    },
    resetFilters: function () {
      this.selectedMints.forEach((mint) => (mint.selected = false));
      this.selectedMints.splice(0);
      this.activeRuler = null;
      this.update();
    },
    mintSelected(mint) {
      this.setActiveMint(mint);
      this.update();
    },
    setActiveMint(mint) {
      let addMint =
        this.selectedMints.length == 1 && this.selectedMints[0].id == mint.id
          ? false
          : true;

      this.removeAllActiveMint();

      if (addMint) {
        mint.selected = true;
        this.selectedMints.push(mint);
      }
    },
    removeAllActiveMint() {
      this.selectedMints.splice(0).forEach((mint) => (mint.selected = false));
    },
    update() {
      this.updateConcentricCircles();
      this.updateAvailableMints();
      this.updateMintLocationMarker();
    },
    updateMintLocationMarker() {
      const _ = new MintLocation(this);
      _.removeExistingLocation();
      let features = _.mapToGeoJsonFeature(this.mints);
      this.mintLocations = _.createGeometryLayer(features);

      this.mintLocations.addTo(this.featureGroup);
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

      if (this.selectedMints.length > 0)
        data = data.filter((type) => {
          return this.selectedMints.find((mint) => mint.id == type.mint.id);
        });

      this.rulerColorMap = {};
      let i = 0;

      this.rulers = rulers;
      Object.values(rulers).forEach((ruler) => {
        this.rulerColorMap[ruler.id] = Color.byIndex(i);
        i++;
      });

      if (this.concentricCircles) this.concentricCircles.remove();

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

            const allTypesGroup = that.L.layerGroup();

            const coinCount = feature.coins.length;
            for (let coinNum = 0; coinNum < coinCount; coinNum++) {
              let circles = [];
              let groups = [];
              const coin = feature.coins[coinNum];

              types.push(coin.projectId);
              let rulers = that.extractRulers(coin);

              let minRadius = 5000;
              let maxRadius = 75000;

              let radius = maxRadius;

              if (rulers.length > 0) {
                for (let [rulerNum, ruler] of rulers.entries()) {
                  const rulerCount = rulers.length;

                  const increment = (maxRadius - minRadius) / (rulerCount + 1);
                  radius = maxRadius - increment * (rulerCount - rulerNum - 1);

                  function getOptions(ruler) {
                    let active = that.activeRuler;
                    let selected = active && ruler.id === that.activeRuler.id;

                    let fillColor =
                      active && !selected
                        ? '#ccc'
                        : that.rulerColorMap[ruler.id];

                    return {
                      radius,
                      weight: 0.75,
                      stroke: true,
                      color: '#fff',
                      fillColor,
                      fillOpacity: 1,
                    };
                  }

                  function createRulerPopup(ruler) {
                    function buildRulerList(personsArr, orderedList = false) {
                      function printName(person) {
                        let name = person.shortName || person.name;
                        if (person.id == ruler.id)
                          name = `<span class="active">${name}</span>`;
                        return name;
                      }

                      if (!personsArr || personsArr.length == 0) return '-';
                      else if (
                        Array.isArray(personsArr) &&
                        personsArr.length > 1
                      ) {
                        let str = orderedList ? '<ol>' : '<ul>';
                        personsArr.forEach((person) => {
                          str += `<li>${printName(person)}</li>`;
                        });

                        return str + (orderedList ? '</ol>' : '</ul>');
                      } else {
                        if (Array.isArray(personsArr))
                          personsArr = personsArr[0];
                        return printName(personsArr);
                      }
                    }

                    let caliphText = buildRulerList(coin.caliph);
                    let sorted = coin.overlords.sort((a, b) => a.rank > b.rank);
                    let overlordsText = buildRulerList(sorted, true);
                    let issuersText = buildRulerList(coin.issuers);

                    return `
                    <header>
                      <span class="subtitle">${coin.mint.name}</span>
                    </header>
                    <h2>${coin.projectId}</h2>
                    <a href="/catalog/${coin.id}" target="_blank" class="catalog-link">Katalogeintrag</a>
                    <h3>Münzherren</h3>
                    ${issuersText}
                    <h3>Oberherren</h3>
                    ${overlordsText}
                     <h3>Kalif</h3>
                    ${caliphText}
                  `;
                  }

                  let circle;
                  let angle = 360 / coinCount;

                  if (Array.isArray(ruler) && ruler.length == 1)
                    ruler = ruler[0];

                  if (Array.isArray(ruler)) {
                    const subAngle = angle / ruler.length;
                    circle = that.L.layerGroup();

                    for (let [subRulerNum, subRuler] of ruler.entries()) {
                      const subOptions = getOptions(subRuler);
                      const subPopup = createRulerPopup(subRuler);
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

                    if (coin.projectId == 'MS365Ga') console.log(circle);
                  } else {
                    const options = getOptions(ruler);
                    const popup = createRulerPopup(ruler);
                    if (coinCount == 1) {
                      circle = that.L.circle(latlng, options);
                    } else {
                      console.log(angle * coinNum) % 360;
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
                console.error('Ruler of length 0 is not allowed.');
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
    extractRulers(coin) {
      const rulers = [coin.issuers, ...coin.overlords];
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
            if (!this.activeRuler) {
              avalMints[mintId] = type.mint;
            } else {
              if (this.mintHasRuler(type, this.activeRuler)) {
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

    mintAdded(event, mint) {
      mint.selected = event.target.checked;
      if (mint.selected) this.addActiveMint(mint);
      else this.removeActiveMint(mint);

      this.update();
    },
    addActiveMint(mint) {
      this.selectedMints.push(mint);
      mint.selected = true;
    },
    removeActiveMint(mint) {
      const selectedMintPosition = this.selectedMints.findIndex(
        (selectedMint) => selectedMint.id == mint.id
      );
      if (selectedMintPosition != -1) {
        mint.selected = false;
        this.selectedMints.splice(selectedMintPosition, 1);
        return true;
      }
      return false;
    },
    setActiveRuler(ruler) {
      if (this.activeRuler && this.activeRuler.id == ruler.id) {
        this.activeRuler = null;
      } else this.activeRuler = ruler;
      this.update();
    },
    mintHasRuler(type, ruler) {
      function hasRuler(property, type, ruler) {
        if (!type.mint) return false;

        if (Array.isArray(type[property])) {
          for (let i = 0; i < type[property]?.length; i++) {
            console.log(type.mint.name, ruler.name);
            if (type[property][i].id == ruler.id) return true;
          }
        } else {
          if (type[property].id == ruler.id) return true;
        }
        return false;
      }

      return (
        hasRuler('issuers', type, ruler) ||
        hasRuler('overlords', type, ruler) ||
        hasRuler('caliph', type, ruler)
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
