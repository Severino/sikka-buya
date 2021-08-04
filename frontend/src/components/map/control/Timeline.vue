<template>
  <div class="timeline" ref="element">
    <p>{{value}}</p>
    <input
      type="range"
      :min="from"
      :max="to"
      :value="value"
      @input.stop.prevent="input"
      @change.stop="change"
      @mousedown="disableMap"
      @mouseup="enableMap"
    />
  </div>
</template>

<script>
import Info from "../../forms/Info.vue";
var L = require("leaflet");

export default {
  components: { Info },
  inject: ["getMap"],
  props: {
    from: Number,
    to: Number,
    value: Number,
  },
  methods: {
    input(event) {
      this.$emit("input", parseFloat(event.target.value))
    },
    change(event){
      this.$emit("change", parseFloat(event.target.value))
    },
    enableMap() {
      this.getMap().dragging.enable();
    },
    disableMap() {
      this.getMap().dragging.disable();
    },
  },
  mounted: function () {
    this.$nextTick(() => {
      console.log("MOUNTED");
      L.Control.Timeline = L.Control.extend({
        options: {
          position: "middlecenter",
        },
        onAdd: () => {
          return this.$refs.element;
        },
      });
      let timeline = new L.Control.Timeline();
      console.log(timeline);
      timeline.addTo(this.getMap());
    });
  },
};
</script>

<style lang="scss" scoped>

.timeline {
  position:absolute;
  left:0;
  right: 0;
  bottom: 0;
  background-color: red;
  width: 100%;
}
  input {
    width: 100%;
  }
</style>