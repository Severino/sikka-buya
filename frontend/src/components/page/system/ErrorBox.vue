<template>
  <div class="global error" :class="{ hidden: !message }">
    <AlertCircle class="error-icon" />
    <span class="text">
      {{ message }}
    </span>
    <div
      class="button transparent-button interactive"
      @click.stop.prevent="() => (message = '')"
    >
      <Close />
    </div>
  </div>
</template>

<script>
import Close from "vue-material-design-icons/Close.vue";
import AlertCircle from "vue-material-design-icons/AlertCircle.vue";

export default {
  name: "ErrorBox",
  components: {
    AlertCircle,
    Close,
  },
  props: {
    message: String,
  },
};
</script>

<style lang="scss" scoped>
.error-icon {
  color: darken($red, 15%);
}
.error {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: $regular-font;
  min-width: 400px;
}

.button {
  margin-left: auto;
  color: $white;
}
</style>
