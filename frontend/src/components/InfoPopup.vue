<template>
  <div class="info-popup popup-container">
    <InfoIcon @click.stop="togglePopup()" />
    <popup :active="popupActive">
      {{ content }}
    </popup>
  </div>
</template>

<script>
import InfoIcon from "vue-material-design-icons/InformationOutline.vue"
import Popup from "./Popup.vue";

export default {
  name: "InfoPopup",
  components: {
    Popup,
    InfoIcon
  },
  props: {
    content: String,
  },
  data: function(){
      return {
          popupActive: false
      }
  },
  methods: {
    togglePopup (){
        this.popupActive = !this.popupActive
    }  
  }
};
</script>

<style scoped>
.info-popup {
    position: relative;
}
</style>