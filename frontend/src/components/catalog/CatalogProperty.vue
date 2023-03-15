<template>
  <div class="catalog-property">
    <header v-if="label">
      <div v-if="label" class="simple-property-label property-label">
        {{ label }}
      </div>
      <div v-else-if="localeLabel" class="locale-property-label property-label">
        <Locale v-if="label" :path="label" :count="localeCount || 1" />
      </div>


      <div v-if="info" class="popup-container" ref="popupButton" @click.stop.prevent="togglePopup()">
        <popup-activator>
          <InfoIcon />
          <template v-slot:popup>{{ info }}</template>
        </popup-activator>
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
import Locale from '../cms/Locale.vue';
import Popup from '../Popup/Popup.vue';
import PopupActivator from '../Popup/PopupActivator.vue';

export default {
  name: 'CatalogProperty',
  components: {
    InfoIcon,
    Popup,
    PopupActivator,
    Locale
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
    localeLabel: String,
    localeCount: Number,
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

.simple-property-label {
  background-color: red;
}

header {
  display: flex;
  align-items: center;

  .popup-activator {
    margin-left: $padding;
  }

  .material-design-icon {
    $size: $regular-font;
    width: $size;
    height: $size;
    color: $primary-color;
    user-select: none;
  }
}

.catalog-property {
  font-size: $large-font;
  background-color: $white;
  border-radius: 3px;
  padding: 2 * $padding;
}

.property-label {
  margin-bottom: 2 * $padding;
  font-size: $small-font;
  font-weight: bold;
  color: $primary-color;
  text-transform: uppercase;
}

.popup-container {
  position: relative;
}
</style>
