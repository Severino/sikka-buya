<template>
  <div class="settings">
    <SettingsIcon class="settings-icon" @click="toggleSettings" />
    <div class="settings-window" v-if="open">
      <header>
        <h3>Einstellungen</h3>
      </header>
      <slot />
      <Button class="small-button" @click="resetSettings">
        <ResetIcon class="reset-icon" :size="16" />
        Standard wiederherstellen
      </Button>
    </div>
  </div>
</template>

<script>
import SettingsIcon from 'vue-material-design-icons/Cog.vue';
import ResetIcon from 'vue-material-design-icons/Restart.vue';

export default {
  components: {
    SettingsIcon,
    ResetIcon,
  },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    resetSettings() {
      this.$emit('reset');
    },
    toggleSettings() {
      this.$emit('toggle');
    },
  },
};
</script>

<style lang="scss">
.settings {
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;

  .reset-icon {
    padding-right: $padding;
  }

  h3 {
    margin: 0;
    margin-bottom: 1em;
  }

  .settings-icon svg {
    position: absolute;
    top: 20px;
    right: 20px;
    fill: white;
    filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.5));
  }

  .small-button {
    width: 100%;
  }
}
</style>