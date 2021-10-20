<template>
  <div class="map-page">
    <timeline
      ref="timeline"
      :map="this.map"
      :from="timeline.from"
      :to="timeline.to"
      :value="timeline.value"
      @input="timeChanged"
      @change="timeChanged"
    />

    <div v-if="filtersActive" class="notification">
      <FilterIcon /> Filter aktiv
      <Button @click="resetFilters">Zurücksetzen</Button>
    </div>

    <div class="side-bar side-bar-right">
      <div id="rulers">
        <ul>
          <h3>Herrscher</h3>
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
      </div>
    </div>

    <div class="side-bar side-bar-left">
      <div id="mints">
        <h3>Prägeorte</h3>
        <!-- <pre>{{ this.selectedMints.map((mint) => mint.name) }}</pre> -->
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
    </div>

    <map-view class="mapview" ref="map" @mapReady="mapChanged"> </map-view>
  </div>
</template>

<script>
require('leaflet-semicircle');
var L = require('leaflet');
var turf = require('@turf/turf');
import Query from '../../database/query';
import Checkbox from '../forms/Checkbox.vue';
import Timeline from '../map/control/Timeline.vue';
import MapView from '../map/MapView.vue';
import MintLocation from '../../models/mintlocation';
import FilterIcon from 'vue-material-design-icons/Filter.vue';

export default {
  name: 'MapPage',
  components: { MapView, Timeline, Checkbox, FilterIcon },
  data: function () {
    return {
      timeline: { from: null, to: null, value: null },
      mints: [],
      rulers: [],
      map: null,
      rulerColorMap: {},
      activeRuler: null,
      selectedMints: [],
      availableMints: null,
      unavailableMints: null,
      types: [],
    };
  },
  provide() {
    return {
      map: this.map || null,
    };
  },
  computed: {
    filtersActive: function () {
      return this.activeRuler != null || this.selectedMints.length > 0;
    },
  },
  methods: {
    resetFilters: function () {
      this.selectedMints.forEach((mint) => (mint.selected = false));
      this.selectedMints.splice(0);
      this.activeRuler = null;
      this.update();
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
    mapChanged: function (map) {
      this.map = map;
      Query.raw(
        `{
        timespan {
          from
          to
        }
}`
      )
        .then(async (result) => {
          let timeline = result.data.data.timespan;
          timeline.value = 364;
          this.timeline = timeline;
          this.$refs.timeline.init();
          this.types = await this.fetchTypes();
          this.update();
          window.map = this.map;
          this.map.doubleClickZoom.disable();
        })
        .catch(console.error);
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
    setActiveMint(mint) {
      this.removeAllActiveMint();
      mint.selected = true;
      this.selectedMints.push(mint);
    },
    removeAllActiveMint() {
      this.selectedMints.splice(0).forEach((mint) => (mint.selected = false));
    },
    mintSelected(mint) {
      this.removeAllActiveMint();
      this.setActiveMint(mint);
      this.update();
    },
    setActiveRuler(ruler) {
      console.log(ruler);
      if (this.activeRuler && this.activeRuler.id == ruler.id) {
        this.activeRuler = null;
      } else this.activeRuler = ruler;
      this.update();
    },
    getColor(i) {
      const colors = [
        '#7CCC7B',
        '#FFB581',
        '#89B0AE',
        '#A1DAA0',
        '#FEDFCA',
        '#f1e8b8',
        '#BEE3DB',
      ];
      if (i > colors.length) console.error('Ran out of colors!', i);
      return colors[i % colors.length];
    },
    update() {
      // this.updateDominion();
      this.updateConcentricCircles();
      this.updateAvailableMints();
      this.updateMintLocationMarker();
    },
    linkClicked() {
      console.log('CLOCKED');
    },
    updateMintLocationMarker() {
      const _ = new MintLocation(this);
      _.removeExistingLocation();
      let features = _.mapToGeoJsonFeature(this.mints);
      this.mintLocations = _.createGeometryLayer(features);
      this.mintLocations.addTo(this.map);
    },
    timeChanged: async function (val) {
      this.timeline.value = val;
      this.types = await this.fetchTypes();

      this.selectedMints = [];
      this.update();
    },
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
  getTypes(yearOfMint:${this.timeline.value}){
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
    extractRulers(coin) {
      const rulers = [...coin.issuers, ...coin.overlords];
      if (coin.caliph) rulers.push(coin.caliph);
      return rulers;
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
        data = data.filter((d) => d.mint.selected);

      this.rulerColorMap = {};
      let i = 0;

      this.rulers = rulers;
      Object.values(rulers).forEach((ruler) => {
        this.rulerColorMap[ruler.id] = this.getColor(i);
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

      L.geoJSON(Object.values(this.mints));

      this.concentricCircles = L.geoJSON(
        Object.values(mintsFeatures),

        {
          pointToLayer: function (feature, latlng) {
            let types = [];

            const allTypesGroup = L.layerGroup();

            const coinCount = feature.coins.length;
            for (let coinNum = 0; coinNum < coinCount; coinNum++) {
              let circles = [];
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

                  let fillColor = that.activeRuler
                    ? ruler.id !== that.activeRuler.id
                      ? '#ccc'
                      : that.rulerColorMap[ruler.id]
                    : that.rulerColorMap[ruler.id];

                  let circle;
                  const options = {
                    radius,
                    weight: 0.75,
                    stroke: true,
                    color: '#fff',
                    fillColor,
                    fillOpacity: 1,
                  };

                  if (coinCount == 1) {
                    circle = L.circle(latlng, options);
                  } else {
                    let angle = 360 / coinCount;

                    circle = L.semiCircle(latlng, options).setDirection(
                      (angle * coinNum) % 360,
                      angle
                    );
                  }

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
                      if (Array.isArray(personsArr)) personsArr = personsArr[0];
                      return printName(personsArr);
                    }
                  }

                  let caliphText = buildRulerList(coin.caliph);

                  let sorted = coin.overlords.sort((a, b) => a.rank > b.rank);

                  let overlordsText = buildRulerList(sorted, true);
                  let issuersText = buildRulerList(coin.issuers);

                  const rulerPopuptText = `
                    <span class="subtitle">${coin.mint.name}</span>
                    <h2>${coin.projectId}</h2>
                    <a href="/catalog/${coin.id}" target="_blank" class="catalog-link">Katalogeintrag</a>
                    <h3>Münzherren</h3>
                    ${issuersText}
                    <h3>Oberherren</h3>
                    ${overlordsText}
                     <h3>Kalif</h3>
                    ${caliphText}
                  `;

                  circle.bindPopup(`${rulerPopuptText}`);

                  if (circle) circles.push(circle);
                  radius += increment;
                }

                circles.reverse();
              } else {
                console.error('Ruler of length 0 is not allowed.');
              }

              const typeGroup = L.layerGroup(circles);
              typeGroup.interactive = true;

              allTypesGroup.addLayer(typeGroup);
            }

            return allTypesGroup;
          },
          coordsToLatLng: function (coords) {
            return new L.LatLng(coords[0], coords[1], coords[2]);
          },
          style: {
            stroke: false,
            fillColor: '#629bf0',
            fillOpacity: 1,
          },
        }
      );

      this.concentricCircles.addTo(this.map);
    },
    updateDominion: function () {
      Query.raw(
        `
      {
  ruledMint(year: ${this.timeline.value}) {
    mint {
      name
      location
    }
    overlords {
      name
      rank
      honorifics {
        name
      }
    }
  }


      getDominion(year: ${this.timeline.value}) {
    overlord {
      name
      shortName
    }
    mints {
      name
      location
    }
  }}`
      )
        .then((result) => {
          if (this.mintGeoJSONLayer) this.mintGeoJSONLayer.remove();
          this.mintGeoJSONLayer = L.geoJSON([], {
            coordsToLatLng: function (coords) {
              return new L.LatLng(coords[0], coords[1], coords[2]);
            },
            style: {
              stroke: true,
              opacity: 0.75,
              color: 'red',
              fillColor: '#48ac48',
              fillOpacity: 0.1,
            },
          }).addTo(this.map);

          result.data.data.ruledMint.forEach((mint) => {
            if (mint.location) {
              try {
                mint.location = JSON.parse(mint.location);
                this.mintGeoJSONLayer.addData(mint.location);
              } catch (e) {
                console.error('Could not parse GeoJSON from mint.', mint);
              }
            }
          });

          let dominionData = result.data.data.getDominion;
          dominionData.filter(
            (data) =>
              data?.mints?.location?.coordinates &&
              Array.isArray(data.mints.location.coordinates) &&
              data.mints.location.coordinates.length > 0
          );
          dominionData.forEach((dominion, idx) => {
            const mintsCount = dominion.mints.length;
            let points = [];
            dominion.mints.forEach((mint) => {
              let distance = 0.2 / (idx + 1);
              let resolution = 10;
              let vertices = resolution * 4;
              for (
                let angle = 0;
                angle < 2 * Math.PI;
                angle += (2 * Math.PI) / vertices
              ) {
                let lat =
                  Math.cos(angle) * distance + mint.location.coordinates[0];
                let lng =
                  Math.sin(angle) * distance + mint.location.coordinates[1];
                points.push(turf.point([lat, lng]));
              }
            });

            let area = turf.convex(turf.featureCollection(points));
            area.dominion = dominion;
            dominionData[idx] = area;
          });
          if (this.dominionLayer) this.dominionLayer.remove();

          this.dominionLayer = L.geoJSON(dominionData, {
            coordsToLatLng: function (coords) {
              return new L.LatLng(coords[0], coords[1], coords[2]);
            },
            style: {
              stroke: true,
              opacity: 0.75,
              color: '#48ac48',
              fillColor: '#48ac48',
              fillOpacity: 0.5,
            },
          }).addTo(this.map);
          this.dominionLayer.bindTooltip(
            (layer) => {
              return layer.feature.dominion.overlord.shortName;
            },
            {
              sticky: true,
              direction: 'top',
            }
          );
        })
        .catch(console.error);
    },
  },
};
</script>

<style lang="scss">
.leaflet-popup {
  font-family: $font;

  .leaflet-popup-content-wrapper {
    border-radius: 3px;
  }

  .leaflet-popup-content {
    margin: 20px;
  }

  a.leaflet-popup-close-button {
    font-size: 1.5em !important;
    margin: 10px;
  }

  h2,
  h3,
  h4 {
    margin: 0.5em 0;
  }

  h2:first-child {
    margin-bottom: 0;
  }

  ul,
  ol {
    margin: 0.5em 0;
    padding-left: 1em;
  }

  .active {
    border-radius: 3px;
    padding: 2px 5px;
    font-weight: bold;
    background-color: $primary-color;
    color: $white;
  }

  .catalog-link {
    position: absolute;
    right: 20px;
    top: 52px;
    color: $primary-color;
    padding: 3px 5px;
    font-weight: bold;
    border: 1px solid $primary-color;
    border-radius: 5px;
  }
}

.map-page {
  position: relative;
  flex: 1;
}

.mapview {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.map-label {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
  font-weight: bold;
  font-size: 22px;
  margin-bottom: 10px;

  &::before {
    border-top-color: transparent !important;
  }
}

.side-bar {
  position: absolute;
  box-sizing: border-box;
  z-index: 1000;
  background-color: rgba($color: $white, $alpha: 0.8);
  padding: 20px;
  top: 0px;
  height: 100%;
  overflow-y: auto;

  min-width: 200px;
  width: 20vw;
  max-width: 400px;

  h3 {
    margin-top: 0;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  li {
    margin-bottom: 10px;
    padding: 5px 10px;
    border-radius: 10px;
    cursor: pointer;
    box-sizing: border-box;
    border: 1px solid transparent;

    &.inactive {
      opacity: 0.5;
    }

    &:hover {
      border: 1px solid $gray;
    }
  }
}

#mints {
  li {
    margin-bottom: 0;
  }
}

.selected {
  color: $primary-color;
}

.side-bar-right {
  right: 0;
}

.notification {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  color: $white;
  background-color: $primary-color;
  margin-top: 10px;
  padding: 5px 10px;
  border-radius: $border-radius;
  display: flex;
  align-items: center;

  button {
    margin-left: 10px;
    padding: 3px 10px;
    border-radius: $border-radius;
    background-color: $primary-color;
    color: $white;
    border-color: $white;
  }
}
</style>
