<template>
  <div class="catalog-property">
    <header>
      <div v-if="label" class="property-label">
        {{ label }}
      </div>

      <div v-if="info" class="popup-container">
        <InfoIcon />
        <popup>
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
import InfoIcon from "vue-material-design-icons/InformationOutline.vue";
import Popup from "../Popup.vue";

export default {
  name: "CatalogProperty",
  components: {
    InfoIcon,
    Popup,
  },
  props: {
    label: String,
    value: String,
    html: String,
    info: String,
  },
};
</script>

<style lang="scss" scoped>
header {
  display: flex;
  justify-content: space-between;

  .material-design-icon {
    $size: $small-font;
    width: $size;
    height: $size;
    color: $primary-color;
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
