<template>
  <div
    class="popup-activator"
  >
    <div class="target" @click.stop.prevent="() => (active = !active)">
      <slot />
    </div>
    <popup
      :active="active"
      :targetWidth="targetWidth"
      :noShadow="noShadow"
      @close="closePopup()"
    >
      <slot name="popup" />
    </popup>
  </div>
</template>

<script>
import Popup from './Popup.vue';
export default {
  components: {
    Popup,
  },
  props: {
    targetWidth: Number,
    noShadow: Boolean,
  },
  data() {
    return {
      active: false,
    };
  },
  methods: {
    closePopup() {
      this.active = false;
    },
  },
};
</script>

<style lang='scss' scoped>
.popup-activator {
  position: relative;
}

.popup-anchor {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}
</style>