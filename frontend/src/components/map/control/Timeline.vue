<template>
  <div class="timeline" ref="element">
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
      <button @click.stop.prevent="down">
        <MenuLeft />
      </button>
      <input
        type="range"
        :min="from"
        :max="to"
        :value="value"
        @change.stop="change"
        @pointerdown="disableMap"
        @pointerup="enableMap"
      />
      <button @click.stop.prevent="up">
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

export default {
  components: { MenuLeft, MenuRight, Info },
  props: {
    map: Object,
    from: Number,
    to: Number,
    value: Number,
    valid: Boolean,
  },
  methods: {
    input(event) {
      this.$emit('input', parseFloat(event.target.value));
    },
    change(event) {
      this.$emit('change', parseFloat(event.target.value));
    },
    enableMap() {
      this.map.dragging.enable();
    },
    disableMap() {
      this.map.dragging.disable();
    },
    down(event) {
      event.preventDefault();
      event.stopPropagation();
      this.$emit('change', parseFloat(this.value - 1));
    },
    up(event) {
      event.preventDefault();
      event.stopPropagation();
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
  > input[type='slider'] {
    flex: 1;
  }
}

.error {
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
</style>
