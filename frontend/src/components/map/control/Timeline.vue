<template>
  <div class="timeline" ref="element">
   
    <div class="toolbox">
<button @click.stop.prevent="down">Left</button>
<input read-only :value="value" style="text-align:center;" />
<button @click.stop.prevent="up">Right</button>
</div>
    <br>
    <input
      type="range"
      :min="from"
      :max="to"
      :value="value"
      @input.stop.prevent="input"
      @change.stop="change"
      @pointerdown="disableMap"
      @pointerup="enableMap"
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
    down(event){
      event.preventDefault()
      event.stopPropagation()
      console.log(parseFloat(this.value - 1))
      this.$emit("change", parseFloat(this.value - 1))
    },
    up(event){
      event.preventDefault()
      event.stopPropagation()
      console.log(parseFloat(this.value + 1))

      this.$emit("change", parseFloat(this.value + 1))
    }
  },
  mounted: function () {
    this.$nextTick(() => {
      
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
.toolbox {
  display: flex;
  >* {
    flex:1;
  }
}

.timeline {
  position:absolute;
  left:0;
  right: 0;
  bottom: 0;
  background-color: white;
  margin: 0 auto;
  padding: 20px;
  width: 50%;
}
  input {
    width: 100%;
  }
</style>