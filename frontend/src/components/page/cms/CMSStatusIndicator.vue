<template>
  <div class="cms-status-indicator">
    <loading-spinner
      v-if="pending"
      :size="IconSize.Large"
      class="spinner"
    />
    <ExclamationIcon
      v-else-if="dirty"
      class="dirty-icon"
      :size="IconSize.Large"
    />
    <CheckIcon
      v-else
      class="check-icon"
      :size="IconSize.Large"
    />
  </div>
</template>

<script>
import LoadingSpinner from '../../misc/LoadingSpinner.vue';
import CheckIcon from 'vue-material-design-icons/CheckCircle.vue';
import ExclamationIcon from 'vue-material-design-icons/AlertCircle.vue';
export default {
  components: { CheckIcon, LoadingSpinner, ExclamationIcon },
  props: {
    pending: Boolean,
    dirty: Boolean,
  },
};
</script>

<style lang="scss" scoped>

.cms-status-indicator{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
}

.check-icon {
  color: $green;
  // filter: drop-shadow(0 0 3px rgba(125, 255, 125));

}

.dirty-icon {
  color: $orange;
  // filter: drop-shadow(0 0 3px rgb(255, 125, 125));

}

.spinner {
  color: $yellow;
  padding: 0;
}
</style>