<template>
  <div class="info-popup popup-container">
    <InfoIcon @click.stop.prevent="togglePopup()" />
    <popup :active="popupActive" @close="closePopup()">
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
    } ,
    closePopup(){
      this.popupActive = false
    }
  }
};
</script>

<style scoped>
.info-popup {
    position: relative;
}
</style>