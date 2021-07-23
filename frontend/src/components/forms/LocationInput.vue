<template>
  <div
    class="location-input"
    @keydown="keydown($event)"
    @focus.capture="focus()"
    @blur.capture="unfocus()"
    :class="{ focused }"
    ref="root"
  >
    <div class="toolbar">
      <div class="input-wrapper">
        <label for="input">{{ type.toUpperCase() }}</label>
        <input id="input" type="text" :value="coordinateString" readonly />
      </div>
      <div class="input-wrapper" v-if="isCircle">
        <label for="radius">Radius</label>
        <input
          form="radius"
          type="number"
          :value="radius"
          @input="radiusChanged($event)"
        />
      </div>

      <button @click.prevent.stop="clearData()">
        <Close />
      </button>
    </div>
    <div class="map">
      <map-view ref="map" height="500px" tabindex="0" />
      <div class="legend">
        <ul>
          <li><b>STRG + Linksklick:</b> Punkt setzen</li>
          <li><b>STRG + Z:</b> Vorherige Punkt wiederherstellen</li>
          <li v-if="isCircle"><b>STRG + Mausrad:</b> Radius verändern</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Close from "vue-material-design-icons/Close.vue";
import MapView from "../MapView.vue";
var L = require("leaflet");

export default {
  name: "LocationInput",
  components: {
    MapView,
    Close,
  },
  props: {
    type: String,
    radius: Number,
    circleZoomFactor: {
      type: Number,
      default: 100,
    },
    coordinates: {
      type: Array,
      required: true,
    },
  },
  watch: {
    radius: function () {
      this.updateMarker();
    },
    coordinates: function () {
      this.updateMarker();
    },
  },
  data: function () {
    return {
      activeMarkerIndex: null,
      focused: false,
      location: null,
      marker: null,
      handles: [],
      lineHandles: [],
      markerHistory: [],
      historyLimit: 20,
    };
  },
  /**
   * Mounted hooks are fired in dir child -> parent.
   * Therefore we may access the mounted map here.
   */
  mounted: function () {
    this.enableMap();
    this.updateMarker();
  },
  methods: {
    setActiveMarker: function (i) {
      let old = this.activeMarkerIndex;

      if (old != null) {
        this.handles[old].setStyle({
          fillColor: "#3388ff",
        });
      }

      this.activeMarkerIndex = i;

      console.log(this.handles[this.activeMarkerIndex], this.activeMarkerIndex);
      this.handles[this.activeMarkerIndex].setStyle({
        fillColor: "#ff0000",
      });

      this.updateMarker();
    },
    radiusChanged(event) {
      this.$emit("radiusChanged", event.target.value);
    },
    focus() {
      this.focused = true;
    },
    unfocus() {
      this.focused = false;
      this.activeMarkerIndex = null;
      this.updateMarker();
    },
    keydown(e) {
      if (this.focused) {
        if (e.ctrlKey && e.key.toLowerCase() == "z") {
          let prevPosition;
          if (this.markerHistory.length > 1) {
            prevPosition = this.markerHistory.shift();
          }

          let coordinates = this.coordinates;
          if (this.isPolygon) {
            if (coordinates.length > 0) coordinates.pop();
          } else if (prevPosition) {
            coordinates[0] = prevPosition;
          }
          this.emitUpdate(coordinates);
        }

        if (
          (e.key.toLowerCase() == "backspace" ||
            e.key.toLowerCase() == "delete") &&
          this.activeMarkerIndex != null
        ) {
          const coordinates = this.coordinates;
          coordinates.splice(this.activeMarkerIndex, 1);
          this.activeMarkerIndex = null;
          this.emitUpdate(coordinates);
        }
      }
    },
    clearData: function () {
      this.emitUpdate([]);
    },
    enableMap() {
      this.map = this.$refs.map.map;
      this.map.doubleClickZoom.disable();

      this.map.on("click", (e) => {
        if (e.originalEvent.ctrlKey == true) {
          const location = e.latlng;
          this.markerHistory.unshift(location);

          let coordinates = this.coordinates;

          if (this.isPolygon) {
            coordinates.push([location.lat, location.lng]);
          } else {
            coordinates = [location.lat, location.lng];
          }

          while (this.markerHistory.length > this.historyLimit)
            this.markerHistory.pop();

          this.emitUpdate(coordinates);
        }
      });

      this.$refs.root.addEventListener(
        "wheel",
        (e) => {
          if (this.isCircle && e.ctrlKey == true) {
            e.preventDefault();
            e.stopPropagation();

            this.$emit(
              "radiusChanged",
              this.radius + -e.deltaY * this.circleZoomFactor
            );
          }
        },
        true
      );
    },
    removeMarker() {
      if (this.marker) {
        this.marker.remove();
        this.marker = null;

        this.handles.forEach((element) => {
          element.remove();
        });
        this.handles = [];

        this.lineHandles.forEach((el) => el.remove());
        this.lineHandles = [];
      }
    },
    drawLineHandles() {
      if (this.coordinates.length > 1) {
        this.coordinates.forEach((point, idx) => {
          let nextPoint = this.coordinates[(idx + 1) % this.coordinates.length];

          let lineHandle = L.polyline([point, nextPoint], {
            color: "#ff0000",
            weight: 15,
            opacity: 0,
          }).addTo(this.map);

          lineHandle.on("mousedown", (evt) => {
            const point = [evt.latlng.lat, evt.latlng.lng];

            const coordinates = this.coordinates;
            coordinates.splice(idx + 1, 0, point);

            this.updateMarker();
            this.setActiveMarker(idx + 1);
            this.handles[this.activeMarkerIndex].fire("mousedown", evt);

            this.emitUpdate(coordinates);
          });

          this.lineHandles.push(lineHandle);
        });
      }
    },

    emitUpdate(coordinates) {
      this.$emit("update", {
        type: this.type,
        coordinates,
      });
    },
    updateMarker() {
      this.removeMarker();
      if (this.coordinates.length > 0) {
        if (this.isCircle) {
          this.marker = L.circle(this.coordinates[0], this.radius).addTo(
            this.map
          );
        } else if (this.isPolygon) {
          //

          this.marker = L.polygon(this.coordinates).addTo(this.map);

          this.drawLineHandles();

          this.handles = this.coordinates.map((point, i) => {
            let marker = L.circleMarker(point, {
              radius: 10,
              fillOpacity: 1,
              fillColor: this.activeMarkerIndex == i ? "#ffffff" : "#3388ff",
              draggable: true,
            }).addTo(this.map);

            let trackCursor = (evt) => {
              if (this.activeMarkerIndex != null) {
                let a = this.activeMarkerIndex;
                let b =
                  this.activeMarkerIndex - 1 < 0
                    ? this.lineHandles.length - 1
                    : a - 1;

                const marker = this.handles[this.activeMarkerIndex];
                const location = evt.latlng;
                marker.setLatLng(location);
                this.coordinates[a] = [location.lat, location.lng];

                for (let [handle, point] of [
                  [a, 0],
                  [b, 1],
                ]) {
                  let polyPoints = this.lineHandles[handle].getLatLngs();
                  polyPoints[point] = location;
                  this.lineHandles[handle].setLatLngs(polyPoints);
                }

                this.updateMarker();
              }
            };

            marker.on("mousedown", (e) => {
              this.map.dragging.disable();
              this.setActiveMarker(i);
              this.map.on("mousemove", trackCursor);
              e.originalEvent.preventDefault();
            });

            this.map.on("mouseup", () => {
              this.map.dragging.enable();
              this.map.off("mousemove", trackCursor);
              if (this.activeMarkerIndex !== null)
                this.coordinates.splice(0, 0);
            });

            return marker;
          });
        } else {
          const defaultMarker =
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=";

          const defaultMarkerShadow =
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAApCAQAAAACach9AAACMUlEQVR4Ae3ShY7jQBAE0Aoz/f9/HTMzhg1zrdKUrJbdx+Kd2nD8VNudfsL/Th///dyQN2TH6f3y/BGpC379rV+S+qqetBOxImNQXL8JCAr2V4iMQXHGNJxeCfZXhSRBcQMfvkOWUdtfzlLgAENmZDcmo2TVmt8OSM2eXxBp3DjHSMFutqS7SbmemzBiR+xpKCNUIRkdkkYxhAkyGoBvyQFEJEefwSmmvBfJuJ6aKqKWnAkvGZOaZXTUgFqYULWNSHUckZuR1HIIimUExutRxwzOLROIG4vKmCKQt364mIlhSyzAf1m9lHZHJZrlAOMMztRRiKimp/rpdJDc9Awry5xTZCte7FHtuS8wJgeYGrex28xNTd086Dik7vUMscQOa8y4DoGtCCSkAKlNwpgNtphjrC6MIHUkR6YWxxs6Sc5xqn222mmCRFzIt8lEdKx+ikCtg91qS2WpwVfBelJCiQJwvzixfI9cxZQWgiSJelKnwBElKYtDOb2MFbhmUigbReQBV0Cg4+qMXSxXSyGUn4UbF8l+7qdSGnTC0XLCmahIgUHLhLOhpVCtw4CzYXvLQWQbJNmxoCsOKAxSgBJno75avolkRw8iIAFcsdc02e9iyCd8tHwmeSSoKTowIgvscSGZUOA7PuCN5b2BX9mQM7S0wYhMNU74zgsPBj3HU7wguAfnxxjFQGBE6pwN+GjME9zHY7zGp8wVxMShYX9NXvEWD3HbwJf4giO4CFIQxXScH1/TM+04kkBiAAAAAElFTkSuQmCC";

          var defaultIcon = new L.Icon({
            iconUrl: defaultMarker,
            iconAnchor: [12, 41],
            shadowUrl: defaultMarkerShadow,
          });

          this.marker = L.marker(this.coordinates, {
            icon: defaultIcon,
          }).addTo(this.map);
        }
      }
    },
  },
  computed: {
    isCircle: function () {
      return this.type == "circle";
    },
    isPolygon: function () {
      return this.type == "polygon";
    },
    lat: function () {
      if (this.coordinates.length == 0) {
        return "-";
      } else {
        return this.coordinates[0];
      }
    },
    lng: function () {
      if (this.coordinates.length == 0) {
        return "-";
      } else {
        return this.coordinates[1];
      }
    },
    coordinateString: function () {
      switch (this.type) {
        case "polygon":
          return this.polygonString;
        case "point":
          return this.pointString;
        default:
          console.error(`Undefined type in coordinateString ${this.type}!`);
          return "undefined";
      }
    },
    polygonString: function () {
      return this.coordinates.reduce((acc, value) => {
        console.log(value);
        return `${acc} [${value[0].toFixed(2)}, ${value[1].toFixed(2)}]`;
      }, "");
    },
    pointString: function () {
      if (this.coordinates.length < 2) return "";
      else
        return `[${this.coordinates[0].toFixed(
          2
        )}, ${this.coordinates[1].toFixed(2)}]`;
    },
  },
};
</script>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  background-color: red;

  > button {
    border-top-width: 0;
    border-right-width: 0;
  }

  > div {
    position: relative;
    flex: 1;
    display: flex;
    > input {
      flex: 1;
      padding-left: 100px;
    }

    > *,
    > :first-child {
      border-top-width: 0;
      border-right-width: 0;
    }

    > label {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;

      display: flex;
      align-items: center;
      padding: $padding;
      opacity: 0.5;
    }
  }
}

.location-input {
  border: 1px solid rgb(204, 204, 204);
  padding: 0;
  box-sizing: border-box;
}

.focused {
  border: 1px solid $primary-color;
}

.map {
  position: relative;
}

.legend {
  position: absolute;
  bottom: 0;
  z-index: 1000;

  background-color: white;
  opacity: 0.8;

  ul {
    list-style-type: none;
    margin: $padding;
    padding: 0;
    li {
      margin: 0;
    }
  }
}
</style>
