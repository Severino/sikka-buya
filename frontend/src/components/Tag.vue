<template>
  <div class="tag">
    <div class="icon">
      <slot name="icon"></slot>
    </div>
    <div class="text">
      {{ text }}
    </div>
    <info-popup v-if="popup" class="popup" :content="popup" />
  </div>
</template>

<script>
import InfoPopup from "./InfoPopup.vue";
export default {
  components: { InfoPopup },
  name: "Tag",
  props: {
    text: String,
    popup: String,
  },
};
</script>

<style lang="scss" scoped>
.tag {
  color: $white;
  background-color: $primary-color;
  border-radius: 3px;
  font-weight: bold;
  padding: $padding/2 $padding;

  align-items: center;

  display: flex;


    > *:not(:last-child):not(:empty){
        margin-right: $padding;
    }
}

.tag .material-design-icon {
  color: $white;
  width: 20px;
  height: 20px;
  margin-right: $padding;
}

.popup {
    color: black;
    font-weight: normal;
}

</style>