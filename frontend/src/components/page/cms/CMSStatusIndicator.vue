<template>
  <div class="cms-status-indicator" :class="{ saving: saving }">
    <loading-spinner
      :size="LoadingSpinnerSize.Small"
      class="spinner"
      :class="{ show: saving }"
    />
    {{ savingText }}
    <loading-spinner :size="LoadingSpinnerSize.Small" class="spinner" />
  </div>
</template>

<script>
import LoadingSpinner from '../../misc/LoadingSpinner.vue';
export default {
  components: { LoadingSpinner },
  props: {
    saving: Boolean,
  },
  computed: {
    savingText() {
      return this.saving ? 'Speichern' : 'Gespeichert';
    },
  },
};
</script>

<style lang="scss" scoped>
.spinner {
  opacity: 0;

  &.show {
    opacity: 1;
  }
}

.cms-status-indicator {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;

  width: 150px;
  gap: $padding;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  padding: $padding;

  border-top-right-radius: $border-radius;
  border-top-left-radius: $border-radius;
}
</style>