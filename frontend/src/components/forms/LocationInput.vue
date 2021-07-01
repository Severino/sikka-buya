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
        <label for="lat">Lat</label>
        <input id="lat" type="text" :value="lat" readonly />
      </div>
      <div class="input-wrapper">
        <label for="lng">Lng</label>
        <input form="lng" type="text" :value="lng" readonly />
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
          <li>STRG + Linksklick: Position setzen</li>
          <li v-if="isCircle">STRG + Mausrad: Radius verändern</li>
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
  },
  watch: {
    radius: function () {
      this.updateMarker();
    },
  },
  data: function () {
    return {
      focused: false,
      location: null,
      marker: null,
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
  },
  methods: {
    radiusChanged(event) {
      this.$emit("radiusChanged", event.target.value);
    },
    focus(e) {
      this.focused = true;
    },
    unfocus(e) {
      this.focused = false;
    },
    keydown(e) {
      if (
        this.focused &&
        e.ctrlKey &&
        e.key.toLowerCase() == "z" &&
        this.markerHistory.length > 1
      ) {
        this.markerHistory.shift();
        this.location = this.markerHistory[0];
        this.updateMarker();
      }
    },
    clearData: function () {
      this.location = null;
      this.updateMarker();
    },
    enableMap() {
      this.map = this.$refs.map.map;

      this.map.on("click", (e) => {
        if (e.originalEvent.ctrlKey == true) {
          this.location = e.latlng;
          this.markerHistory.unshift(this.location);

          let i = document.createElement("input")
          i.value = `${this.location.lat.toFixed(2)}, ${this.location.lng.toFixed(2)}` 
          document.body.appendChild(i)
          i.select()
          document.execCommand("copy")
          document.body.removeChild(i)

          while (this.markerHistory.length > this.historyLimit)
            this.markerHistory.pop();

          this.updateMarker();
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
      }
    },
    updateMarker() {
      this.removeMarker();
      if (this.location) {
        if (this.isCircle) {
          this.marker = L.circle(this.location, this.radius).addTo(this.map);
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

          this.marker = L.marker(this.location, {
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
    lat: function () {
      if (this.location == null || this.location.lat == null) {
        return "-";
      } else {
        return this.location.lat;
      }
    },
    lng: function () {
      if (this.location == null || this.location.lng == null) {
        return "-";
      } else {
        return this.location.lng;
      }
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
      padding-left: 75px;
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
  @include input;
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
}
</style>