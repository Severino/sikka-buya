<template>
  <div class="timeline" ref="element">
    <div class="tool-box-drawer">
      <header>
        <div class="left-controls">
          <div class="button icon-button" @click="togglePlay">
            <PlayIcon v-if="!playing" />
            <PauseIcon v-else />
          </div>
        </div>

        <div class="center">
          <div class="button icon-button" @click="prevSlide">
            <PrevIcon class="button icon-button" />
          </div>
          <div class="button icon-button" @click="createSlide">
            <CameraOutlineIcon class="button icon-button" />
          </div>
          <div class="button icon-button" @click="nextSlide">
            <NextIcon class="button icon-button" />
          </div>
        </div>

        <div
          class="button icon-button"
          @click="() => (toolboxOpen = !toolboxOpen)"
        >
          <PlusIcon v-if="!toolboxOpen" />
          <MinusIcon v-else />
        </div>
      </header>

      <div class="toolbox" v-if="toolboxOpen">
        <new-slide @click.native="createSlide" />
        <slide
          v-for="(slide, idx) of slides"
          :key="`slide-${idx}`"
          :name="slide.name"
          :class="{ active: idx === currentSlide }"
          @click.native="setSlide(idx)"
        />
      </div>
    </div>

    <!-- <button class="play-btn" @click="play">
      <PlayIcon v-if="!playing" />
      <PauseIcon v-else />
    </button> -->

    <div class="timeline-container">
      <button type="button" @click.stop.prevent="down" @focus="focusTimeline">
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
        ref="timelineSlider"
      >
        <div class="input-wrapper">
          <input
            type="text"
            :value="value"
            style="text-align: center"
            @input="input"
          />
          <Info :alwaysShow="!valid" type="warning" class="info">
            Der eingegebene Wert befindet sich außerhalb der Zeitleiste
          </Info>
        </div>
      </timeline-slider>
      <button type="button" @click.stop.prevent="up" @focus="focusTimeline">
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

import PlayIcon from 'vue-material-design-icons/PlayCircleOutline.vue';
import PauseIcon from 'vue-material-design-icons/PauseCircleOutline.vue';

import PlusIcon from 'vue-material-design-icons/PlusCircleOutline.vue';
import MinusIcon from 'vue-material-design-icons/MinusCircleOutline.vue';

import CameraOutlineIcon from 'vue-material-design-icons/CameraOutline.vue';
import NextIcon from 'vue-material-design-icons/SkipNextCircleOutline.vue';
import PrevIcon from 'vue-material-design-icons/SkipPreviousCircleOutline.vue';

import TimelineSlider from '../../forms/TimelineSlider.vue';
import NewSlide from './Slides/NewSlide.vue';
import Slide from './Slides/Slide.vue';

export default {
  components: {
    MenuLeft,
    MenuRight,
    Info,
    PlayIcon,
    PauseIcon,
    PlusIcon,
    MinusIcon,
    TimelineSlider,
    NewSlide,
    Slide,
    CameraOutlineIcon,
    NextIcon,
    PrevIcon,
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
      toolboxOpen: false,
      slides: [],
      slideId: 0,
      selectedSlide: -1,
      currentSlide: 0,
    };
  },
  computed: {
    playing() {
      return this.playInterval != null;
    },
  },
  methods: {
    createSlide() {
      const slide = {
        name: (this.slideId++).toString(),
        options: {
          zoom: this.map.getZoom(),
          location: this.map.getCenter(),
          year: this.value,
        },
      };

      this.slides.push(slide);
    },
    setMapTo(options) {
      this.map.setView(options.location, options.zoom, { animation: true });
      this.changed(options.year);
    },
    togglePlay() {
      if (this.playing) this.stop();
      else this.start();
    },
    start() {
      this.playInterval = setInterval(() => {
        if (this.value + 1 <= this.to) {
          this.up(true);
        } else this.stop();
      }, 750);
    },
    stop() {
      clearInterval(this.playInterval);
      this.playInterval = null;
    },
    input(event) {
      this.stop();
      this.$emit('input', parseFloat(event.currentTarget.value));
    },
    change(event) {
      this.changed(parseFloat(event.currentTarget.value));
    },
    changed(val, isPlaying = false) {
      if (!isPlaying) this.stop();
      this.$emit('change', val);
    },
    enableMap() {
      this.map.dragging.enable();
    },
    disableMap() {
      this.map.dragging.disable();
    },
    down(isPlaying = false) {
      this.changed(parseFloat(this.value - 1), isPlaying);
    },
    up(isPlaying = false) {
      this.changed(parseFloat(this.value + 1), isPlaying);
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
    nextSlide() {
      const length = this.slides.length;
      if (length > 0) {
        if (this.currentSlide < 0 || this.currentSlide >= length - 1)
          this.currentSlide = 0;
        else {
          this.currentSlide += 1;
        }
      }
      this.updateSlide();
    },
    prevSlide() {
      const length = this.slides.length;
      if (length > 0) {
        if (this.currentSlide <= 0) this.currentSlide = length - 1;
        else {
          this.currentSlide -= 1;
        }
      }
      this.updateSlide();
    },
    updateSlide() {
      if (this.currentSlide >= 0 && this.currentSlide < this.slides.length) {
        this.setMapTo(this.slides[this.currentSlide].options);
      } else console.warn('Slide index is out of range.');
    },
    setSlide(index) {
      this.currentSlide = index;
      this.updateSlide();
    },
    focusTimeline() {
      const htmlSlider =
        this.$refs.timelineSlider.$el.querySelector('input[type=range]');
      htmlSlider.focus();
    },
  },
};
</script>

<style lang="scss">
.timeline {
  .slider {
    border: 0;
  }
  .slide.active {
    border-radius: 3px;
    outline: 1px solid $primary-color;
  }
}
</style>


<style lang="scss" scoped>
.timeline-container {
  display: flex;
  > .slider {
    flex: 1;
  }
}
.timeline {
  position: relative;
  display: flex;
  flex-direction: column;

  > * {
    flex: 1;
  }
}
.timeline-container {
  button:first-child {
    border-top-left-radius: $border-radius;
    border-bottom-left-radius: $border-radius;
  }

  button:last-child {
    border-top-right-radius: $border-radius;
    border-bottom-right-radius: $border-radius;
  }
}

.label {
  color: $light-gray;
}

.input-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
  pointer-events: none;

  .info {
    width: calc(100% - #{$small-padding * 2});
    margin: 0 $small-padding;
    position: absolute;
    left: 0;
    bottom: $small-padding;
    border-radius: 3px;
    padding: $small-padding;
  }
  input {
    display: block;
    padding: 5px;
    min-width: 100px;
    width: 10%;
    max-width: 100%;
    margin: auto;
    pointer-events: all;
    border: none;
    font-weight: bold;
    background-color: rgba($color: #ffffff, $alpha: 0.6);
    border-bottom: 1px solid currentColor;

    &:focus {
      background-color: rgba($color: #ffffff, $alpha: 0.8);
    }
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

.tool-box-drawer {
  position: absolute;
  top: -5px;
  transform: translateY(-100%);
  width: 100%;

  .toolbox {
    background-color: whitesmoke;
    padding: $padding;
    border-radius: $border-radius;
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;

    > *:not(:last-child) {
      margin-right: $padding;
    }
  }

  header {
    display: flex;
    justify-content: space-between;
    position: absolute;
    width: 100%;
    top: -5px;
    transform: translateY(-100%);

    filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.5));

    > * {
      display: flex;
    }

    &:last-child {
      margin-left: auto;
    }
  }
}

.icon-button {
  color: white;
  padding: 0px;
}
// .icon-button:hover,
// .icon-button:active {

.icon-button,
.icon-button:hover,
.icon-button:active {
  background: none;
  border: none;
}
</style>
