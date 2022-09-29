<template>
  <div class="catalog-property">
    <header v-if="label">
      <div v-if="label" class="property-label">
        {{ label }}
      </div>

      <div
        v-if="info"
        class="popup-container"
        ref="popupButton"
        @click.stop.prevent="togglePopup()"
      >
        <InfoIcon />
        <popup :active="popupOpened" @close="closePopup" @click.stop.prevent>
          {{ info }}
        </popup>
      </div>
    </header>

    <div v-if="html" class="property-value" v-html="html" />
    <div v-else class="property-value">
      <slot />
    </div>
  </div>
</template>

<script>
import InfoIcon from 'vue-material-design-icons/InformationOutline.vue';
import Popup from '../Popup/Popup.vue';

export default {
  name: 'CatalogProperty',
  components: {
    InfoIcon,
    Popup,
  },
  data() {
    return {
      popupOpened: false,
    };
  },
  props: {
    label: String,
    html: String,
    info: String,
  },
  methods: {
    togglePopup() {
      this.popupOpened = !this.popupOpened;
    },
    closePopup() {
      this.popupOpened = false;
    },
  },
};
</script>

<style lang="scss" scoped>
header {
  display: flex;
  align-items: center;

  .material-design-icon {
    margin-left: $padding;
    $size: $regular-font;
    width: $size;
    height: $size;
    color: $primary-color;
    user-select: none;
  }
}

.catalog-property {
  font-size: $large-font;
  line-height: $large-font * 1.65;
  background-color: $white;
  border-radius: 3px;
  padding: $padding 2 * $padding;
}

.property-label {
  font-size: $small-font;
  font-weight: bold;
  color: $primary-color;
  text-transform: uppercase;
}

.popup-container {
  position: relative;
}
</style>
