<template>
  <div class="timeline" :class="{ hide: !this.timelineActive }" ref="element">
    <div class="tool-box-drawer">
      <header>
        <div class="left">
          <div class="button icon-button" @click="() => (slideshow.active = !slideshow.active)">
            <PlusIcon v-if="!slideshow.active" />
            <MinusIcon v-else />
          </div>

          <div class="button icon-button" @click="togglePlay">
            <PlayIcon v-if="!playing" />
            <PauseIcon v-else />
          </div>

          <popup-activator :targetWidth="280" :noShadow="true">
            <ShareIcon class="button icon-button"/>
            <template v-slot:popup>
              <h3><Locale path="map.share_view" /></h3>

              <copy-field :value="shareLink" />
            </template>
          </popup-activator>

          <slot name="left" />
        </div>

        <div class="center-ui">
          <slot name="center" />
        </div>

        <div class="right">
          <slot name="right" />
          <div v-if="allowToggle" class="timeline-button-container">
            <div class="timeline-toggle-button button button rounded" @click="toggleTimeline" v-if="timelineActive">
              <Locale path="map.timeline.deactivate" />
            </div>
            <div class="timeline-toggle-button button button rounded" @click="toggleTimeline" v-else>
              <Locale path="map.timeline.active" />
            </div>
          </div>
        </div>
      </header>

      <slideshow v-if="slideshow.active" :storagePrefix="timelineName" ref="slideshow" />
    </div>

    <!-- <button class="play-btn" @click="play">
      <PlayIcon v-if="!playing" />
      <PauseIcon v-else />
    </button> -->

    <div class="timeline-container">
      <button type="button" @click.stop.prevent="down" @focus="focusTimeline">
        <MenuLeft />
      </button>

      <timeline-slider :min="from" :max="to" :value="clampedValue" @change.stop="change" @input.stop="change"
        :labeledValue="10" :subdivisions="2" ref="timelineSlider">
        <div class="input-wrapper">
          <input class="yearInput" type="text" :value="value" style="text-align: center" @input="input"
            @blur="insertClampedValue" />
          <Info :alwaysShow="!valid" type="warning" class="info">
            Der eingegebene Wert befindet sich außerhalb der Zeitleiste
          </Info>
        </div>

        <template #background>
          <slot name="background" />
        </template>
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
import ShareIcon from 'vue-material-design-icons/ShareVariant.vue';

import TimerOff from 'vue-material-design-icons/TimerOff.vue';
import Timer from 'vue-material-design-icons/Timer';

import TimelineSlider from '../../forms/TimelineSlider.vue';
import Button from '../../layout/buttons/Button.vue';
import PopupActivator from '../../Popup/PopupActivator.vue';
import CopyField from '../../forms/CopyField.vue';
import Slideshow from './Slides/Slideshow.vue';
import Settings from '../../../settings';
import { clamp } from '../../../utils/Math';
import Locale from '../../cms/Locale.vue';

let slideshowSettings = new Settings(window, 'Slideshow');
const slideshow = slideshowSettings.load();

export default {
  components: {
    Button,
    Info,
    MenuLeft,
    MenuRight,
    MinusIcon,
    PauseIcon,
    PlayIcon,
    PlusIcon,
    PopupActivator,
    ShareIcon,
    TimelineSlider,
    Timer,
    TimerOff,
    CopyField,
    Slideshow,
    Locale,
},
  props: {
    map: Object,
    from: Number,
    to: Number,
    value: Number,

    /**
     * The 'toggle' state of the timeline.
     * Hidden when false
     */
    timelineActive: {
      default: true,
      type: Boolean,
    },
    /**
     * Used as a prefix to save the timeline independently from other timelines.
     */
    timelineName: String,
    /**
     * Don't display the toggle if toggling should be prohibited.
     */
    allowToggle: {
      default: true,
      type: Boolean,
    },
    /**
     * The link that can be shared to reproduce the current view of the application.
     */
    shareLink: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      playInterval: null,
      slideshow,
    };
  },
  watch: {
    slideshow: {
      handler() {
        slideshowSettings.save();
      },
      deep: true,
    },
  },
  computed: {
    valid() {
      return this.value >= this.from && this.value <= this.to;
    },
    clampedValue() {
      return clamp(this.value, this.from, this.to);
    },
    playing() {
      return this.playInterval != null;
    },
  },
  methods: {
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
      }, 1500);
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
    insertClampedValue() {
      this.$emit('input', this.clampedValue);
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

    toggleTimeline() {
      this.$emit('toggle', this.timelineActive);
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
  transition: $transition-time transform;
  transform: translateY(0);

  &.hide {
    transform: translateY(calc(100% + #{$padding} + 11px));

    .tool-box-drawer {
      top: -17px;
    }
  }

  .slider {
    border: 0;
  }
}
</style>


<style lang="scss" scoped>
.timeline-container {
  display: flex;

  >.slider {
    flex: 1;
    border-radius: 0;
  }
}

.timeline-button-container {
  position: relative;
  align-self: stretch;
  height: 100%;
}

.timeline-toggle-button {
  font-weight: bold;
}

.timeline {
  position: relative;
  display: flex;
  flex-direction: column;

  >* {
    flex: 1;
  }
}

.timeline-container {
  button {
    border-radius: 0;
  }

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

  .yearInput {
    display: block;
    padding: 5px;
    min-width: 75px;
    width: 10%;
    max-width: 100%;
    margin: auto;
    pointer-events: all;
    border: none;
    border-radius: $border-radius;
    font-weight: bold;
    background-color: rgba($color: #ffffff, $alpha: 0.5);
    margin-top: 3px;
    // border-bottom: 1px solid currentColor;

    transition: all 0.2s;


    &:active{
      background-color: white !important;
    }

    &:hover{
      background-color: white !important;
    }

    &:focus {
      background-color: rgba($color: #ffffff, $alpha: 0.8);
      outline: 1px solid $primary-color;
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
  border-radius: math.div($size, 2);
}

.tool-box-drawer {
  position: absolute;
  top: -5px;
  transform: translateY(-100%);
  width: 100%;

  transition: top $transition-time;

  header {
    display: grid;
    color: $white;
    grid-template-columns: 1fr 1fr 1fr;
    justify-content: space-between;
    position: absolute;
    width: 100%;
    top: -5px;
    transform: translateY(-100%);

    filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.5));

    >* {
      display: flex;
      align-items: flex-end;
    }

    &:last-child {
      margin-left: auto;
    }

    .right {
      justify-self: flex-end;
    }

    .center-ui {
      justify-content: center;
    }
  }
}

</style>
