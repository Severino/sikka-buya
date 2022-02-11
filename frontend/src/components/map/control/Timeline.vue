<template>
  <div class="timeline" ref="element">
    <h3>Zeitleiste</h3>
    <button class="play-btn" @click="play">
      <PlayIcon v-if="!playing" />
      <PauseIcon v-else />
    </button>
    <div class="input-wrapper">
      <input
        type="number"
        :value="value"
        style="text-align: center"
        @input="input"
      />
      <Info :alwaysShow="!valid" type="warning" class="info">
        Der eingegebene Wert befindet sich außerhalb der Zeitleiste
      </Info>
    </div>
    <br />

    <div class="toolbox">
      <button type="button" @click.stop.prevent="down">
        <MenuLeft />
      </button>
      <!-- <input
        type="range"
        :min="from"
        :max="to"
        :value="value"
        @change.stop="change"
        @pointerdown="disableMap"
        @pointerup="enableMap"
      /> -->

      <timeline-slider
        :min="from"
        :max="to"
        :value="value"
        @change.stop="change"
        @input.stop="change"
        :labeledValue="10"
        :subdivisions="2"
      />
      <button type="button" @click.stop.prevent="up">
        <MenuRight />
      </button>
    </div>
  </div>
</template>

<script>
var L = require('leaflet');

import MenuLeft from 'vue-material-design-icons/MenuLeft.vue';
import MenuRight from 'vue-material-design-icons/MenuRight.vue';
import Info from '../../forms/Info.vue';

import PlayIcon from 'vue-material-design-icons/Play.vue';
import PauseIcon from 'vue-material-design-icons/Pause.vue';
import TimelineSlider from '../../forms/TimelineSlider.vue';

export default {
  components: {
    MenuLeft,
    MenuRight,
    Info,
    PlayIcon,
    PauseIcon,
    TimelineSlider,
  },
  props: {
    map: Object,
    from: Number,
    to: Number,
    value: Number,
    valid: Boolean,
  },
  data() {
    return {
      playInterval: null,
    };
  },
  computed: {
    playing() {
      return this.playInterval != null;
    },
  },
  methods: {
    play() {
      if (this.playing) this.stop();
      else this.start();
    },
    start() {
      this.playInterval = setInterval(() => {
        if (this.value + 1 <= this.to) {
          this.up();
        } else this.stop();
      }, 750);
    },
    stop() {
      clearInterval(this.playInterval);
      this.playInterval = null;
    },
    input(event) {
      console.log(event);
      this.$emit('input', parseFloat(event.currentTarget.value));
    },
    change(event) {
      this.$emit('change', parseFloat(event.currentTarget.value));
    },
    enableMap() {
      this.map.dragging.enable();
    },
    disableMap() {
      this.map.dragging.disable();
    },
    down() {
      this.$emit('change', parseFloat(this.value - 1));
    },
    up() {
      this.$emit('change', parseFloat(this.value + 1));
    },
    init() {
      L.Control.Timeline = L.Control.extend({
        options: {
          position: 'middlecenter',
        },
        onAdd: () => {
          return this.$refs.element;
        },
      });
      let timeline = new L.Control.Timeline();
      timeline.addTo(this.map);
    },
  },
};
</script>

<style lang="scss" scoped>
.toolbox {
  display: flex;
  > .slider {
    flex: 1;
  }
}

// .timeline {
//   position: absolute;
//   z-index: 1;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background-color: white;
//   margin: 0 auto;
//   padding: 20px;
//   width: 50%;
// }

button {
  border: none;
}

input {
  width: 100%;
}

.label {
  color: $light-gray;
}

.input-wrapper {
  position: relative;

  .info {
    width: 100%;
    position: absolute;
    left: 0;
    top: -$padding/2;
    transform: translateY(-100%);
  }
}

.play-btn {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  border: $border;

  $size: 75px;
  width: $size;
  height: $size;
  border-radius: $size/2;
}
</style>
